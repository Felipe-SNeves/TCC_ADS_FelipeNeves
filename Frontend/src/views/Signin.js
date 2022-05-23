import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUserData } from '../store/userReducer';
import { useNavigate, Navigate } from 'react-router-dom';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Title from '../components/Title';
import Text from '../components/Text';
import Input from '../components/Input';
import Form from '../components/Form';
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from 'axios';

const textStyle = {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: '300',
    color: 'white',
    textAlign: 'center',
    marginTop: 0
}

const spanStyle = {
    color: '#0743AB',
    textDecoration: 'underline',
    textDecorationColor: '#0743AB',
    cursor: 'pointer'
}

export default function Signin (props) {

    const [cadastrado, setCadastrado] = useState (true);
    const [nome, setNome] = useState ('');
    const [dataNascimento, setDataNascimento] = useState ();
    const [email, setEmail] = useState ('');
    const [senha, setSenha] = useState ('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState ('');
    const [foto, setFoto] = useState ('');
    const [curriculum, setCurriculum] = useState ('');
    const [isTeacher, setIsTeacher] = useState ();
    const [isOpen, setModal] = useState (false);
    const dispatch = useDispatch ();
    const navigate = useNavigate ();

    const changeMode = () => {
        setCadastrado (!cadastrado);
    }

    const logar = async () => {
        let userData = {
            email: email,
            senha: senha
        }
        
        await axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/signin", userData).then ((res) => {
            const userAction = addUserData (res.data.id, res.data.token, res.data.nome, res.data.foto, res.data.tipoConta);
            dispatch (userAction);
            return true;
        }).catch ((data) => {
            alert ('Credenciais incorretas! Tente novamente!');
            return false;
        }) && navigate ("/home");
    }

    const cadastrar = () => {

        if (isTeacher === undefined || nome === '' || dataNascimento === '' || email === '' || senha === '') {
            alert ('Preencha todos os campos para se cadastrar!');
            return false;
        }

        if (senha !== confirmacaoSenha) {
            alert ('A confirmação de senha é diferente da senha fornecida!');
            return false;
        }

        let tipoConta = (isTeacher) ? 'PROFESSOR' : null;

        let formData = new FormData ();

        formData.append ('nome', nome);
        formData.append ('data_nascimento', dataNascimento);
        formData.append ('email', email);
        formData.append ('senha', senha);
        formData.append ('foto', foto);
        if (tipoConta != null)
            formData.append ('tipoConta', tipoConta);

        axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/signup", formData).then ((response) => {
            if (isTeacher) {

                const idArea = document.getElementById ("areas").value;
                let teachersFormData = new FormData ();

                teachersFormData.append ('email', email);
                teachersFormData.append ('idArea', idArea);
                teachersFormData.append ('curriculum', curriculum);

                axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/signup/professor", teachersFormData).then ((res) => {
                    alert ('Dados de currículo enviados!');                    
                }).catch ((error) => {
                    alert ("Não foi possível enviar os dados de currículo! Tente novamente!");
                    console.log (error);
                });
            }
            alert ('Usuário cadastrado! Confirme o seu email!');  
        }).catch ((error) => {
            alert ('Não foi possível cadastrar o usuário!');
            console.error (error);
        });
    }

    const state = useSelector ((state) => state.dadosUsuario);

    if (state.dados !== undefined)  
        return <Navigate to="/home" />

    let emailConfirm = new URLSearchParams (window.location.search).get ("confirm");

    if (emailConfirm !== null)
        axios.get ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/confirm/" + emailConfirm).then ((res) => {
            alert ("Email confirmado com sucesso!");
            navigate ("/");
        });

    return (
        <div style={{display: 'flex'}}>
            {
                isOpen && <Modal>
                    <Title titulo="Recuperar senha" />
                    <hr style={{color: "white"}} />
                    <Text tamanhoFonte={20} texto="Insira o seu email para recuperar a senha!" />
                    <Input value={email} onChange={(event) => { setEmail (event.target.value) }} legenda="Email" comprimento={300} tipo="email" legendaInput="Digite o seu email" /> 
                    <div style={{display: "flex", paddingLeft: 100, paddingRight: 100, paddingBottom: 25}}>
                        <Button titulo="Cancelar" acao={() => setModal (false)} cor="#59149D" />
                        <Button titulo="Solicitar" acao={() => { axios.post ("http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_PORT_SERVER + "/account/recover/", { email: email }); alert ("Email de recuperação enviado!"); setModal (false) }} cor="#0743AB" />
                    </div>
                </Modal>
            }
            <Card altura={270} largura={208} margemEsquerda={60} margemTopo={150} espacamento={10}>
                <Icon URLImagemIcone={process.env.PUBLIC_URL + '/assets/duvida.svg'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '35%' }} />
                <Title titulo="Dúvidas?!" />
                <Text texto="Crie uma conta agora e tire todas elas!" tamanhoFonte={22} />
            </Card>
            <Card altura={270} largura={208} margemEsquerda={60} margemTopo={120} espacamento={10}>
                <Icon URLImagemIcone={process.env.PUBLIC_URL + '/assets/medalha.svg'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '35%' }} />
                <Title titulo="Selos!" />
                <Text texto="Atenda alunos e ganhe selos em troca" tamanhoFonte={22} />
            </Card>
            <Card altura={270} largura={208} margemEsquerda={60} margemTopo={90} espacamento={10}>
                <Icon URLImagemIcone={process.env.PUBLIC_URL + '/assets/compartilhar.svg'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '35%' }} />
                <Title titulo="Compartilhe!" />
                <Text texto="Conquiste os selos e compartilhe aonde quiser!" tamanhoFonte={22} />
            </Card>
            <Card altura={cadastrado ? 455 : (isTeacher ? 1000 : 850)} largura={379} margemEsquerda={60} margemTopo={60} espacamento={10}>
                <Icon URLImagemIcone={process.env.PUBLIC_URL + '/assets/login.svg'} sty={{ backgroundColor: "white", height: 45, width: 45, margem: '40%' }} />
                { 
                    cadastrado && <>
                    <Title titulo="Entre na sua conta" />
                    <Form margemEsquerda={35}>
                        <Input value={email} onChange={(event) => { setEmail (event.target.value) }} legenda="Email" comprimento={300} tipo="email" legendaInput="Digite o seu email" />
                        <Input value={senha} onChange={(event) => { setSenha (event.target.value) }} legenda="Senha" comprimento={300} tipo="password" legendaInput="Digite a sua senha" />
                        <Button titulo="Entrar" acao={() => { logar () }} cor="#0743AB" />
                        <div style={{marginTop: 40, float: "left"}}>
                            <p style={textStyle}>Esqueceu a senha?</p>
                            <p style={textStyle}><span style={spanStyle} onClick={() => setModal (true)}>Recupere-a agora!</span></p>
                        </div>
                        <div style={{marginTop: 40}}>
                            <p style={textStyle}>Não possui conta?</p>
                            <p style={textStyle}><span style={spanStyle} onClick={changeMode}>Crie uma agora!</span></p>
                        </div>
                    </Form>
                    </>
                        
                }
                {
                    !cadastrado && <>
                    <Title titulo="Cadastre a sua conta" />
                    <div style={{display: 'flex', marginLeft: 15}}>
                        <div style={{marginRight: 5}}>
                            <Button titulo="Professor" acao={() => setIsTeacher (true)} cor={ (isTeacher === undefined) || (isTeacher === false) ? "#0743AB" : "#59149D"} />
                        </div>
                        <Button titulo="Aluno" acao={() => setIsTeacher (false)} cor={ (isTeacher === undefined) || (isTeacher === true) ? "#0743AB" : "#59149D"} />
                    </div>
                    <Text texto="Escolha o tipo da conta" />
                    <Form margemEsquerda={35}>
                        <Input value={nome} onChange={(event) => setNome (event.target.value)} legenda="Nome" comprimento={300} tipo="text" legendaInput="Informe o seu nome" />
                        <Input onChange={(event) => { let date = new Date (event.target.value); setDataNascimento (date.toISOString ().split ('T')[0]) }} legenda="Data de Nascimento" comprimento={300} tipo="date" legendaInput="Informe a sua data de nascimento" />
                        <Input value={email} onChange={(event) => setEmail (event.target.value)} legenda="Email" comprimento={300} tipo="email" legendaInput="Digite o seu email" />
                        <Input value={senha} onChange={(event) => setSenha (event.target.value)} legenda="Senha" comprimento={300} tipo="password" legendaInput="Digite a sua senha" />
                        <Input value={confirmacaoSenha} onChange={(event) => setConfirmacaoSenha (event.target.value)} legenda="Confirmar a senha" comprimento={300} tipo="password" legendaInput="Confirme a sua senha" />
                        <Input onChange={(event) => {setFoto (event.target.files[0])}} tipo="file" legenda="Escolha uma foto de perfil" comprimento={300} />
                        {
                            isTeacher && <div style={{marginTop: 10}}>
                                <label style={{ fontFamily: "Open Sans", fontSize: 18, color: 'white' }} htmlFor="areas">Selecione a área de atendimento</label>
                                <select id="areas">
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
                                </select>
                                <Input onChange={(event) => {setCurriculum (event.target.files[0])}} tipo="file" legenda="Selecione o seu currículo" comprimento={300} />
                            </div>
                        }
                        <Button titulo="Cadastrar" acao={() => { cadastrar () }} cor="#0743AB" />
                        <div style={{marginTop: 40}}>
                            <p style={textStyle}>Já possui conta?</p>
                            <p style={textStyle}><span style={spanStyle} onClick={changeMode}>Entre agora!</span></p>
                        </div>
                    </Form>
                    </>
                }
            </Card>
        </div>
    );
}