import React from 'react';
import { read_cookie, delete_cookie } from 'sfcookies'

import Button from 'react-bootstrap/Button';

class LogOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stayInSeconds: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            prize: 0
        }
    }

    userAccessKey = read_cookie('access_key');

    getUserData = () => {
        if (this.userAccessKey.length !== 36) {
            return;
        }
        fetch('/userdata', {
            headers: {
                Authorization: `Bearer ${this.userAccessKey}`
            }
        }).then(r => r.json()).then(data => {
            const stayInSeconds = data.length_of_visit - data.time_of_arrival;
            // console.log('sekunder:',stayInSeconds);
            const hours = Math.floor(stayInSeconds / 3.6e3);
            const minutes = Math.floor((stayInSeconds - hours * 3.6e3) / 60);
            const seconds = stayInSeconds - hours * 3.6e3 - minutes * 60;
            const prize = Math.round((stayInSeconds / 3.6e3) * this.prize);
            this.setState({
                stayInMinutes: stayInSeconds,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                prize: prize
            })
        }).catch(err => console.error(err));
        console.log('sending get request for data');
    }

    deleteUserdata = () => {
        if (this.userAccessKey.length !== 36) {
            return;
        }
        fetch('/userdata', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.userAccessKey}`
            }
        })
    }

    prize = 1200;

    goBack = () => {
        this.props.update();
    }

    pay = () => {
        delete_cookie('access_key');
        this.deleteUserdata();
        this.goBack();
    }

    componentWillMount = () => {
        setInterval(this.getUserData, 1000)
        this.getUserData();
    }

    render() {
        return (
            <div>
                <p>You have been here for {this.state.hours} hours, {this.state.minutes} minutes and {this.state.seconds} seconds.</p>
                <small>Price is {this.prize} SEK/h</small>
                <h2>Good Bye</h2>
                <div>
                    <Button onClick={() => {this.pay()}} variant="dark" size="lg">pay {this.state.prize} kr</Button>
                    <br />
                    <Button onClick={() => this.goBack()} variant="danger" size="sm">go back</Button>
                </div>
            </div>
        );
    }
}

export default LogOut;