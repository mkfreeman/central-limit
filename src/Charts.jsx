// Import modules
import React from 'react';
import d3 from 'd3';

var ChartArea = React.createClass({
  render(){
    return (
      <div className="chartArea">
        <svg width={this.props.width} height={this.props.height}>
          <g transform="translate(20, 20)">
            {this.props.children}
          </g>
        </svg>
      </div>
    )
  }
});

var Histogram = React.createClass({
    render(){
      return(
        <g transform="translate(0, -14)" className={this.props.show == true ? 'histWrapper active' : 'histWrapper'}>
          {this.props.data.map(function(d,i){
            return <rect key={'sampleRect_' + i} x={d.x} height={d.yValue} y={this.props.height - d.yValue} width ={this.props.width/this.props.data.length} className="popRect"></rect>
          }, this)}
          <path d={this.props.path} className="histPath"/>
        </g>
      )
    }
});

var DensityPlot = React.createClass({
  render(){
    return(
      <g transform = {this.props.transform}>
        {this.props.points.map(function(d){
          var className = d.selected == true ? 'circle active' : 'circle';
          return <circle className={className} key={'circle_' + d.id} cx={d.value} cy={this.props.cy} r={this.props.r} active={d.selected}/>
        }, this)}
        {this.props.lines.map(function(d){
          return <line key={d.key} className={d.className} x1={d.x1} x2={d.x2} y1={d.y1} y2={d.y2}/>
        })}
        {this.props.text.map(function(d){
          return <text key={d.key} className={d.className} x={d.x} y={d.y}>{d.text}</text>
        })}
      </g>
    )
  }
});

var ErrorLine = React.createClass({
  getLinePath(){
    var yMin = -d3.max(this.props.data, function(d){return Math.abs(d)});
    var yMax = d3.max(this.props.data, function(d){return Math.abs(d)});
    var xMin = 0;
    var xMax = this.props.data.length;
    var xScale = d3.scale.linear().range([0, this.props.width]).domain([xMin, xMax]);
    var yScale = d3.scale.linear().range([this.props.height, 0]).domain([yMin, yMax]);
    var lineGen = d3.svg.line()
                  .interpolate('cardinal')
                  .x(function(d, i){return xScale(i)})
                  .y(function(d){return yScale(d)});
    return lineGen(this.props.data);
  },
  render(){
    var linePath = this.getLinePath();
    return(
      <g transform={this.props.transform}>
        <line x1={0} x2={this.props.width} y1={this.props.height/2} y2={this.props.height/2} className="horizontal"/>
        <line x1={0} x2={0} y1={0} y2={this.props.height} className="horizontal"/>
        <text transform={"translate(-5," + this.props.height/2 + ") rotate(-90)"} className='axisLabel'>% error</text>
        <text transform={"translate(" + this.props.width + "," + (this.props.height/2 + 3) + ")"} className='lineLabel'>truth</text>
        <path d={linePath} className="histPath"/>
      </g>
    )
  }
});

export {ChartArea, DensityPlot, Histogram, ErrorLine};
