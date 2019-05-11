import React, { Component } from 'react';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import './system-message.css';

class SystemMessage extends Component {
    constructor() {
        super();
        this.msg = null;
    }


    render() {
        switch (this.props.type) {
            case 0:
                this.msg = 'התחברת לשיחה, תגיד/י שלום';
                break;
            case 1:
                this.msg = <span>
                    <p>פלוני התנתק מהשיחה</p>
                    <Button onClick={this.props.onRequestChat} variant="contained" color="primary">התחל שיחה חדשה</Button>
                </span>;
                break;
            case 2:
                this.msg = 'מחפש שותף לשיחה...';
                break;
            default:
                this.msg = null;
        }

        return (
            <Grow in={true}>
                <div className="msg system-msg">{this.msg}</div>
            </Grow>
        );
    }
}

export default SystemMessage;