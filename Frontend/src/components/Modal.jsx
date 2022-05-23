import React from 'react';

export default function Modal (props) {
    return (
        <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.6)"}}>
            <div style={{position: "fixed", background: "#13A592", width: "40%", height: "auto", top: "50%", left: "50%", transform: "translate(-50%,-50%)", padding: 20, borderRadius: 15}}>
                { props.children }
            </div>
        </div>
    );
}