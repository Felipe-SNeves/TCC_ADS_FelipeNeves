import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Menu from '../components/Menu';
import Photo from '../components/Photo';
import Title from '../components/Title';
import Button from '../components/Button';
import Text from '../components/Text';
import ContentArea from '../components/ContentArea';
import List from '../components/List';
import { useDispatch, useSelector } from 'react-redux';
import { addUserData } from '../store/userReducer';
import axios from 'axios';

export default function Teachers (props) {

    const navigate = useNavigate ();
    const dispatch = useDispatch ();
    const [professores, setProfessores] = useState ([]);
    const [index, setIndex] = useState (0);
    
    const AREA = [
        "FISICA", "MATEMATICA", "QUIMICA", "BIOLOGIA", "LITERATURA",
        "GRAMATICA", "ARTES", "HISTORIA", "GEOGRAFIA", "FILOSOFIA", "SOCIOLOGIA"
    ];

    const getTeachers = async () => {
        const result = await axios.get ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/getTeachers");
        setProfessores (result.data.professores);
    }

    useEffect (() => {
        getTeachers ();
    }, []);

    const state = useSelector (estado => estado.dadosUsuario);
    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split("'")[0];
    let token = state.dados.token;

    const avaliar = (aprovacao, id) => {
        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/aprove/" + id, {
            aprovacao: aprovacao,
            token: token
        }).then ((res) => {
            alert (res.data.mensagem);
            setIndex (0);
            getTeachers ();
        }).catch ((error) => {
            alert ('Não foi possível aprovar o professor!');
            console.error (error);
        })
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
                    (state.dados.tipo === "'PROFESSOR'" || state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                    <Button acao={ () => navigate ("/selos")} cor="#0743AB" titulo="Selos" />
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
                    <Title titulo="Professores - aprovar" />
                </div>
                <hr style={{width: "80%", color: "white"}} />
                <div style={{display: "grid", gridTemplateColumns: "50% 50%", marginLeft: "5%", marginTop: "2%"}}>
                    <div>
                        <Text texto="Lista de professores para aprovação" tamanhoFonte={20} />
                        <List acao={setIndex} lista={professores} />
                    </div>
                    <div>
                        <Text texto="Dados do professor selecionado" tamanhoFonte={20} />
                        {
                            
                            professores.length !== 0 && <div style={{textAlign: "left", marginLeft: "20%"}}>
                                <Text tamanhoFonte={20} texto={"Nome: " + professores[index].nome.split ("'")[1]} />
                                <Text tamanhoFonte={20} texto={"Email: " + professores[index].email.split ("'")[0]} />
                                <Text tamanhoFonte={20} texto={"Data de nascimento: " + professores[index].data_nascimento.split ("T")[0].split ('-')[2] + "/" + professores[index].data_nascimento.split ("T")[0].split ('-')[1] + "/" +  professores[index].data_nascimento.split ("T")[0].split ('-')[0]} />
                                <Text tamanhoFonte={20} texto={"Área do conhecimento: " + AREA[(professores[index].idArea) - 1]} />
                                <a target="_blank" download href={"http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/curriculum/" + professores[index].curriculo.split ("/")[2]} style={{color: 'white', fontFamily: 'Open Sans', fontWeight: '400', fontSize: 20}}> Baixar Currículo</a>
                                <Button acao={ () =>  avaliar (true, professores[index].codigo) } cor="#0743AB" titulo="Aprovar" />
                                <Button acao={ () =>  avaliar (false, professores[index].codigo) } cor="#59149D" titulo="Reprovar" />
                            </div>
                        }
                        {
                            professores.length === 0 &&
                            <Text texto="Selecione um professor na lista ao lado" tamanhoFonte={18} />
                        }
                    </div>
                </div>
            </ContentArea>
        </div>
    )
}