import React from 'react';

export default function Text (props) {
    return (
        <div>
            <p style={{color: 'white', fontFamily: 'Open Sans', fontWeight: '400', fontSize: props.tamanhoFonte}}>{props.texto}</p>
        </div>
    );
}