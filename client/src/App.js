import React from 'react';
import './App.css';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies'
import LogIn from './LogIn';
import LogOut from './LogOut';


import Button from 'react-bootstrap/Button';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      logout: false
    }
  }

  enterLogInPage() {
    this.setState({
      login: true
    })
  }

  enterLogOutPage = () => {
    this.setState({
      logout: true
    })
  }

  isAccessKey() {
    return read_cookie('access_key').length === 36;
  }

  updateWholeState = () => {
    this.setState({
      login: false,
      logout: false
    })
  }

  displayContent = () => {
    if (this.state.login) return <LogIn update={this.updateWholeState} />;
    if (this.state.logout) return <LogOut update={this.updateWholeState} />;
    return this.isAccessKey()
      ? <Button onClick={() => this.enterLogOutPage()}>Check Out</Button>
      : <Button onClick={() => this.enterLogInPage()}>Check In</Button>;
  }

  render() {
    let page = this.displayContent();

    return (
      <div className="App">
        <header className="App-header">
          <h1>salt parking</h1>
          {page}
        </header>
      </div>
    );
  }
}



export default App;
