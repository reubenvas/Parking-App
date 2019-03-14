import React from 'react';

const InputRow = (props) => {
    return (
        <div>
            <p className="label">{props.text}</p>
            <input type="text" />
        </div>
    );
}

export default InputRow;