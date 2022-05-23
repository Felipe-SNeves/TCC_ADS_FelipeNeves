const express = require ('express');
const router = express.Router ();
const multer = require ('multer');
const controllerUsuario = require ('../controllers/usuario');
const { verifyToken } = require ('../middleware/auth');
const crypto = require ('crypto');
const jwt = require ('jsonwebtoken');
const nodemailer = require ('nodemailer');

const MIME_TYPE = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/bmp': 'bmp'
}

const MIME_CURRICULUM = {
	'application/pdf': 'pdf',
	'image/tiff': 'tiff',
	'image/tif': 'tiff',
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg'
}

const storagePhotos = multer.diskStorage ({
	destination: (req, file, callback) => {
		let errorMIME = MIME_TYPE[file.mimetype] ? null : new Error ('Invalid MIME Type');
		callback (errorMIME, "./photos/");
	},
	filename: (req, file, callback) => {
		const nome = file.originalname.toLocaleLowerCase ().split (' ').join('_');
		callback (null, nome);
	}
})

const storageCurriculum = multer.diskStorage ({
	destination: (req, file, callback) => {
		let errorMIME = MIME_CURRICULUM[file.mimetype] ? null : new Error ('Invalid MIME Type');
		callback (errorMIME, "./curriculum/");
	},
	filename: (req, file, callback) => {
		const nomeFinal = file.originalname.toLocaleLowerCase ().split ('.')[0] + '.' + MIME_CURRICULUM[file.mimetype];
		callback (null, nomeFinal);
	}
})

router.get ('/getTeachers', (req, res, next) => {
	let teachersData = controllerUsuario.getTeachers ().then ((teachersData) => {
		res.status (200).json ({
			professores: teachersData
		});
	});
});

router.get ('/:id', (req, res, next) => {
	controllerUsuario.consultar (req.params.id)
	.then ((conta) => {
		if (conta.length > 0)
			res.status (200).json ({
				conta: conta
			});
		else
			res.status (404).json ({
				mensagem: "Usuario nao encontrado"
			})
	});
});

router.post ('/signup', multer ({storage: storagePhotos}).single ('foto'), (req, res, next) => {
	
	let usuario = {
		nome: req.body.nome,
		data_nascimento: req.body.data_nascimento,
		email: req.body.email,
		senha: crypto.createHash ('sha256', process.env.HASH_SECRET). update(req.body.senha).digest ('hex'),
		fotoURL: (req.file === undefined) ? "./photos/general.jpg" : `./photos/${req.file.filename}`,
		tipoConta: req.body.tipoConta
	}

	controllerUsuario.adicionar (usuario).then ((result) => {
		if (result)
			res.status (201).json ({
				mensagem: "Usuario inserido"
			});
		else
			res.status (409).json ({
				mensagem: "Usuario nao inserido"
			});
	});
});

router.post('/signup/professor', multer({storage: storageCurriculum}).single ('curriculum'), (req, res, next) => {
	let professorProfile = {
		idArea: req.body.idArea,
		curriculumURL: `./curriculum/${req.file.filename}`,
		email: req.body.email
	};

	controllerUsuario.adicionarCurriculo (professorProfile).then ((response) => {
		res.status (201).json ({
			mensagem: "Professor adicionado"
		});
	});
});

router.put ('/edit/', multer({storage: storagePhotos}).single ('foto'), (req, res, next) => {

	let token = verifyToken (req.body.token);

	if (token) {
		if (token.id == req.body.id) {
			let novosDados = {
				id: req.body.id,
				nome: req.body.nome,
				email: req.body.email,
				senha: crypto.createHash ('sha256', process.env.HASH_SECRET).update (req.body.senha).digest ('hex'),
				fotoURL: (req.file === undefined) ? null : `./photos/${req.file.filename}`
			};
			
			controllerUsuario.editarConta (novosDados).then ((result) => {
				if (result)
					res.status (200).json ({
						mensagem: "Atualizado"
					})
				else
					res.status (409).json ({
						mensagem: "Nao foi possivel atualizar"
					})
			});
		}
		else
			res.status (403).json ({
				mensagem: "Invalid account"
			})
	}
	else
		res.status (401).json ({
			mensagem: "Invalid operation"
		})
});

