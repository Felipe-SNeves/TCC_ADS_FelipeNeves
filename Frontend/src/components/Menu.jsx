import React from 'react';

export default function Menu (props) {
    return (
        <div style={{textAlign: "center", paddingTop: 25, backgroundColor: '#13A592'}}>
            { props.children }
        </div>
    );
}