import React, { Component } from 'react';
import './input-box.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';

class InputBox extends Component {
  constructor() {
    super();
    this.state = {
      dialogOpen: false,
      msgText: ""
    };
  }

  //when user enters text: add it to state
  HandleTextInput = (e) => {
    this.setState({ msgText: e.target.value });
  }

  //open dialog
  HandelDialogOpen = () => {
    if (this.props.inChat) {
      this.setState({ dialogOpen: true });
    }

  }

  //close dialog
  HandelDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  //end chat
  handleEndChat = () => {
    if (this.props.inChat) {
      this.props.onEndChat();
    }

    this.HandelDialogClose();
  }

  //send msg if user presses enter
  handleEnterPressed = (e) => {
    if (e.key === 'Enter') {
      this.handleSendMsg();
    }
  }

  //send msg
  handleSendMsg = () => {
    //if user is in chat AND thier msg is not empty send message to AppComponent
    if (this.props.inChat && this.state.msgText !== '') {
      this.props.onMessageSent(this.state.msgText);
      this.setState({ msgText: '' });
    }
  }
  render() {
    return (
      <Paper className="input-box" elevation={2}>
        <Button onClick={this.HandelDialogOpen} className="exit-btn" variant="text" size="small"><Icon className='rtl'>autorenew</Icon></Button>

        <InputBase value={this.state.msgText} onChange={this.HandleTextInput} onKeyPress={this.handleEnterPressed} className="msg-input" placeholder="הודעה..." />

        <Button onClick={this.handleSendMsg} className="send-btn" variant="contained" color="primary"><Icon className='rtl'>send</Icon></Button>

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.HandelDialogClose}
        >
          <DialogTitle>לסיים שיחה?</DialogTitle>
          <DialogContent>
            <DialogContentText>לסיים ולהתחיל שיחה חדשה?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleEndChat} color="primary" autoFocus>
              כן
          </Button>
            <Button onClick={this.HandelDialogClose} color="primary">
              לא
          </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    );
  }
}

export default InputBox;
