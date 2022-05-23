import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { addUserData } from '../store/userReducer';
import Menu from '../components/Menu';
import Photo from '../components/Photo';
import ContentArea from '../components/ContentArea';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import Input from '../components/Input';
import Form from '../components/Form';
import List from '../components/List';
import axios from 'axios';

export default function Ticket (props) {

    const state = useSelector (estado => estado.dadosUsuario);
    const navigate = useNavigate ();
    const dispatch = useDispatch ();
    const [titulo, setTitulo] = useState ('');
    const [descricao, setDescricao] = useState ('');
    const [resposta, setResposta] = useState ('');
    const [index, setIndex] = useState ();
    const [ticketsAbertos, setTicketAbertos] = useState ([]);
    const [ticketsFechados, setTicketFechados] = useState ([]);
    const [emailUsuarioReportado, setEmailUsuarioReportado] = useState ('');
    const [isClosedSelect, setIsClosedSelect] = useState (false);

    const submitReport = () => {

        let dadosReport = {
            token: token,
            emailReportado: emailUsuarioReportado,
            titulo: titulo,
            descricao: descricao,
            data_submissao: new Date ().toISOString ().split ('T')[0]
        };

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/ticket/submit", dadosReport).then ((res) => {
            alert ('Ticket de report enviado com sucesso!');
        }).catch ((err) => {
            alert ('Não foi possível submeter o ticker de report! Tente novamente!');
            console.error (err);
        });
    }

    const getClosedTickets = async () => {
        let result = await axios.get ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/ticket/getClosed");
        setTicketFechados (result.data.tickets);
    }

    const getOpenedTickets = async () => {
        let result = await axios.get ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/ticket/list");
        setTicketAbertos (result.data.tickets);
    }

    const closeTicket = () => {
        if (resposta === '') {
            alert ('É necessário justificar a resolução do ticket!');
            return false;
        }

        axios.put ('http://' + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/ticket/close/" + ticketsAbertos[index].idTicket, {
            token: token,
            message: resposta
        }).then ((res) => {
            alert ('Ticket finalizado com sucesso!');
            setIndex ();
        }).catch ((err) => {
            alert ('Não foi possível finalizar o ticket! Tente novamente!');
            console.error (err);
        })
    }

    const banishUser = () => {
        if (ticketsAbertos[index] === undefined) {
            alert ('Só é possível realizar essa ação em um ticket aberto!');
            return false;
        }

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/banish", {
            token: token,
            id: ticketsAbertos[index].usuarioReportado
        }).then ((res) => {
            alert ('Usuário banido com sucesso!');
        }).catch ((err) => {
            alert ('Não foi possível banir o usuário! Tente novamente!');
            console.error (err);
        });
    }

    const alertUser = () => {
        if (ticketsAbertos[index] === undefined) {
            alert ('Só é possível realizar essa ação em um ticket aberto!');
            return false;
        }

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/warn", {
            token: token,
            id: ticketsAbertos[index].usuarioReportado
        }).then ((res) => {
            alert ('Usuário advertido com sucesso!');
        }).catch ((err) => {
            alert ('Não foi possível advertir o usuário! Tente novamente!');
            console.error (err);
        });
    }

    useEffect (() => {
        getOpenedTickets ();
        getClosedTickets ();
    }, [index]);

    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split ("'")[0];
    let token = state.dados.token;


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
                {
                    (state.dados.tipo === "'PROFESSOR'" || state.dados.tipo === "ALUNO") && <>
                        <div style={{textAlign: "left", marginLeft: "10%"}}>
                            <Title titulo="Tickets" />
                        </div>
                        <hr style={{width: "80%", color: "white"}} />
                        <div style={{textAlign: "center", marginLeft: "5%", marginTop: "2%"}}>
                            <Text tamanhoFonte={20} texto="Preencha o formulário abaixo para reportar um usuário" />
                            <Form margemEsquerda={100}>
                                <Input onChange={(event) => { setTitulo (event.target.value) }} comprimento={300} tipo="text" value={titulo} legenda="Título" legendaInput="Insira o título do ticket" />
                                <Input onChange={(event) => setEmailUsuarioReportado (event.target.value)} comprimento={400} tipo="text" value={emailUsuarioReportado} legenda="Email do usuário reportado" legendaInput="Insira o email do usuário quer será reportado" />
                                <Text tamanhoFonte={20} texto="Descreva o ocorrido no campo abaixo" />
                                <textarea onChange={(event) => setDescricao (event.target.value)} style={{width: 500, height: 100}}></textarea>
                                <Button acao={() => { submitReport () }} cor="#0743AB" titulo="Enviar report" />
                            </Form>
                        </div>
                    </>
                }
                {
                    (state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                        <div style={{textAlign: "left", marginLeft: "10%"}}>
                            <Title titulo="Tickets" />
                        </div>
                        <hr style={{width: "80%", color: "white"}} />
                        <div style={{display: "grid", gridTemplateColumns: "50% 50%", marginLeft: "5%", marginTop: "2%"}}>
                            <div>
                                <Text texto="Lista de tickets abertos" tamanhoFonte={20} />
                                <span onClick={() => setIsClosedSelect (false)}><List acao={setIndex} lista={ticketsAbertos} /></span>
                                <hr style={{width: "90%", color: "white", marginTop: "3%"}} />
                                <Text tamanhoFonte={20} texto="Lista de selos fechados" />
                                <span onClick={() => setIsClosedSelect (true)}><List acao={setIndex} lista={ticketsFechados} /></span>
                            </div>
                            <div>
                                <Text texto="Dados do ticket selecionado" tamanhoFonte={20} />
                                {
                                    (ticketsAbertos.length !== 0 || ticketsFechados.length !== 0) && (ticketsAbertos[index] !== undefined || ticketsFechados[index] !== undefined) && <div style={{textAlign: "left", marginLeft: "20%"}}>
                                        <Text tamanhoFonte={20} texto={"Título: " + ((isClosedSelect) ? ticketsFechados[index].titulo.split ("'")[0] : ticketsAbertos[index].titulo.split ("'")[0])} />
                                        <Text tamanhoFonte={20} texto={"Descricao: " + ((isClosedSelect) ? ticketsFechados[index].descricao.split ("'")[0] : ticketsAbertos[index].descricao.split ("'")[0])} />
                                        <Text tamanhoFonte={20} texto={"Data do acontecimento: " + ((isClosedSelect) ? ticketsFechados[index].data_submissao.split ('T')[0] : ticketsAbertos[index].data_submissao.split ('T')[0])} />
                                        
                                        {
                                            !isClosedSelect && <>
                                            <Text tamanhoFonte={20} texto="Insira a resposta de resolução de ticket abaixo" />
                                            <textarea onChange={(event) => setResposta (event.target.value)} style={{width: 375, height: 100}}></textarea>
                                            <Button acao={() => { alertUser () }} cor="#0743AB" titulo="Advertir usuario" />
                                            <Button acao={() => { banishUser () }} cor="#59149D" titulo="Banir usuario" />
                                            <Button acao={() => { closeTicket ()}} cor="#0743AB" titulo="Fechar ticket" />
                                            </>
                                        }
                                        {
                                            isClosedSelect && <>
                                                <Text tamanhoFonte={20} texto="Descrição da solução:" />
                                                <Text tamanhoFonte={20} texto={ticketsFechados[index].resposta} />
                                            </>
                                        }
                                    </div>
                                }
                               {
                                    ((ticketsAbertos.length === 0 && ticketsFechados.length === 0) || (ticketsAbertos[index] === undefined && ticketsFechados[index] === undefined)) &&
                                        <Text tamanhoFonte={18} texto="Selecione um ticket na lista ao lado" />                                   
                               }
                            </div>
                        </div>
                    </>
                }
            </ContentArea>
        </div>
    );
}