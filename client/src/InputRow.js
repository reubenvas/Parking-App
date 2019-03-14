import React from 'react';


class InputRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialValue
        }
    }
    
    updateInput(event) {
        this.setState({
            value: event.target.value
        });
        this.props.update(event)
        console.log('child:',event.target.value);
        // props.update(event);
    }

    render() {
        return (
            <div>
                <p className="label">{this.props.text}</p>
                <input type="text" value={this.state.value} onChange={(event) => this.updateInput(event)}/>
            </div>
        );
    }
}

// InputRow.propTypes = {
//     text: React.propTypes.string
// }

export default InputRow;