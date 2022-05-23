import React, { useState } from 'react';
import Menu from '../components/Menu';
import ContentArea from '../components/ContentArea';
import Photo from '../components/Photo';
import Button from '../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { addUserData } from '../store/userReducer';
import Title from '../components/Title';
import Text from '../components/Text';
import Input from '../components/Input';
import axios from 'axios';

export default function Account (props) {

    
    const dispatch = useDispatch ();
    const navigate = useNavigate ();
    const [fotoState, setFoto] = useState ('');
    const [email, setEmail] = useState ('');
    const [senha, setSenha] = useState ('');
    const [confirmarSenha, setConfirmacao] = useState ('');

    const state = useSelector (estado => estado.dadosUsuario);
    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split("'")[0];
    let id = state.dados.id;
    let token = state.dados.token;

    const atualizar = () => {

        const formData = new FormData ();

        if (senha !== null && confirmarSenha !== null && senha !== confirmarSenha) {
            alert ("As senhas diferem!");
            return false;
        }
            
        if (senha === confirmarSenha)
            formData.append ("senha", senha);

        if (email !== null)
            formData.append ("email", email);

        formData.append ("foto", fotoState);
        formData.append ("token", token);
        formData.append ("id", id);

        axios.put ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/edit", formData).then ((res) => {
            alert ("Dados atualizados com sucesso!");
        }).catch ((error) => {
            alert ("Não foi possível atualizar os dados! Tente novamente!");
            console.error (error);
        });
    }

    const deletar = () => {
        axios.delete ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/" + id, { data: { token: token}}).then ((res) => {
            alert ("Conta excluida com sucesso!");
        }).catch ((error) => {
            alert ("Não foi possível excluir a conta! Tente novamente!");
            console.error (error);
        }) && dispatch (addUserData ()) && navigate ("/");
    }

    return (
        <div style={{display: "grid", gridTemplateColumns:  "17% 83%", height: "100vh"}}>
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
                        <Button acao={ () => navigate ("/attendance")} cor="#0743AB" titulo="Atendimentos" />
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
                    <Title titulo="Minha conta - Editar" />
                </div>
                <hr style={{width: "80%", color: "white"}} />
                <div style={{display: "grid", gridTemplateColumns: "30% 40% 25%", marginLeft: "5%", marginTop: "2%"}}>
                    <div>
                        <Photo URLImagem={"http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/" + foto} />
                        <Input onChange={(event) => {setFoto (event.target.files[0])}} tipo="file" legenda="Altere a foto de perfil" comprimento={300} />
                        <Text texto={"Tipo de conta: " + state.dados.tipo} tamanhoFonte={20} />
                    </div>
                    <div style={{textAlign: "left", marginLeft: "10%"}}>
                        <Input disabled={true} value={nome} legenda="Nome" comprimento={300} tipo="text" />
                        <Input legendaInput="Informe o novo email" onChange={(event) => { setEmail (event.target.value) }} tipo="email" value={email} legenda="Email" comprimento={300} />
                        <Input onChange={(event) => setSenha (event.target.value)} comprimento={300} tipo="password" value={senha} legenda="Senha" legendaInput="Informe a nova senha" />
                        <Input onChange={(event) => setConfirmacao (event.target.value)} comprimento={300} tipo="password" value={confirmarSenha} legenda="Confirmação de senha" legendaInput="Confirme a nova senha" />
                        <Button titulo="Atualizar" acao={() => atualizar()} cor="#0743AB" />
                    </div>
                    <div style={{borderRadius: 15, backgroundColor: "#59149D", height: "75%"}}>
                        <Title titulo="Deseja excluir a conta?"/>
                        <Text texto="Clique no botão abaixo!" tamanhoFonte={20} />
                        <Button acao={() => deletar ()} titulo="Excluir conta" cor="#0743AB" />
                    </div>
                </div>
            </ContentArea>
        </div>
    );
}