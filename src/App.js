import React, { Component } from 'react';
import './App.css';

import OutputBox from './components/output-box/output-box';

class App extends Component {
  render() {
    return (
      <div className="chat">
        <OutputBox />
      </div>
    );
  }
}

export default App;
