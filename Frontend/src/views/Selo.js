import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { addUserData } from '../store/userReducer';
import Menu from '../components/Menu';
import Photo from '../components/Photo';
import Title from '../components/Title';
import Text from '../components/Text';
import Button from '../components/Button';
import ContentArea from '../components/ContentArea';
import Form from '../components/Form';
import List from '../components/List';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import axios from 'axios';

export default function Selo (props) {

    const state = useSelector (estado => estado.dadosUsuario);
    const navigate = useNavigate ();
    const dispatch = useDispatch ();
    const [selos, setSelos] = useState ([]);
    const [index, setIndex] = useState ();
    const [idArea, setIdArea] = useState ("0");
    const [titulo, setTitulo] = useState ('');
    const [meta, setMeta] = useState (0);
    const [descricao, setDescricao] = useState ('');
    const [idAreaSelo, setIdAreaSelo] = useState (1);
    const [selosConquistados, setSelosConquistados] = useState ([]);
    const [isConquistadoSelected, setIsConquistadoSelected] = useState (false);
    const [isOpen, setIsOpen] = useState (false);

    const getSelos = async () => {
        const result = await axios.get ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/selo/list/" + idArea);
        setSelos (result.data.selos);
    }

    const getSelosConquistados = async () => {
        const result = await axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/selo/getConquered/" + id, { token: state.dados.token });
        setSelosConquistados (result.data.selos);
    }

    useEffect (() => {
        getSelos ();
        getSelosConquistados ();
    }, [idArea]);

    if (state.dados === undefined)
        return <Navigate to="/" />

    let nome = state.dados.nome.split ("'")[1];
    let foto = state.dados.foto.split ('/')[2].split ("'")[0];
    let id = state.dados.id;

    const excluirSelo = () => {
        axios.delete ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/selo/delete/" + selos[index].idSelo, { data: { token: state.dados.token}}).then ((res) => {
            alert ('Selo excluido com sucesso!');
            setTitulo ('');
            setDescricao ('');
            setMeta (0);
            setIdAreaSelo (1);
            setIdArea (0);
            setIndex ();
        }).catch ((err) => {
            alert ('Não foi possível excluir o selo selecionado! Tente novamente!');
            console.error (err);
        })
    }

    const adicionarSelo = () => {
        let dadosNovoSelo = {
            titulo: titulo,
            descricao: descricao,
            meta: parseInt (meta),
            idArea: parseInt (idAreaSelo),
            token: state.dados.token
        };

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/selo/addSelo", dadosNovoSelo).then ((res) => {
            alert ('Novo selo adicionado com sucesso!');
            setTitulo ('');
            setDescricao ('');
            setMeta (0);
            setIdAreaSelo (1);
        }).catch ((err) => {
            alert ('Não foi possível cadastrar o novo selo! Tente novamente!');
            console.error (err);
        })
    }

    const updateSelo = () => {
        let dadosAtualizados = {
            titulo: (titulo === '') ? selos[index].titulo.split ("'")[0] : titulo,
            descricao: (descricao === '') ? selos[index].descricao.split ("'")[0] : descricao,
            meta: parseInt ((meta === selos[index].meta) ? selos[index].meta : meta),
            idArea: (idAreaSelo === selos[index].idArea) ? selos[index].idArea : idAreaSelo,
            id: selos[index].idSelo,
            token: state.dados.token
        };

        axios.put ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/selo/edit", dadosAtualizados).then ((res) => {
            alert ('Selo atualizado com sucesso!');
            setTitulo ('');
            setDescricao ('');
            setMeta (0);
            setIdAreaSelo (1);
        }).catch ((err) => {
            alert ('Não foi possível atualizar o selo! Tente novamente!');
            console.error (err);
        })
        
    }

    const share = (media) => {
        let shareMessage = "Conquistei o seguinte selo na plataforma iEdu: " + selosConquistados[index].titulo.split ("'")[0] + ". Selo obtido pelo motivo: " + selosConquistados[index].descricao.split ("'")[0] + ".";
        switch (media) {
            case 1:
                window.open (`https://www.reddit.com/submit?url=${shareMessage}&title=Conquista+iEdu`);
                break;
            case 2:
                window.open ("https://twitter.com/share?ref_src=twsrc%5Etfw&url=" + shareMessage);
                break;
            case 3:
                window.open (`https://api.whatsapp.com/send/?text=${shareMessage}&app_absent=0`);
        }
    }

    return (
        <div style={{display: "grid", gridTemplateColumns: "17% 83%", height: "100vh"}}>
            {
                isOpen && <Modal>
                    <Text tamanhoFonte={20} texto="Selecione uma rede abaixo para realizar o compartilhamento" />
                    <div style={{display: "flex"}}>
                        <Icon onClick={() => share (1)} URLImagemIcone={process.env.PUBLIC_URL + '/assets/reddit.png'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '20%' }} />
                        <Icon onClick={() => share (2)} URLImagemIcone={process.env.PUBLIC_URL + '/assets/twitter.svg'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '10%' }} />
                        <Icon onClick={() => share (3)} URLImagemIcone={process.env.PUBLIC_URL + '/assets/whatsapp.png'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '10%' }} />
                    </div>
                    <Button acao={ () => setIsOpen (false)} cor="#59149D" titulo="Cancelar" />
                </Modal>
            }
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
                    state.dados.tipo === "'PROFESSOR'" && <>
                        <div style={{textAlign: "left", marginLeft: "10%"}}>
                            <Title titulo="Selos" />
                        </div>
                        <hr style={{width: "80%", color: "white"}} />
                        <div style={{display: "grid", gridTemplateColumns: "50% 50%", marginLeft: "5%", marginTop: "2%"}}>
                            <div>
                                <Text texto="Lista de selos disponíveis" tamanhoFonte={20} />
                                <label style={{ fontFamily: "Open Sans", fontSize: 20, color: 'white'}} htmlFor="areas">Selecione a área do selo: </label>
                                <select id="areas" style={{ marginBottom: "2%" }} onChange={(event) => { setIdArea (event.target.value) }}>
                                    <option value="0">Todos</option>
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
                                <span onClick={() => setIsConquistadoSelected (false)}><List acao={setIndex} lista={selos} /></span>
                                <hr style={{width: "90%", color: "white", marginTop: "3%" }} />
                                <Text texto="Lista de selos conquistados" tamanhoFonte={20} />
                                <span onClick={() => setIsConquistadoSelected (true)} ><List acao={setIndex} lista={selosConquistados} /></span>
                            </div>
                            <div>
                                <Text texto="Dados do selo selecionado" tamanhoFonte={20} />
                                {
                                    
                                    (selos.length !== 0 || selosConquistados.length !== 0) && (selos[index] !== undefined || selosConquistados[index] !== undefined) && <div style={{textAlign: "left", marginLeft: "20%"}}>
                                        <Text tamanhoFonte={20} texto={"Título: " + ((isConquistadoSelected) ? selosConquistados[index].titulo.split ("'")[0] : selos[index].titulo.split ("'")[0])} />
                                        <Text tamanhoFonte={20} texto={"Descricao: " + ((isConquistadoSelected) ? selosConquistados[index].descricao.split ("'")[0] : selos[index].descricao.split ("'")[0])} />
                                        <Text tamanhoFonte={20} texto={"Meta de atendimentos: " + ((isConquistadoSelected) ? selosConquistados[index].meta : selos[index].meta)} />
                                        {
                                            isConquistadoSelected && <>
                                                <Button acao={ () => setIsOpen (true)} cor="#0743AB" titulo="Compartilhar" />
                                            </>
                                        }
                                    </div>
                                }
                                {
                                    ((selos.length === 0 && selosConquistados.length === 0) || (selos[index] === undefined && selosConquistados[index] === undefined)) &&
                                    <Text texto="Selecione um selo na lista ao lado" tamanhoFonte={18} />
                                }
                            </div>
                        </div>
                    </>
                }
                {
                    (state.dados.tipo === "ADMINISTRADOR" || state.dados.tipo === "'ADMINISTRADOR'") && <>
                        <div style={{textAlign: "left", marginLeft: "10%"}}>
                            <Title titulo="Selos" />
                        </div>
                        <hr style={{width: "80%", color: "white"}} />
                        <div style={{display: "grid", gridTemplateColumns: "50% 50%", marginLeft: "5%", marginTop: "2%"}}>
                            <div>
                                <Text texto="Lista de selos disponíveis" tamanhoFonte={20} />
                                <label style={{ fontFamily: "Open Sans", fontSize: 20, color: 'white'}} htmlFor="areas">Selecione a área do selo: </label>
                                <select id="areas" style={{ marginBottom: "2%" }} onChange={(event) => { setIdArea (event.target.value); setIndex (); }}>
                                    <option value="0">Todos</option>
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
                                <List acao={setIndex} lista={selos} />
                            </div>
                            <div>
                                <Text texto="Dados do selo selecionado" tamanhoFonte={20} />
                                {
                                    
                                    selos.length !== 0 && selos[index] !== undefined && <div style={{textAlign: "left", marginLeft: "20%"}}>
                                        <Form>
                                            <label style={{ fontFamily: "Open Sans", fontSize: 20, color: 'white'}} htmlFor="areas">Selecione a área do selo: </label>
                                            <select id="areas" style={{ marginBottom: "2%" }} onChange={(event) => { setIdAreaSelo (event.target.value) }}>
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
                                            <Input onChange={(event) => { setTitulo (event.target.value) }} comprimento={300} tipo="text" value={(titulo === '') ? selos[index].titulo.split ("'")[0] : titulo} legenda="Título" legendaInput="Insira o título do selo" />
                                            <Input onChange={(event) => { setDescricao (event.target.value) }} comprimento={300} tipo="text" value={(descricao === '') ? selos[index].descricao.split ("'")[0] : descricao} legenda="Descrição" legendaInput="Insira a descrição do selo" />
                                            <Input onChange={(event) => { setMeta (event.target.value) }} comprimento={300} tipo="number" value={(meta === 0) ? selos[index].meta : meta} legenda="Meta" legendaInput="Defina a meta de atendimentos para o selo" />
                                            <Button titulo="Editar selo" cor="#0743AB" acao={() => { updateSelo () }}/>
                                            <Button titulo="Excluir selo" cor="#59149D" acao={() => { excluirSelo () }} />
                                        </Form>
                                    </div>
                                }
                                {
                                    (selos.length === 0 || selos[index] === undefined) && <>
                                        <Text texto="Selecione um selo na lista ao lado ou adicione um selo" tamanhoFonte={18} />
                                        <div style={{textAlign: "center", marginLeft: "5%"}}>
                                            <Text texto="Adicionar um selo" tamanhoFonte={22} />
                                            <Form>
                                                <label style={{ fontFamily: "Open Sans", fontSize: 20, color: 'white'}} htmlFor="areas">Selecione a área do selo: </label>
                                                <select id="areas" style={{ marginBottom: "2%" }} onChange={(event) => { setIdAreaSelo (event.target.value) }}>
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
                                                <Input onChange={(event) => { setTitulo (event.target.value) }} comprimento={300} tipo="text" value={titulo} legenda="Título" legendaInput="Insira um título" />
                                                <Input onChange={(event) => { setDescricao (event.target.value) }} comprimento={300} tipo="text" value={descricao} legenda="Descrição" legendaInput="Insira uma descrição para o selo" />
                                                <Input onChange={(event) => { setMeta (event.target.value) }} comprimento={300} tipo="number" value={meta} legenda="Meta" legendaInput="Insira a meta de atendimentos do selo" />
                                                <Button cor="#0743AB" titulo="Adicionar" acao={() => { adicionarSelo ()}} />
                                            </Form>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </>
                }
            </ContentArea>
        </div>
    )
}