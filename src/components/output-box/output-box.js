import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import './output-box.css';

class OutputBox extends Component {
  render() {
    return (
      <Paper className="paper" elevation={2}>
        <Grow in={true}><div className="msg"><span className="sender me">אני</span>הודעה</div></Grow>
        <Grow in={true}><div className="msg"><span className="sender stranger">פלוני</span>הודעה</div></Grow>
      </Paper>
    );
  }
}

export default OutputBox;
