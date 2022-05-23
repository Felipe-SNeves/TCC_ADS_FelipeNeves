import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '../store/userReducer';
import ContentArea from '../components/ContentArea';
import Input from '../components/Input';
import Title from '../components/Title';
import Menu from '../components/Menu';
import Photo from '../components/Photo';
import Button from '../components/Button';
import Form from '../components/Form';
import Text from '../components/Text';
import axios from 'axios';

export default function AddAdmin (props) {

    const state = useSelector (estado => estado.dadosUsuario);
    const dispatch = useDispatch ();
    const navigate = useNavigate ();
    const [nomeAdm, setNomeAdm] = useState ('');
    const [senhaAdm, setSenhaAdm] = useState ('');
    const [emailAdm, setEmailAdm] = useState ('');
    const [confirmacaoSenhaAdm, setConfirmacaoSenhaAdm] = useState ('');
    const [dataNascimentoAdm, setDataNascimentoAdm] = useState ();
    const [fotoAdm, setFotoAdm] = useState ('');

    const cadastrar = () => {
        if (nomeAdm === '' || dataNascimentoAdm === '' || emailAdm === '' || senhaAdm === '') {
            alert ('Preencha todos os campos para se cadastrar!');
            return false;
        }

        if (senhaAdm !== confirmacaoSenhaAdm) {
            alert ('A confirmação de senha é diferente da senha fornecida!');
            return false;
        }

        let formData = new FormData ();

        formData.append ('nome', nomeAdm);
        formData.append ('data_nascimento', dataNascimentoAdm);
        formData.append ('email', emailAdm);
        formData.append ('senha', senhaAdm);
        formData.append ('foto', fotoAdm);
        formData.append ('tipoConta', "ADMINISTRADOR");

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":"+ process.env.REACT_APP_PORT_SERVER + "/account/signup", formData).then ((res) => {
            alert ('Administrador cadastrado!');
        }).catch ((err) => {
            alert ('Não foi possível realizar o cadastrado do novo administrador! Tente novamente!');
            console.error (err);
        });

    }
    
    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split ("'")[0];

    return (
        <div style={{display: "grid", gridTemplateColumns: "17% 83%", height: "100vh"}}>
            <Menu>
            <Photo URLImagem={"http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/" + foto} />
                <Title titulo={nome} />
                <Button acao={ () => navigate ("/account")} cor="#0743AB" titulo="Minha conta" />
                {
                    (state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                        <Button acao={ () => navigate ("/teachers") } cor="#0743AB" titulo="Professores" />
                    </>
                }
                {
                    (state.dados.tipo === "'PROFESSOR'" || state.dados.tipo === "ALUNO") && <>
                        <Button acao={ () => navigate ("/attendance") } cor="#0743AB" titulo="Atendimentos" />
                    </>
                }
                {
                    (state.dados.tipo === "'PROFESSOR'" || state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                    <Button acao={ () => navigate ("/selos") } cor="#0743AB" titulo="Selos" />
                    </>
                }
                <Button acao={ () => navigate ("/ticket")} cor="#0743AB" titulo="Tickets" />
                {
                    (state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                        <Button acao={ () => navigate ("/admin") } cor="#0743AB" titulo="Administradores" />
                    </>
                }
                <div style={{marginTop: "30%"}}>
                    <Button acao={ () => { let data = addUserData (); dispatch (data); navigate ("/")}} cor="#59149D" titulo="Sair" />
                </div>
            </Menu>
            <ContentArea>
                <div style={{textAlign: "left", marginLeft: "10%"}}>
                    <Title titulo="Adicionar administrador" />
                </div>
                <hr style={{width: "80%", color: "white"}} />
                <div style={{textAlign: "left", marginLeft: "10%"}}>
                    <Form>
                        <Text tamanhoFonte={20} texto="Preencha o formulário abaixo para adicionar um novo administrador" />
                        <Input onChange={(event) => setNomeAdm (event.target.value) } value={nomeAdm} tipo="text" legenda="Nome" legendaInput="Insira o nome do administrador" comprimento={300} />
                        <Input onChange={(event) => { setEmailAdm (event.target.value)}} value={emailAdm} tipo="email" legenda="Email" legendaInput="Insira o email do administrador" comprimento={300} />
                        <Input onChange={(event) => { setSenhaAdm (event.target.value)}} value={senhaAdm} tipo="password" legenda="Senha" legendaInput="Informe a senha do administrador" comprimento={300} />
                        <Input onChange={(event) => { setConfirmacaoSenhaAdm (event.target.value) }} value={confirmacaoSenhaAdm} tipo="password" legenda="Confirmação de senha" legendaInput="Informe a confirmação da senha" comprimento={300} />
                        <Input onChange={(event) => { let date = new Date (event.target.value); setDataNascimentoAdm (date.toISOString ().split ('T')[0]) }} legenda="Data de Nascimento" comprimento={300} tipo="date" legendaInput="Informe a data de nascimento" />
                        <Input onChange={(event) => { setFotoAdm (event.target.files[0])}} tipo="file" legenda="Escolha uma foto de perfil" comprimento={300} />
                        <Button titulo="Cadastrar" cor="#0743AB" acao={() => cadastrar ()} />
                    </Form>
                </div>
            </ContentArea>
        </div>
    );
}