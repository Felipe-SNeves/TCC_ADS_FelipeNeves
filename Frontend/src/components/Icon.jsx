import React from 'react';

export default function Icon (props) {
    return (
        <div onClick={props.onClick === undefined ? null : props.onClick} style={{backgroundColor: props.sty.backgroundColor, borderRadius: '100%', height: props.sty.height, width: props.sty.width, padding: 10, boxShadow: "0px 10px 10px -5px", marginLeft: props.sty.margem }}>
            <img src={props.URLImagemIcone} alt="Imagem do icone" style={{height: props.sty.height, width: props.sty.width}} />
        </div>
    );
}