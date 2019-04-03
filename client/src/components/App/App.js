import React from 'react';
import './App.css';
import { read_cookie } from 'sfcookies'
import LogIn from '../LogIn';
import LogOut from '../LogOut';
import Button from '@material-ui/core/Button';


class App extends React.Component {
    state = {
      login: false,
      logout: false
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

  updateWholeState = () => {
    this.setState({
      login: false,
      logout: false
    })
  }

  displayContent = () => {
    if (this.state.login) return <LogIn update={this.updateWholeState} />;
    if (this.state.logout) return <LogOut update={this.updateWholeState} />;
    const button = (read_cookie('access_key').length === 36) ?
      <Button onClick={() => this.enterLogOutPage()}>Check Out</Button> :
      <Button onClick={() => this.enterLogInPage()} variant="outlined" color="primary">Check In</Button>;
    return (
      <div>
        <h1>Park Easy</h1>
        {button}
      </div>
    )
  }

  render() {
    const page = this.displayContent();

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
