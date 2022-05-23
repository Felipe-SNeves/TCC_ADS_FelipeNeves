import React from 'react';

export default function Input (props) {

    return (
        <div style={{marginTop: 15}}>
            <legend style={{color: 'white', fontFamily: 'Open Sans', fontWeight: '400', fontSize: 18}}>{props.legenda}</legend>
            {
                props.disabled === undefined && <>
                    <input onChange={props.onChange} type={props.tipo} style={{ borderStyle: 'none', height: 32, borderRadius: 10, paddingLeft: 15, fontSize: 18, width: props.comprimento }} placeholder={props.legendaInput} value={props.value} />
                </>
            }
            {
                props.disabled !== undefined && <>
                    <input disabled onChange={props.onChange} type={props.tipo} style={{ borderStyle: 'none', height: 32, borderRadius: 10, paddingLeft: 15, fontSize: 18, width: props.comprimento }} placeholder={props.legendaInput} value={props.value} />
                </>
            }
        </div>
    );
}