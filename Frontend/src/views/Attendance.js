import React, { useState } from 'react';
import Menu from '../components/Menu';
import Photo from '../components/Photo';
import ContentArea from '../components/ContentArea';
import Title from '../components/Title';
import Button from '../components/Button';
import Form from '../components/Form';
import Text from '../components/Text';
import { addUserData } from '../store/userReducer';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Attendance (props) {

    const state = useSelector (estado => estado.dadosUsuario);
    const navigate = useNavigate ();
    const dispatch = useDispatch ();
    const [idArea, setIdArea] = useState ("1");
    const [subarea, setSubArea] = useState ('');
    const [duvida, setDuvida] = useState ('');
    const [isEnable, setIsEnable] = useState (false);
    const [nextAttendance, setNextAttendance] = useState ({});
    const [attendanceState, setAttendanceState] = useState (false);

    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split("'")[0];
    let id = state.dados.id;

    const solicitarAtendimento = async () => {

        if (duvida === '') {
            alert ('É preciso fornecer uma dúvida para solicitar o atendimento!');
            return false;
        }

        let attendanceRequest = {
            token: state.dados.token,
            area: parseFloat (idArea),
            subarea: subarea,
            duvida: duvida
        };

        let result = await axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/attendance/onqueue", attendanceRequest).then ((res) => {
            return true;
        }).catch ((error) => {
            alert ("Não foi possível registrar a solicitação! Motivo: " + error.response.data.mensagem);
            console.error (error);
            return false;
        })

        if (result) {
            window.open (process.env.PUBLIC_URL + "/chatObserver.html?id=" + encodeURI (id));
        }
    }

    const habilitar = () => {
        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/attendance/enable", {
            token: state.dados.token
        }).then ((res) => {
            alert ("Professor habilitado para atendimento! Selecione para ver o próximo atendimento disponível!");
            setIsEnable (true);
        }).catch ((error) => {
            alert ("Não foi possível habilitar o professor! Motivo: " + error.response.data.mensagem);
            console.error (error);
        });
    }

    const desabilitar = () => {
        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/attendance/disable", {
            token: state.dados.token
        }).then ((res) => {
            alert ('Professor desabilitado para atendimento!');
            setIsEnable (false);
        })
    }

    const getNextAttendance = () => {
        if (!isEnable) {
            alert ("Para visualizar o próximo atendimento é necessário que o professor esteja habilitado!");
            return false;
        }

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/attendance/getNextAttendance", {
            token: state.dados.token
        }).then ((res) => {
            let attendance = {
                porta: res.data.porta,
                idAluno: res.data.attendance.id,
                aluno: res.data.attendance.aluno.split ("'")[1],
                subarea: res.data.attendance.subarea.split ("'")[0],
                duvida: res.data.attendance.duvida.split ("'")[0],
                email: res.data.attendance.email.split ("'")[0]
            };
            setNextAttendance (attendance);
            setAttendanceState (true);
        }).catch ((error) => {
            alert ("Não foi possível visualizar o próximo atendimento! Motivo: " + error.response.data.mensagem);
            console.error (error);
        })
    }

    const acceptAttendance = () => {
        if (attendanceState) {
            setAttendanceState (false);
            axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/attendance/acceptAttendance", {
                token: state.dados.token,
                porta: nextAttendance.porta
            }).then ((res) => {
                window.open (process.env.PUBLIC_URL + "/chatRoom.html?chatroom=" + nextAttendance.porta);
            });
        }
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
                        <Button acao={ () => navigate ("/attendance") } cor="#0743AB" titulo="Atendimentos" />
                    </>
                }
                {
                    (state.dados.tipo === "'PROFESSOR'" || state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                    <Button acao={ () => navigate ("/selos") } cor="#0743AB" titulo="Selos" />
                    </>
                }
                <Button acao={ () => navigate ("/ticket")} cor="#0743AB" titulo="Tickets" />
                <div style={{marginTop: "30%"}}>
                    <Button acao={ () => { let data = addUserData (); dispatch (data); navigate ("/")}} cor="#59149D" titulo="Sair" />
                </div>
            </Menu>
            <ContentArea>
                {
                    state.dados.tipo === "ALUNO" && <>
                        <Title titulo="Questionário de pré atendimento" />
                        <hr style={{color: "white", width: "80%", marginBottom: "2%"}} />
                        <Form margemEsquerda="15%">
                            <label style={{ fontFamily: "Open Sans", fontSize: 20, color: 'white'}} htmlFor="areas">Selecione a área de atendimento: </label>
                            <select id="areas" style={{ marginBottom: "2%" }} onChange={(event) => { setIdArea (event.target.value) }}>
                                <option value="1">Física</option>
                                <option value="2">Matemática</option>
                                <option value="3">Química</option>
                                <option value="4">Biologia</option>
                                <option value="5">Literatura</option>
                                <option value="6">Gramática</option>
                                <option value="7">Artes</option>
                                <option value="8">História</option>
                                <option value="9">Geografia</option>
                                <option value="10">Filosofia</option>
                                <option value="11">Sociologia</option>
                            </select> <br />
                            <label style={{ fontFamily: "Open Sans", fontSize: 20, color: 'white'}} htmlFor="subareas">Selecione a subárea da disciplina: </label>
                            <select id="subareas" onChange={(event) => setSubArea (event.target.value)}>
                                {
                                    idArea === "1" && <>
                                        <option value="Cinematica">Cinemática</option>
                                        <option value="Dinamica">Dinâmica</option>
                                        <option value="Eletricidade e eletromagnetismo">Eletricidade e eletromagnetismo</option>
                                        <option value="Energia e momento">Energia e momento</option>
                                        <option value="Estatica e hidroestatica">Estática e hidroestática</option>
                                        <option value="Fisica moderna">Física Moderna</option>
                                        <option value="Gravitacao">Gravitação</option>
                                        <option value="Ondulatoria">Ondulatória</option>
                                        <option value="Optica">Optica</option>
                                        <option value="Sistema de unidades">Sistema de unidades</option>
                                        <option value="Termologia">Termologia</option>
                                        <option value="Vetores">Vetores</option>
                                    </>
                                }
                                {
                                    idArea === "2" && <>
                                        <option value="Algebra">Álgebra</option>
                                        <option value="Estatistica e probabilidade">Estatística e Probabilidade</option>
                                        <option value="Geometria Analitica">Geometria Analítica</option>
                                        <option value="Geometria Espacial">Geometria Espacial</option>
                                        <option value="Geometria Plana">Geometria Plana</option>
                                        <option value="Matematica Basica">Matemática Básica</option>
                                        <option value="Trigonometria">Trigonometria</option>
                                    </>
                                }
                                {
                                    idArea === "3" && <>
                                        <option value="Atomistica">Atomística</option>
                                        <option value="Estequeometria">Estequiometria</option>
                                        <option value="Estudo dos Gases">Estudo dos Gases</option>
                                        <option value="Fisico Quimica">Físico Química</option>
                                        <option value="Quimica Inorganica">Química Inorgânica</option>
                                        <option value="Quimica Organica">Química Orgânica</option>
                                    </>
                                }
                                {
                                    idArea === "4" && <>
                                        <option value="Bioquimica">Bioquímica</option>
                                        <option value="Botanica">Botânica</option>
                                        <option value="Citologia">Citologia</option>
                                        <option value="Ecologia">Ecologia</option>
                                        <option value="Embriologia">Embriologia</option>
                                        <option value="Fisiologia animal">Fisiologia Animal</option>
                                        <option value="Genetica">Genética</option>
                                        <option value="Histologia">Histologia</option>
                                        <option value="Metabolismo celular">Metabolismo celular</option>
                                        <option value="Origem da vida e Evolucao">Origem da Vida e Evolução</option>
                                        <option value="Taxionomia">Taxionomia</option>
                                    </>
                                }
                                {
                                    idArea === "5"&& <>
                                        <option value="Escolas Literarias">Escolas Literárias</option>
                                        <option value="Teoria Literaria">Teoria Literária</option>
                                    </>
                                }
                                {
                                    idArea === "6" && <>
                                        <option value="Interpretacao de textos">Interpretação de textos</option>
                                        <option value="Morfologia">Morfologia</option>
                                        <option value="Ortografia">Ortografia</option>
                                        <option value="Sintaxe">Sintaxe</option>
                                    </>
                                }
                                {
                                    idArea === "7" && <>
                                        <option value="Arte na pre historia">Arte na pré história</option>
                                        <option value="Arte na Antiguidade">Arte na Antiguidade</option>
                                        <option value="Arte Medieval">Arte Medieval</option>
                                        <option value="Arte na era moderna">Arte na era moderna</option>
                                        <option value="Arte na era contemporanea">Arte na era contemporânea</option>
                                    </>
                                }
                                {
                                    idArea === "8" && <>
                                        <option value="Antiguidade Classica">Antiguidade Clássica</option>
                                        <option value="Antiguidade Oriental">Antiguidade Oriental</option>
                                        <option value="Pre Historia">Pré História</option>
                                        <option value="Idade Media">Idade Média</option>
                                        <option value="Idade Moderna">Idade Moderna</option>
                                        <option value="Idade Contemporanea">Idade Contemporânea</option>
                                        <option value="Brasil Colonia">Brasil Colônia</option>
                                        <option value="Brasil Imperio">Brasil Império</option>
                                        <option value="Brasil Republica">Brasil República</option>
                                    </>
                                }
                                {
                                    idArea === "9" && <>
                                        <option value="Comercio e Transporte">Comércio e Transporte</option>
                                        <option value="Geografia do Brasil">Geografia do Brasil</option>
                                        <option value="Industria e Agropecuaria">Indústria e Agropecuária</option>
                                        <option value="Movimentos sociais e politicos">Movimentos Sociais e Políticos</option>
                                        <option value="Natureza e Geologia">Natureza e Geologia</option>
                                        <option value="Regionalizacao Mundial">Regionalização Mundial</option>
                                        <option value="Cartologia">Cartografia</option>
                                    </>
                                }
                                {
                                    idArea === "10" && <>
                                        <option value="Filosofia Antiga">Filosofia Antiga</option>
                                        <option value="Filosofia Contemporanea">Filosofia Contemporânea</option>
                                        <option value="Filosofia Geral">Filosofia Geral</option>
                                        <option value="Filosofia Medieval e Patristica">Filosofia Medieval e Patrística</option>
                                        <option value="Filosofia Moderna">Filosofia Moderna</option>
                                    </>
                                }
                                {
                                    idArea === "11" && <>
                                        <option value="Classicos da Sociologia">Clássicos da Sociologia</option>
                                        <option value="Estruturas Produtivas e Politicas">Estruturas Produtivas e Política</option>
                                        <option value="Homem, Natureza e Cultura">Homem, Natureza e Cultura</option>
                                    </>
                                }
                            </select>
                            <Text texto="Descreva brevemente a sua dúvida no campo abaixo" tamanhoFonte={20} />
                            <textarea onChange={(event) => setDuvida (event.target.value)} style={{width: 500, height: 200}}></textarea>
                            <Button acao={ () => solicitarAtendimento ()} cor="#0743AB" titulo="Enviar" />
                        </Form>
                    </>
                }
                {
                    state.dados.tipo === "'PROFESSOR'" && <>
                        <Title titulo="Realizar atendimentos" />
                        <hr style={{color: "white", width: "80%", marginBottom: "2%"}} />
                        <Text texto="Para realizar um atendimento, se habilite para atender e clique para visualizar os dados do próximo atendimento!" tamanhoFonte={18} />
                        <div style={{display: "grid", gridTemplateColumns: "50% 50%", marginLeft: "5%", marginTop: "2%"}}>
                            <div>
                                <Text texto="Gerenciamento de atendimentos" tamanhoFonte={20} />
                                <Button acao={ () => habilitar () } cor="#0743AB" titulo="Habilitar" />
                                <Button acao={ () => desabilitar () } cor="#59149D" titulo="Desabilitar" />
                                <Button acao={ () => getNextAttendance() } cor="#0743AB" titulo="Próximo atend." />
                            </div>
                            <div>
                                <Text texto="Dados do próximo atendimento" tamanhoFonte={20} />
                                {
                                    !attendanceState && <>
                                        <Text tamanhoFonte={20} texto="Selecione o botão para visualizar o próximo atendimento!" />   
                                    </>
                                }
                                {
                                    attendanceState && <>
                                        <Text texto={"Aluno: " + nextAttendance.aluno} tamanhoFonte={20} />
                                        <Text texto={"Email do aluno: " + nextAttendance.email} tamanhoFonte={20} />
                                        <Text texto="Guarde esse email caso queira reportar o aluno!" tamanhoFonte={18} />
                                        <Text texto={"Subárea: " + nextAttendance.subarea} tamanhoFonte={20} />
                                        <textarea value={ nextAttendance.duvida } style={{width: 450, height: 200}}></textarea>
                                        <Button acao={ () => acceptAttendance () } cor="#0743AB" titulo="Atender" />
                                    </>
                                }
                            </div>
                        </div>
                    </>
                }
            </ContentArea>
        </div>
    );
}