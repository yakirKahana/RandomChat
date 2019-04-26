import React, { Component } from 'react';
import './App.css';

import OutputBox from './components/output-box/output-box';
import InputBox from './components/input-box/input-box';
import io from 'socket.io-client';
import e2ee from './e2ee';
console.log(e2ee);
class App extends Component {
  constructor() {
    super();
    this.socket = io.connect();
    this.e2e = new e2ee();
    this.state = {
      messages: [{ text: 'שלום', me: true, key: Math.random() }]
    }
  }

  handleMessageSent = (msgText) => {
    let newMessages = this.state.messages;
    newMessages.push({ text: msgText, me: true, key: Math.random() });
    this.setState({ messages: newMessages });
  }

  render() {
    console.log(this.e2e);
    setTimeout(() => {
      let newMessages = this.state.messages;
      newMessages.push({ text: 'היי', me: false, key: Math.random() });
      this.setState({ messages: newMessages });

    }, 5000);
    return (
      <div className="chat">
        <OutputBox messages={this.state.messages} />
        <InputBox onMessageSent={this.handleMessageSent} />
      </div>
    );
  }


}

export default App;
