import React, { Component } from 'react';
import './App.css';

import OutputBox from './components/output-box/output-box';
import InputBox from './components/input-box/input-box';
class App extends Component {
  constructor(){
    super();
    this.state = {
      messages:[{text:'שלום', me:true, key:Math.random()}]
    }
  }
  render() {
    setTimeout(()=>{
      let newMessages = this.state.messages;
      newMessages.push({text:'היי',me:false,key:Math.random()});
      this.setState({messages:newMessages});

    },1000);
    return (
      <div className="chat">
        <OutputBox messages={this.state.messages} />
        <InputBox/>
      </div>
    );
  }
}

export default App;
