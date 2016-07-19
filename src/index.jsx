// Import modules
import React from 'react';
import d3 from 'd3';
import ReactDOM from 'react-dom';
import {Card, CardTitle, Row, Col, Navbar, NavItem} from 'react-materialize';
import Simulator from './Simulator.jsx';

// Application
var App = React.createClass ({
  render() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <a className="page-title">Central Limit Theorem</a>
          </div>
        </nav>
        <div className="container">
          <section>
            <div>
              <h2>What is this?</h2>
              <div>
                <p>This is an attempt to visually explain the core concepts of the <a href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank">Central Limit Theorem</a>. By providing a variety of interactive components, this page seeks to provide an intuitive understanding of one of the foundational theories behind inferential statistics. It draws inspiration from other visual explanations, such as this one on <a href="http://www.r2d3.us/visual-intro-to-machine-learning-part-1/">decision trees</a> and these wonderful projects from <a href="http://setosa.io/">setosa.io</a>. The code is <a href="http://www.github.com/mkfreeman/central-limit">on GitHub</a>.</p>
                <p>
                  Importantly, this <strong>is not</strong> a robust explanation of the theory, and it <strong>was not</strong> written by a formally trained statistician. If you have any feedback (about the explanation, implementation, or design), feel free to reach out on <a href="http://twitter.com/mf_viz" target="_blank">on twitter</a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div>
              <h2>A Simple Starting Point</h2>
              <div>
                <p>In order to grapple with such an important theory, we'll consider a simple hypothetical situation. Let's imagine that there's a populaiton of 100 people with a distribution of opinions that range from, say, 0 - 100 on some issue. Its simple to consider those views represented along a horizontal axis as follows, with the mean opinion of that population labeled and shown as a dark line:</p>
                <Simulator charts={['popDistribution']} controls={[]} width={this.props.width} height={57} />
                <p>As a social scientist, you may be interested in measuring the disposition of this population, and describing it using information such as the mean opinion. Unfortunately, you may not have the time or funding to ask each individual their opinion. So, you may have to <strong>sample</strong> from the population at hand. Let's say you had enough time/effort to randomly sample <strong>ten individuals</strong> from your population of 100. This would give you <i>some</i> idea of how the population stands on the particular issue:</p>
                <Simulator charts={['popDistribution']} controls={['one_sample']} width={this.props.width} height={57}/>
                <p>
                    As you can see, a sample mean can differ a substantial amount from our population mean. So, <strong>how could sampling ever be reliable...?</strong>
                </p>
              </div>
            </div>

          </section>

          <section>
            <div>
              <h2>Consider Multiple Samples</h2>
              <div>
                <p>So let's say, hypothetically, that we could take multiple samples from our population. While this is something that may happen (especially with political polls), we'll use this more as an explanatory tool (there are other considerations that come into play when you actually sample repeated times that we won't consider). For each sample, let's keep track of how the <strong>sample mean</strong> compares to our <strong>population mean</strong> each time we draw a sample. Once we repeat the process multiple times, we will have a <strong>distribution of sample means</strong>, often referred to as the <strong>sampling distribution of the mean</strong> or (more simply) the <strong>sampling distribution</strong>. We'll display the distribution of sample means in a density plot below our population's density plot:</p>
                <Simulator charts={['popDistribution', 'sampleMeans']} controls={['one_sample']} width={this.props.width} height={57}/>
              </div>
            </div>
            <p>As we repeat this process, you may notice something interesting happen: the difference between our <storng>true population mean</storng> and the <storng>mean of our sample means</storng> begins to shrink. This makes sense, as it feels similar to simply drawing a larger sample (with replacement) from our population. Unfortunately, this doesn't solve the problem of limited resources for understanding a population's position on a particular issue. In order to understand the quality of a single estimate, we first need to understand what the <strong>distribution of sample means</strong> looks like.</p>
          </section>

          <section>
            <div>
              <h2>Thinking about Distributions</h2>
              <div>
                <p>The current visualization of our population's opinions as a density plot is a bit hard to decipher, so let's add a bit more information with a histogram of the opinions. This will better allow us to see the shape of the distribution:</p>
                <Simulator charts={['popDistribution']} showHist={true} controls={[]} width={this.props.width} height={100}/>
                <p>Clearly, the distribution of our data is <strong>not</strong> normal. While many natually occuring phenomenon happen to be normally distributed, many are not. Luckily, the Central Limit Theorem provides us with a strong foundation for discussing the estimation of population parameters <i>regardless</i> of whether or not the event is normally distributed.</p>
                <p>
                  As it turns out, the shape of the population's distribution isn't what will help us understand our ability to make inferences about the population. Instead, let's consider what the <strong>distribution of sample means</strong> (also known as the <strong>sampling distribution</strong>) looks like. Use the button below to take multiple repeated samples, and see how the <strong>sampling distribution</strong> begins to take form.</p>
                <Simulator charts={['popDistribution', 'sampleMeans']} showHist={true} controls={['one_sample']} width={this.props.width} height={100}/>
                <p>This is a bit tedious, so let's speed the process up a bit:</p>
                <Simulator charts={['popDistribution', 'sampleMeans']} showHist={true} controls={['toggle_sampling']} width={this.props.width} height={100}/>
                <p>As the number of samples taken increases, the <strong>sampling distribution</strong> becomes normal. This holds true <strong>regardless</strong> of whether or not the true population parameter is normally distributed. As noted above, the sampling mean (the mean of the sampling distribution) becomes increasingly accurate as the number of repetitions increases. </p>
                <Simulator charts={['popDistribution', 'errorLine']} showHist={true} controls={['toggle_sampling']} width={this.props.width} height={100}/>
              </div>
            </div>
          </section>

          <section>
            <div>
              <h2>Why it matters</h2>
              <div>
                <p>As the number of samples taken approaches infinity, the distribution of our sample means approximates the normal distribution. This foundational theory in statistics is what allows us to make inferences about populations based on an individual sample. Given our understanding of the normal distribution, we can easily discuss the probability of a value occuring given a mean. Conversely, we can then estimate <strong>the probability of a population mean given an observed sample mean</strong>. This not only allows us to provide reliable estimates of population values, but empowers us to quantify the confidence in our estimates (more on this in a future post). </p>
                <p>
                  Hopefully this explanation provided some intution to a generic defintion, such as this one from <a href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank">Wikipedia</a>:
                </p>
                <blockquote>
                  <i>The central limit theorem (CLT) states that, given certain conditions, the arithmetic mean of a sufficiently large number of iterates of independent random variables, each with a well-defined (finite) expected value and finite variance, will be approximately normally distributed, regardless of the underlying distribution.</i>
                </blockquote>
                <p>
                  Thanks for your attention, and again, feel free to reach out on <a href="http://twitter.com/mf_viz" target="_blank">on twitter</a> to share this page or provide any feedback!
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
});


// Render project page in the root
ReactDOM.render(
  <App width={570} height={100}/>
, document.querySelector('.react-root')
);
