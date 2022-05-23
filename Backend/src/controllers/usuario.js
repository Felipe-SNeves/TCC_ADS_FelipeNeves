const Usuario = require ('../models/usuario');

const consultar = async (id) => {
	usuario = new Usuario ();
	return usuario.consultar (id);
};

const excluir = async (id) => {
	usuario = new Usuario ();
	return usuario.excluir (id);
};

const adicionar = async (dados) => {
	usuario = new Usuario ();
	return usuario.adicionar (dados);
}

const adicionarCurriculo = async (dados) => {
	usuario = new Usuario ();
	return usuario.adicionarCurriculo (dados);
}

const editarConta = async (dados) => {
	usuario = new Usuario ();
	return usuario.editar (dados);
}

const confirmarEmail = async (email) => {
	usuario = new Usuario ();
	return usuario.confirmarEmail (email);
}

const recuperarSenha = async (dados) => {
	usuario = new Usuario ();
	return usuario.recuperar (dados);
}

const aprovarProfessor = async (id) => {
	usuario = new Usuario ();
	return usuario.aprovar (id);
}

const autenticar = async (dados) => {
	usuario = new Usuario ();
	return new Promise ((resolve, reject) => {
		resolve (usuario.autenticar (dados.email, dados.senha))
	});
}

const getTeachers = async () => {
	let usuario = new Usuario ();
	return usuario.getTeachers ();
}

const banir = async (id) => {
	let usuario = new Usuario ();
	usuario.banir (id);
}

const advertir = async (id) => {
	let usuario = new Usuario ();
	usuario.advertir (id);
}

module.exports = {
	consultar,
	excluir,
	adicionar,
	adicionarCurriculo,
	editarConta,
	confirmarEmail,
	recuperarSenha,
	aprovarProfessor,
	autenticar,
	getTeachers,
	banir,
	advertir
};
