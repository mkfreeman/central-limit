// Import dependencies
import React from 'react';

var Controls = React.createClass({
  render(){
    return (<div>
        {this.props.buttons.map(function(button){
          return <button key={button.id} className="btn" onClick={button.onClick}>{button.text}</button>
        })}
    </div>)
  }
});

export default Controls;
