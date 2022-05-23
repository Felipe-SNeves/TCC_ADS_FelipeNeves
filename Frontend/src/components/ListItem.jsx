import React from 'react';

export default function ListItem (props) {

    return (
        <div onClick={() => { props.acao (props.codigo) }} style={{textAlign: "left", marginLeft: "10%", marginTop: "1%", width: "80%", backgroundColor: "#FFFFFF", borderRadius: 15, paddingLeft: 10, paddingTop: 1, paddingBottom: 1}}>
            <p style={{fontFamily: "Open Sans", margin: 5}}>{props.nome.split ("'")[1]}</p>
        </div>
    );
}