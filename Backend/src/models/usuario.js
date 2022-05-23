const usuarioDAO = require ('../DAO/usuario');
const nodemailer = require ('nodemailer');

class Usuario {
	async consultar (id) {
		return usuarioDAO.consultar (id);
	}

	async excluir (id) {
		return usuarioDAO.excluir (id);
	}

	async adicionar (dados) {
		let transporter = nodemailer.createTransport ({
			service: process.env.EMAIL_SERVICE,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASS_EMAIL
			}
		});

		let mailOptions = {
			from: process.env.EMAIL,
			to: dados.email,
			subject: 'iEdu - Confirmar email',
			html: `Acesse o seguinte link para confirmar o seu email: <a href="http://localhost:3000/?confirm=${dados.email}" target="_blank">confirme aqui</a>!`
		};

		setTimeout (() => {transporter.sendMail (mailOptions, (err, info) => {
			if (err)
				console.log (err);
			else
				console.log ("Email enviado: " + info.response);
			})
		}, 1000);

		return usuarioDAO.adicionar (dados.nome, dados.data_nascimento, dados.email, dados.senha, dados.fotoURL, dados.tipoConta);
	}

	async adicionarCurriculo (dados) {
		return usuarioDAO.adicionarProfessor (dados);
	}

	async editar (dados) {

		if (dados.email) {
			let transporter = nodemailer.createTransport ({
				service: process.env.EMAIL_SERVICE,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASS_EMAIL
				}
			});
	
			let mailOptions = {
				from: process.env.EMAIL,
				to: dados.email,
				subject: 'iEdu - Email Alterado',
				html: `Acesse o seguinte link para confirmar o seu novo email: <a href="http://localhost:3000/?confirm=${dados.email}" target="_blank">confirme aqui</a>!`
			};
	
			setTimeout (() => {transporter.sendMail (mailOptions, (err, info) => {
				if (err)
					console.log (err);
				else
					console.log ("Email enviado: " + info.response);
				})
			}, 1000);
		}

		return usuarioDAO.editarDados (dados);
	}

	async confirmarEmail (email) {
		return usuarioDAO.confirmarEmail (email);
	}

	async recuperar (dados) {
		return usuarioDAO.recuperarSenha (dados.email, dados.senha);
	}

	async aprovar (id) {
		return usuarioDAO.aprovarCurriculo (id);
	}

	async autenticar (email, senha) {
		let dados = await usuarioDAO.autenticar (email);
		if (!dados[0])
			return false;
		return (dados[0].senha === senha || `'${senha}'` === dados[0].senha) ? dados[0] : false;
	}

	async getHabilitacao (id) {
		return await usuarioDAO.consultarHabilitacao (id);
	}

	async getTeachers () {
		return usuarioDAO.getTeachers ();
	}

	async banir (id) {
		return usuarioDAO.banir (id);
	}

	async advertir (id) {
		return usuarioDAO.advertir (id);
	}
};

module.exports = Usuario;
