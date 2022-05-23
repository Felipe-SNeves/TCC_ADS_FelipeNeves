import React, { useState } from 'react';
import ListItem from './ListItem';

export default function List (props) {

    const lista = props.lista;

    return (
        <div>
            {
                lista.map ((item, index) => {
                    return <ListItem acao={props.acao} codigo={index} key={index} nome={(item.nome === undefined) ? "'" + item.titulo + "'" : item.nome} />
                })
            }
        </div>
    );
}