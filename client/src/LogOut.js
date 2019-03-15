import React from 'react';
import { read_cookie, delete_cookie } from 'sfcookies'

import Button from 'react-bootstrap/Button';

class LogOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stayInMinutes: 0,
            hours: 0,
            minutes: 0
        }
    }

    getUserData = () => {
        const userAccessKey = read_cookie('access_key');
        if (userAccessKey.length !== 36) {
            return;
        }
        fetch('http://localhost:5000/get_userdata', {
            headers: {
                Authorization: `Bearer ${userAccessKey}`
            }
        }).then(d => d.json()).then(data => {
            const stayInMinutes = data.length_of_visit - data.time_of_arrival;
            const hours = Math.floor(stayInMinutes/60);
            const minutes = stayInMinutes - hours * 60;
            this.setState({
                stayInMinutes: stayInMinutes,
                hours: hours,
                minutes: minutes
            })
        })
    }

    calculatePrize = () => {
        return Math.round(this.state.stayInMinutes * 20 / 60);
    }

    goBack = () => {
        this.props.update();
    }

    pay = () => {
        delete_cookie('access_key');
        this.goBack();
    }

    render() {
        this.getUserData();
        const prize = this.calculatePrize();
        return (
            <div>
                <p>You have been here for {this.state.hours} hours and {this.state.minutes} minutes</p>
                <small>Price is 20 SEK/h</small>
                <h2>Good Bye</h2>
                <div>
                    <Button onClick={() => {this.pay()}} variant="dark" size="lg">pay {prize} kr</Button>
                    <br />
                    <Button onClick={() => this.goBack()} variant="danger" size="sm">go back</Button>
                </div>
            </div>
        );
    }
}

export default LogOut;