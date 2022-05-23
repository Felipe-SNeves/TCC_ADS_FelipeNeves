import React from 'react';

export default function Title (props) {
    return (
        <div>
            <h2 style={{color: 'white', fontFamily: 'Open Sans', fontWeight: 600}}>{props.titulo}</h2>
        </div>
    );
}