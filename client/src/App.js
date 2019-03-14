import React from 'react';
import './App.css';
import propTypes from 'prop-types';
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
