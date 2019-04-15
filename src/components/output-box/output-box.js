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


  render() {
    setTimeout(()=>{
      let newMessages = this.state.messages;
      newMessages.push({text:'היי',me:false,key:Math.random()});
      this.setState({messages:newMessages});
    },10000);
    return (
      <Paper className="output-box" elevation={2}>
        {this.state.messages.map(msg=>{
          return <Message key={msg.key} text={msg.text} me={msg.me}/>
        })}
      </Paper>
    );
  }
}

export default OutputBox;
