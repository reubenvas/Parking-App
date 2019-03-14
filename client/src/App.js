import React from 'react';
import './App.css';
import LogIn from './LogIn';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <LogIn />          
        </header>
      </div>
    );
  }
}

export default App;
