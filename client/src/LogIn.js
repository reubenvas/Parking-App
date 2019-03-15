import React from 'react';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies'

import Button from 'react-bootstrap/Button';
import InputRow from './InputRow';



class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameError: '',
            car_number: '',
            car_numberError: '',
            car_model: '',
            car_modelError: ''
        }
    }


    render() {

        const updateValueName = (event) => {
            this.setState({
                name: event.target.value
            });
        }

        const updateValueCarNumber = (event) => {
            this.setState({
                car_number: event.target.value
            });
        }

        const updateValueCarModel = (event) => {
            this.setState({
                car_model: event.target.value
            });
        }

        const goBack = () => {
            this.props.update();
        }

        const validate = () => {
            let isError = false;
            const errors = {
                nameError: "",
                car_numberError: "",
                car_modelError: ""
              };

            const { name, car_number, car_model } = this.state;

            if (!/^[A-Za-z]*\s[A-Za-z]*$/.test(name)) {
                isError = true;
                errors.nameError = 'Must contain firs- & last Name'
            }

            if (!/[a-zA-z]{3}\d{3}/.test(car_number)) {
                isError = true;
                errors.car_numberError = 'Must be in format: ABC123'
            }

            if (!['volvo', 'saab'].includes(car_model.toLocaleLowerCase())) {
                isError = true;
                errors.car_modelError = 'Must be of model "Saab" or "Volvo"'
            }

            if(isError) {
                this.setState({
                    ...this.state,
                    ...errors
                })
            }
            return isError;
        }

        const submitData = async () => {
            console.log(this.state.name);
            const err = validate();
            if (!err) {
                // 'name=Reuben_Vas&car_number=ABC123&car_model=Volvo'
                const msg = `name=${this.state.name}&car_number=${this.state.car_number}&car_model=${this.state.car_model}`
                const response = await fetch('http://localhost:5000/submit_userdata', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: msg
                }).then(res => res.text())
                bake_cookie('access_key', response);
                goBack();
            }
        }


        return (
            <div>
                <h2>Register your Car information</h2>
                <hr />
                <InputRow text={'name'} initialValue={this.state.name} errorText={this.state.nameError} update={updateValueName} />
                <InputRow text={'car number'} initialValue={this.state.car_number} errorText={this.state.car_numberError} update={updateValueCarNumber} />
                <InputRow text={'car model'} initialValue={this.state.car_model} errorText={this.state.car_modelError} update={updateValueCarModel} />

                <hr />
                <Button onClick={submitData} variant="info" size="lg">park</Button>
                <br />
                <Button onClick={() => goBack()} variant="light" size="sm">cancel</Button>
            </div>
        );
    }
}

export default LogIn;