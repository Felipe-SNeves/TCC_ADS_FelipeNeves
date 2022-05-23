import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Title from '../components/Title';
import Text from '../components/Text';
import Form from '../components/Form';
import axios from 'axios';

export default function Recover (props) {

    const [senha, setSenha] = useState ('');
    const [confirmacaoSenha, setConfirmacao] = useState ('');
    const navigate = useNavigate ();

    const restaurar = () => {
        if (senha === "" || confirmacaoSenha === "") {
            alert ("Preencha os campos para restaurar a senha!");
            return false;
        }

        if (senha !== confirmacaoSenha) {
            alert ("A senha e a confirmacao de senha não conferem! Tente novamente!");
            return false;
        }

        let email = new URLSearchParams (window.location.search).get ("token");

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/recover/" + email, {
            senha: senha
        }).then ((res) => {
            alert ("Senha alterada!");
        }).catch ((error) => {
            alert ("Não foi possível alterar a senha! Tente novamente!");
            console.error (error);
        }) && navigate ("/");

    }

    return (
        <div style={{marginTop: 20, marginLeft: "10%", width: "80%"}}>
            <Card altura={375} espacamento={5}>
                <Title titulo="Recuperar a senha" />
                <hr style={{color: "white", width: "80%"}} />
                <Form margemEsquerda="15%">    
                    <Text tamanhoFonte={20} texto="Preencha os campos abaixo para criar uma senha nova!" />
                    <Input tipo="password" legenda="Nova senha" legendaInput="Insira a nova senha" comprimento={300} onChange={(event) => { setSenha (event.target.value) }} />
                    <Input tipo="password" legenda="Confirme a senha" legendaInput="Confirme a nova senha" comprimento={300} onChange={(event) => { setConfirmacao (event.target.value) }} />
                    <Button cor="#0743AB" acao={() => { restaurar (); }} titulo="Alterar senha" />
                </Form>
            </Card>
        </div>
    );
}