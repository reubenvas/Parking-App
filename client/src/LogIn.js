import React from 'react';
import Button from 'react-bootstrap/Button';
import InputRow from './InputRow';



class LogIn extends React.Component {
    render() {
        return (
            <div>
                <h2>Register your Car information</h2>
                <hr />
                <InputRow text={'name'}/>
                <InputRow text={'car number'}/>
                <InputRow text={'car model'}/>
                
                <hr/>
                <Button className="submit">park</Button>
            </div>
        );
    }
}

export default LogIn;