router.delete ('/:id', (req, res, next) => {

	let token = verifyToken (req.body.token);

	if (token)
		if (token.id == req.params.id)
			controllerUsuario.excluir (req.params.id)
			.then ( (result) => {
				if (result)
					res.status (200).json ({
						mensagem: "Usuario excluido com sucesso"
					});
				else
					res.status (400).json ({
						mensagem: "Usuario nao encontrado"
					})
			});
		else
			res.status (403).json ({
				mensagem: "Conta invalida"
			})
	else
		res.status (401).json ({
			mensagem: "Invalid operation"
		})
});

router.get ('/confirm/:email', (req, res, next) => {
	controllerUsuario.confirmarEmail (req.params.email).then ((result) => {
		res.status (200).json ({
			mensagem: "Email confirmado"
		})
	});
});

router.post ('/recover/', (req, res, next) => {
	let transporter = nodemailer.createTransport ({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS_EMAIL
		}
	});

	let mailOptions = {
		from: process.env.EMAIL,
		to: req.body.email,
		subject: 'iEdu - Recuperação de senha',
		html: `Acesse o seguinte link para alterar a sua senha: <a href="http://localhost:3000/recover/?token=${req.body.email}" target="_blank">confirme aqui</a>!`
	};

	transporter.sendMail (mailOptions);

	res.status (200).json ({
		mensagem: "Email de recuperação enviado!"
	});
});

router.post ('/recover/:email', (req, res, next) => {
	let dados = {
		email: req.params.email,
		senha: crypto.createHash ('sha256', process.env.HASH_SECRET). update(req.body.senha).digest ('hex')
	};

	controllerUsuario.recuperarSenha (dados).then ((result) => {
		if (result)
			res.status (200).json ({
				mensagem: "Senha atualizada"
			})
		else
			res.status (500).json ({
				mensagem: "Não foi possível atualizar a senha, tente novamente mais tarde"
			})
	});
});

router.post ('/aprove/:id', (req, res, next) => {

	let token = verifyToken (req.body.token);

	if (token) {
		if (token.account === "ADMINISTRADOR")
			if (req.body.aprovacao)
				controllerUsuario.aprovarProfessor (req.params.id).then ((result) => {
					res.status (200).json ({
						mensagem: "Professor aprovado"
					});
				});
			else
				res.status (200).json ({
					mensagem: "Professor não aprovado"
				})
		else
				res.status (403).json ({
					mensagem: "Não é administrador"
				})
	}
	else
			res.status (401).json ({
				mensagem: "Invalid operation"
			})
});

router.post ('/signin', (req, res, next) => {
	let dados = {
		email: req.body.email,
		senha: crypto.createHash ('sha256', process.env.HASH_SECRET).update (req.body.senha).digest ('hex')
	};

	controllerUsuario.autenticar (dados).then ((result) => {
		if (result.statusConta === 'BANIDO')
			res.status (403).json ({
				mensagem: "Usuario banido"
			});
		else {
			if (result) {
				let token = jwt.sign ({
					id: result.codigo,
					account: result.tipoConta,
					nome: result.nome,
					email: result.email,
					fotoURL: result.fotoURL,
					iss: "iedu_backend",
					exp: Math.floor (Date.now () / 1000) + 18000 // Expires in 5 hours
				}, process.env.HASH_SECRET);
				res.status (200).json ({
					token: token,
					id: result.codigo,
					nome: result.nome,
					foto: result.fotoURL,
					tipoConta: result.tipoConta
				});
			}
			else
				res.status (401).json ({
					mensagem: "Email ou senha incorretos"
				});	
		}
	});
});

router.post ('/banish', (req, res, next) => {
	let token = verifyToken (req.body.token);

	if (token) {
		if (token.account === "ADMINISTRADOR") {
			controllerUsuario.banir (req.body.id).then ((result) => {
				res.status (200).json ({
					mensagem: "Usuario banido com sucesso"
				});
			});
		}
		else
			res.status (403).json ({
				mensagem: "Usuario nao e administrador"
			});
	}
	else
		res.status (401).json ({
			mensagem: "Invalid operation"
		});
});

router.post ('/warn', (req, res, next) => {
	let token = verifyToken (req.body.token);

	if (token) {
		if (token.account === 'ADMINISTRADOR') {
			controllerUsuario.advertir (req.body.id).then ((result) => {
				res.status (200).json ({
					mensagem: "Usuario advertido"
				});
			});
		}
		else
			res.status (403).json ({
				mensagem: "Usuario nao eh administrador"
			});
	}
	else
		res.status (401).json ({
			mensagem: "Invalid operation"
		});
});

module.exports = router;