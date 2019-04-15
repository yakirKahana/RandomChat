import React, { Component } from 'react';
import './App.css';

import OutputBox from './components/output-box/output-box';
import InputBox from './components/input-box/input-box';
class App extends Component {
  render() {
    return (
      <div className="chat">
        <OutputBox />
        <InputBox/>
      </div>
    );
  }
}

export default App;
