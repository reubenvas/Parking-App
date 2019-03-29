import React from 'react';

import TextField from '@material-ui/core/TextField';

import { Popover, OverlayTrigger } from 'react-bootstrap';


class InputRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialValue,
            errorText: this.props.errorText,
        }
    }

    beautifyInput = name => input => {
        if (name === 'Registration Number') {
            return input.toUpperCase();
        }
        return input
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')

    }

    updateInput = (event) => {
        console.log(event.target)
        this.setState({
            value: this.beautifyInput(this.props.text)(event.target.value),
        });
        this.props.update(event);
        console.log('child:', event.target.value);
        // props.update(event);
    }

    popover = (
        <Popover styleid="popover-basic">
            {this.props.popover}
        </Popover>
    );

    render() {
        console.log('error:', this.props.errorText)

        return (
            <div>
                <OverlayTrigger trigger="hover" placement="right" overlay={this.popover}>
                    <TextField
                        // does not look good
                        label={this.props.text}

                        value={this.state.value}
                        onChange={(event) => this.updateInput(event)}

                        error={this.props.errorText !== ''}
                        helperText={this.props.errorText === "" ? '    ' : this.props.errorText}
                    />
                </OverlayTrigger>
            </div>
        );
    }
}

// InputRow.propTypes = {
//     text: React.propTypes.string
// }

export default InputRow;