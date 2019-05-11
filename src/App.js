import React, { Component } from 'react';
import './App.css';

import OutputBox from './components/output-box/output-box';
import InputBox from './components/input-box/input-box';
import io from 'socket.io-client';
import e2ee from './e2ee';

class App extends Component {
  constructor() {
    super();
    this.io = new io('localhost:7777'); //TODO: remove arg before production
    this.socket = this.io.connect();
    this.e2e = new e2ee();
    this.uid = Math.floor(Math.random() * 900000000);
    this.state = {
      messages: [],
      inChat: false
    }

  }

  componentDidMount() {
    this.socket.emit('new-user', this.uid);
    this.handleRequestChat();

    //eventListeners
    this.socket.on('new-partner', data => {
      this.partnerID = data;

      let newState = this.state;
      newState.inChat = true;
      newState.messages = [];
      newState.messages.push({ sysMsg: true, type: 0, key: Math.random() });
      this.setState(newState);
      this.socket.emit('got-partner', this.uid);
      this.socket.emit('dh-send', { key: this.e2e.dh.PublicExported, to: this.partnerID });
    });


    this.socket.on('new-msg', (data) => {

      this.e2e.decrypt(data.msg).then(d => {

        let newMessages = this.state.messages;
        newMessages.push({ text: d, me: false, key: Math.random() });
        this.setState({ messages: newMessages });
      });

    });

    this.socket.on("dh-get", data => {
      this.e2e.dh.generateSharedKey(data);
    });

    // when partenr disconnects -> set this.state.inChat to false, notify users that partner ended the chat
    this.socket.on('partner-disconnect', () => {
      let newState = this.state;
      newState.inChat = false;
      newState.messages.push({ sysMsg: true, type: 1, key: Math.random() });
      this.setState(newState);
    });

  }

  //when requesting chat ->req new chat from server, clean messages, add systemMessage of 'looking for chat', 
  handleRequestChat = () => {
    this.socket.emit('chat-request', this.uid);
    let newState = this.state;
    newState.messages = [];
    newState.messages.push({ sysMsg: true, type: 2, key: Math.random() });
    this.setState(newState);
  }


  //when sending message -> add to state, encrypt and send
  handleMessageSent = (msgText) => {
    //add to state
    let newMessages = this.state.messages;
    newMessages.push({ text: msgText, me: true, key: Math.random() });
    this.setState({ messages: newMessages });
    //encrypt message and send
    this.e2e.encrypt(msgText).then(e => {
      this.socket.emit("send-msg", { msg: e, to: this.partnerID });
    });
  }


  //when user ends chat -> send message to server, and request a new chat
  handleEndChat = () => {
    this.socket.emit('end-chat', this.partnerID);
    this.handleRequestChat();
  }

  render() {

    return (
      <div className="chat">
        <OutputBox onRequestChat={this.handleRequestChat} inChat={this.state.inChat} messages={this.state.messages} />
        <InputBox inChat={this.state.inChat} onEndChat={this.handleEndChat} onMessageSent={this.handleMessageSent} />
      </div>
    );
  }


}

export default App;
