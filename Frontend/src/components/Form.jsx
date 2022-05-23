import React from 'react';

export default function Form (props) {
    return (
        <div style={{textAlign: 'left', marginLeft: props.margemEsquerda}}>
            <form method="post" encType="multipart/form-data">
                {
                    props.children
                }
            </form>
        </div>
    );
}