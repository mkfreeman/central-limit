// Import dependencies
import React from 'react';
import _ from 'underscore';
import d3 from 'd3';
import Controls from './Controls';
import {ChartArea, DensityPlot, Histogram, ErrorLine} from './Charts';

var Simulator = React.createClass({
  getInitialState:function(){
    // Set initial population
    var sampleSize = 10;
    var populationSize = 100;
    var chartWidth = this.props.width - 57
    var pop = _.range(populationSize).map(function(d, i){
      var value = Math.random() * chartWidth;
      return {id:d, value: value, selected:0}

    }, this);
    return {showHist:this.props.showHist, population:pop, populationSize:populationSize, sampleSize:sampleSize, circleHeight:20, sampleMeans:[]}
  },
  getHistData(data){
    var layout = d3.layout.histogram()
                .bins(20)
                .range([0, this.props.width])
                .value(function(d){return d.value});

    var histData = layout(data);
    // yScale for histogram
  	var yScale = d3.scale.linear()
  		          .domain([0, d3.max(histData, function(d) { return d.y; })])
  		          .range([0, this.props.height - 57]);
    histData.map(function(d){
      d.yValue = yScale(d.y)
    })
    return histData
  },
  getMean(data){
    if(data.length == 0) return null;
    var sum = 0;
    data.map(function(d){
      sum += d.value;
    });
    return sum / data.length;
  },
  getPath(data){
    var pathGen = d3.svg.line()
                     .x(function(d) {return d.x + this.props.width/(2*data.length)}.bind(this))
                     .y(function(d) {return this.props.height - d.yValue - 57}.bind(this))
                     .interpolate('cardinal');
    return pathGen(data);
  },
  sample(){
    // Randomly sample `sampleSize` values from the population
    this.clearSample()
    var indicies = _.sample(_.range(this.state.populationSize), this.state.sampleSize)
    var pop = this.state.population;
    var sum = 0;
    indicies.map(function(d){
      pop[d].selected = 1;
      sum += pop[d].value;
    }, this)
    var sampleMean = sum / this.state.sampleSize;
    var sampleMeans = this.state.sampleMeans.concat({id:this.state.sampleMeans.length, value:sampleMean});
    this.setState({sampleMeans:sampleMeans, showSampleError:true});
  },
  clearSample(){
    var pop = this.state.population.map(function(d){
      d.selected = false;
      return d
    })
    this.setState({population:pop})
  },
  startSampling(){
    this.setState({currentlySampling:true});
    this.interval = setInterval(function() {
      this.sample()
    }.bind(this), 100)
  },
  stopSampling(){
    clearInterval(this.interval);
    this.setState({currentlySampling:false});
  },
  toggleHist() {
    var showHist = this.state.showHist == true ? false : true;
    this.setState({showHist:showHist})
  },
  getRunningAverage(data, denominator){
    var averages = [];
    data.map(function(d, i){
      var subset = data.slice(0, i)
      var val = (this.getMean(subset) - denominator) / denominator;
      averages = averages.concat(val);
    }, this);
    return averages;
  },
  toggleSampling(){
    if(this.state.currentlySampling == true) this.stopSampling()
    else this.startSampling()
  },
  getControls(){
    var histogramButtonText = this.state.showHist == true ? 'Hide Histogram' : 'Show Histograms';
    var samplingButtonText = this.state.currentlySampling == true ? 'Stop Sampling' : 'Start Sampling';
    var controls = this.props.controls.map(function(d){
      switch(d) {
        case 'one_sample':
          var button = {id:"one_sample", text:"Take a Sample", onClick:this.sample};
          break;
        case 'toggle_sampling':
          var button = {id:"toggle_sampling", text:samplingButtonText, onClick:this.toggleSampling};
          break;
        case 'toggle_hist':
          var button = {id:"toggle_hist", text:histogramButtonText, onClick:this.toggleHist}
      };
      return button
    }, this);
    return controls;
  },
  render() {
    // Compute chart values from data
    var popMean = this.getMean(this.state.population);
    var currentSample = this.state.population.filter(function(d) {
      return d.selected == true;
    });
    var sampleMean = this.getMean(currentSample)
    var meanOfMeans = this.getMean(this.state.sampleMeans);
    var popHistData = this.getHistData(this.state.population);
    var sampleHistData = this.getHistData(this.state.sampleMeans);
    var popHistPath = this.getPath(popHistData);
    var sampleHistPath = this.getPath(sampleHistData);
    var runningError = this.getRunningAverage(this.state.sampleMeans, popMean);

    // Actions for controls
    var controls = this.getControls();

    // Lines for population DensityPlot
    var popDensityLines = [{key:'popLine', x1:popMean, x2:popMean, y1:0, y2:this.state.circleHeight, className:"popMean"}];

    // Text for population DensityPlot
    var popDensityText = [{key:'popText', className:"popLabel", x:popMean, y: -2, text:"Population Mean"}];

    if(sampleMean != null) {
      popDensityLines = popDensityLines.concat({key:'sampleLine', x1:sampleMean, x2:sampleMean, y1:0, y2:this.state.circleHeight, className:"sampleMean"});
      popDensityText = popDensityText.concat({key:'sampleText', className:"sampleLabel", x:sampleMean, y:1.5*this.state.circleHeight + 2, text:"Sample Mean"});
    };

    // Sample DensityPlot lines, text
    var sampleDensityLines = [];
    var sampleDensityText = [];
    if(meanOfMeans != null) {
      sampleDensityLines = [{key:'sampleLine', x1:meanOfMeans, x2:meanOfMeans, y1:0, y2:this.state.circleHeight, className:"sampleMean"}];
      sampleDensityText = [{key:'sampleText', className:"sampleLabel", x:meanOfMeans, y: -2, text:"Mean of Means"}];
    };

    var densityOffset = this.state.showHist == true? this.props.height - 57 : 0;
    // Render HTML elements
    return(
      <div className="chart">
        <Controls buttons={controls} />
        {this.props.charts.map(function(chart, i){
          switch(chart){
            case 'popDistribution':
              return (
                <ChartArea key={'chart_' + i} width={this.props.width} height={this.props.height}>
                  <DensityPlot
                    points={this.state.population}
                    r={this.state.circleHeight/2}
                    cy = {this.state.circleHeight/2}
                    transform={"translate(0," + densityOffset + ")"}
                    lines={popDensityLines}
                    text={popDensityText}
                  />
                  <Histogram
                    path={popHistPath}
                    data={popHistData}
                    height={this.props.height - 57}
                    width={this.props.width}
                    show={this.state.showHist}
                  />

                </ChartArea>
              );
              break;
            case 'sampleMeans':
              return(
                <ChartArea key={'chart_' + i} width={this.props.width} height={this.props.height}>
                  <DensityPlot
                    points={this.state.sampleMeans}
                    r={this.state.circleHeight/2}
                    cy = {this.state.circleHeight/2}
                    transform={"translate(0, " + densityOffset + ")"}
                    lines={sampleDensityLines}
                    text={sampleDensityText}
                  />
                  <Histogram
                    path={sampleHistPath}
                    data={sampleHistData}
                    height={this.props.height - 57}
                    width={this.props.width}
                    show={this.state.showHist}
                  />
                </ChartArea>
              );
              break;
            case 'errorLine':
              return(
                <ChartArea key={'chart_' + i} width={this.props.width} height={this.props.height + 40}>
                  <ErrorLine transform={"translate(0,0)"} height={100} width={this.props.width - 57} data={runningError}/>
                </ChartArea>
              );
              break;
            default:
              break;
          }
        }, this)}
      </div>
    )
  }
});

export default Simulator;
