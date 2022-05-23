import React from 'react';

export default function Button (props) {
    return (
        <div style={{textAlign: 'center', marginTop: 30}}>
            <button onClick={props.acao} type="button" style={{
                color: 'white',
                fontFamily: 'Open Sans',
                backgroundColor: props.cor,
                borderStyle: 'none',
                borderRadius: 15,
                width: 172,
                height: 33,
                fontSize: 20,
                boxShadow: "0px 10px 15px -7px rgba(0, 0, 0, 1)",
            }}>{props.titulo}</button>
        </div>
    );
}