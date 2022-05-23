import React from 'react';
import Menu from '../components/Menu';
import Photo from '../components/Photo';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { addUserData } from '../store/userReducer';
import Title from '../components/Title';
import Button from '../components/Button';
import Text from '../components/Text';
import ContentArea from '../components/ContentArea';

export default function Home (props) {
    
    const state = useSelector (estado => estado.dadosUsuario);
    const navigate = useNavigate ();
    const dispatch = useDispatch ();

    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split("'")[0];

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
                <Title titulo={"O que deseja fazer hoje, " + nome + "?"} />
                <div style={{marginLeft: 225, marginTop: 75, padding: 0}}>
                    <div style={{float: "left"}}>
                        <img src={process.env.PUBLIC_URL + "/assets/duvida2.svg"} alt="Icone de duvida" style={{height: 106, width: 120}} />
                        <Text tamanhoFonte={30} texto="Atendimento" />
                    </div>
                    <div>
                        <img src={process.env.PUBLIC_URL + "/assets/conta.svg"} alt="Icone de conta" style={{height: 106, width: 120}} />
                        <Text tamanhoFonte={30} texto="Conta" />
                    </div>
                </div>
                <Text texto="Selecione uma das opções no menu" tamanhoFonte={30} />
            </ContentArea>
        </div>
    );
}