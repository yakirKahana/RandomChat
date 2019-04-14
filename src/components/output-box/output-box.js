import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Message from '../message/message';
import './output-box.css';

class OutputBox extends Component {
  render() {
    return (
      <Paper className="paper" elevation={2}>
        <Message text="שלום!" me={true}/>
        <Message text="היי" me={false}/>
      </Paper>
    );
  }
}

export default OutputBox;
