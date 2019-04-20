import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Message from '../message/message';
import './output-box.css';

class OutputBox extends Component {


  scrollToBottom(){
    this.messagesEnding.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  render() {

    return(
      <Paper id="output" className="output-box" elevation={2}>
        {this.props.messages.map(msg=>{
          return <Message key={msg.key} text={msg.text} me={msg.me}/>
        })}

        <span ref={element =>{this.messagesEnding = element}}></span>
      </Paper>
    );
  }
}

export default OutputBox;
