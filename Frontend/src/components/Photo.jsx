import React from 'react';

export default function Photo (props) {
    return (
        <div>
            <img src={props.URLImagem} alt="Foto de perfil" style={{borderRadius: "100%", width: 70, height: 70, boxShadow: "0px 10px 10px -5px"}} />
        </div>    
    );
}