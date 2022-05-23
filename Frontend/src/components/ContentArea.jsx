import React from 'react';

export default function ContentArea (props) {
    return (
        <div style={{textAlign: "center", marginTop: "3%", marginLeft: "3%", marginRight: "3%", backgroundColor: "#13A592", borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
            { props.children }
        </div>
    )
}