import React from 'react';

export default function Card (props) {
    return (
        <div style={{marginLeft: props.margemEsquerda, marginTop: props.margemTopo, width: props.largura, height: props.altura, backgroundColor: '#13A592', borderRadius: 15, textAlign: 'center', paddingTop: 20, padding: props.espacamento}}>
            {
                props.children
            }
        </div>
    );
}