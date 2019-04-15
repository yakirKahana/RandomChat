import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Message from '../message/message';
import './output-box.css';

class OutputBox extends Component {
  constructor(){
    super();
    this.state = {
      messages:[{text:'שלום', me:true, key:Math.random()}]
    }
  }

  scrollToBottom(){
    this.messagesEnding.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  render() {
    setTimeout(()=>{
      let newMessages = this.state.messages;
      newMessages.push({text:'היי',me:false,key:Math.random()});
      this.setState({messages:newMessages});

    },100);
    return(
      <Paper id="output" className="output-box" elevation={2}>
        {this.state.messages.map(msg=>{
          return <Message key={msg.key} text={msg.text} me={msg.me}/>
        })}

        <span ref={element =>{this.messagesEnding = element}}></span>
      </Paper>
    );
  }
}

export default OutputBox;
