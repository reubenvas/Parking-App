import React from 'react';
import { bake_cookie } from 'sfcookies'

import Button from '@material-ui/core/Button';
// import Button from 'react-bootstrap/Button';
import InputRow from './InputRow';



class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameError: '',
            registration_number: '',
            registration_numberError: '',
            car_model: '',
            car_modelError: '',
        }
    }


    render() {

        const updateValue = stateProperty => event => {
            this.setState({
                [stateProperty]: event.target.value
            });
        }

        const goBack = () => {
            this.props.update();
        }

        const validate = () => {
            let isError = false;
            const errors = {};

            const { name, registration_number, car_model } = this.state;

            if (!/^[A-Öa-ö]*\s[A-Öa-ö]*$/.test(name)) {
                isError = true;
                errors.nameError = 'Must contain firs- & last Name'
            } else if (/^[A-Öa-ö]*\s[A-Öa-ö]*$/.test(name)) {
                errors.nameError = '';
            }

            if (!/^[a-öA-Ö]{3}\d{3}$/.test(registration_number)) {
                isError = true;
                errors.registration_numberError = 'Must be in format: ABC123'
            } else if (/^[a-öA-Ö]{3}\d{3}$/.test(registration_number)) {
                errors.registration_numberError = '';
            }

            if (!['volvo', 'saab'].includes(car_model.toLocaleLowerCase())) {
                isError = true;
                errors.car_modelError = 'Should be "Saab" or "Volvo"'
            } else if (['volvo', 'saab'].includes(car_model.toLocaleLowerCase())) {
                errors.car_modelError = '';
            }

            if (isError) {
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
                // 'name=Reuben_Vas&registration_number=ABC123&car_model=Volvo'
                const msg = `name=${this.state.name}&registration_number=${this.state.registration_number}&car_model=${this.state.car_model}`
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
                <InputRow
                    text={'Name'}
                    initialValue={this.state.name}
                    errorText={this.state.nameError}
                    update={updateValue('name')}
                    popover={'Reuben Reubensson'}
                />
                <InputRow
                    text={'Registration Number'}
                    initialValue={this.state.registration_number}
                    errorText={this.state.registration_numberError}
                    update={updateValue('registration_number')}
                    popover={'REU831'}
                />
                <InputRow
                    text={'Car Model'}
                    initialValue={this.state.car_model}
                    errorText={this.state.car_modelError}
                    update={updateValue('car_model')}
                    popover={'Volvo'}
                />
				<Button 
				onClick={submitData} 
				raised>
				park
				</Button>
                <Button onClick={() => goBack()} variant="light" size="sm">cancel</Button>
            </div>
        );
    }
}

export default LogIn;