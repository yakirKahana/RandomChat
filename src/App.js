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
    this.io = new io('localhost:7777'); //TODO: remove arg before production
    this.socket = this.io.connect();
    this.e2e = new e2ee();
    this.uid = Math.floor(Math.random() * 900000000);
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    this.socket.emit('new-user', this.uid);
    this.socket.emit('chat-request', this.uid);

    //eventListeners
    this.socket.on('new-partner', data => {
      this.partnerID = data;
      console.log(this.partnerID);
      this.inChat = true;
      this.socket.emit('got-partner', this.uid);
      this.socket.emit('dh-send', { key: this.e2e.dh.PublicExported, to: this.partnerID });
    });


    this.socket.on('new-msg', (data) => {
      // this.e2e.decrypt(data.msg).then(d => {
      console.log(data.msg);
      let newMessages = this.state.messages;
      newMessages.push({ text: data.msg, me: false, key: Math.random() });
      this.setState({ messages: newMessages });
      // });

    });

  }

  handleMessageSent = (msgText) => {
    let newMessages = this.state.messages;
    newMessages.push({ text: msgText, me: true, key: Math.random() });
    this.setState({ messages: newMessages });
    // this.e2e.encrypt(msgText).then(e => {
    this.socket.emit("send-msg", { msg: msgText, to: this.partnerID });
    // });
  }

  render() {

    return (
      <div className="chat">
        <OutputBox messages={this.state.messages} />
        <InputBox onMessageSent={this.handleMessageSent} />
      </div>
    );
  }


}

export default App;
