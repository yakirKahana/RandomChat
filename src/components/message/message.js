import React, { Component } from 'react';
import Grow from '@material-ui/core/Grow';
import './message.css';

class Message extends Component {



  render() {

    return (
      <Grow in={true}>
        <div className="msg">
          <span className={this.props.me ? "sender me" : "sender stranger"}>{this.props.me ? "אני" : "פלוני"}</span>
          {this.props.text}
        </div>
      </Grow>
    );
  }


}

export default Message;
