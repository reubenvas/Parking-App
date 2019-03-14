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

  enterLogOutPage() {
    this.setState({
      logout: true
    })
  }

  render() {
    let page;
    if (this.state.login) {
      page = <LogIn />;
    } else if (this.state.logout) {
      page = <LogOut />;
    } else {
      page =
        <div>
          <Button onClick={() => this.enterLogInPage()}>Check In</Button>
          <Button onClick={() => this.enterLogOutPage()}>Check Out</Button>
        </div>
    }

    return (
      <div className="App">
        <header className="App-header">
          {page}
        </header>
      </div>
    );
  }
}



export default App;
