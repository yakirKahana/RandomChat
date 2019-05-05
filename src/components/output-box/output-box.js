import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Message from '../message/message';
import SystemMessage from '../system-message/system-message';
import './output-box.css';



class OutputBox extends Component {


  scrollToBottom() {
    this.messagesEnding.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {

    return (
      <Paper id="output" className="output-box" elevation={2}>

        {this.props.messages.map(msg => {

          if (!msg.sysMsg) {
            return <Message key={msg.key} text={msg.text} me={msg.me} />
          } else {
            return <SystemMessage type={msg.type} />
          }

        })}

        <span ref={element => { this.messagesEnding = element }}></span>
      </Paper>
    );
  }
}

export default OutputBox;
