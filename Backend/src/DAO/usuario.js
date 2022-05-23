const mysql = require ('mysql');

const consultar = async (id) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		connection.connect ((err) => {
			if (err)
				throw err;

			connection.query ("SELECT * FROM usuario u WHERE u.codigo = " + mysql.escape (id), (err, result) => {
				if (err)
					throw err;
				resolve (result);
				connection.end ();
			});
		});
	})
};

const excluir = async (id) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		connection.connect ((err) => {
			if (err)
				throw err;
			
			connection.query ("DELETE FROM usuario WHERE codigo = " + mysql.escape (id), (err, result) => {
				if (err)
					throw err;
				if (result.affectedRows === 0)
					resolve (false);
				resolve (true);
				connection.end ();
			});
		})
	});
}

const adicionar = async (nome, data_nascimento, email, senha, fotoURL, tipoConta) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		emailFiltered = mysql.escape (email);
		email = emailFiltered.slice (1, -1);

		connection.connect ((err) => {
			if (err)
				throw err;

			let values = (tipoConta === undefined) ? [[mysql.escape (nome), data_nascimento, email,
				mysql.escape (senha), mysql.escape (fotoURL)]] : [[mysql.escape (nome), data_nascimento, email,
					mysql.escape (senha), mysql.escape (fotoURL), mysql.escape(tipoConta)]];

			let sql = (tipoConta === undefined) ? "INSERT INTO usuario (nome, data_nascimento, email, senha, fotoURL) VALUES (?);" : "INSERT INTO usuario (nome, data_nascimento, email, senha, fotoURL, tipoConta) VALUES (?);";

			connection.query (sql, values, (err, result) => {
				if (err)
					if (err.sqlState === '23000') {
						//console.log (err);
						resolve (false);
					}
					else
						throw err;
				else
					if (result.affectedRows === 0)
						resolve (false);
					resolve (true);
				connection.end ();
			});
		});
	});
}

const adicionarProfessor = async (dados) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		connection.connect ((err) => {
			if (err)
				throw err;

			sql = "INSERT INTO professor (codigo, idArea, curriculo) VALUES ((SELECT u.codigo FROM usuario u WHERE u.email LIKE '%" + 
			dados.email + "%')," + dados.idArea + "," + mysql.escape(dados.curriculumURL) + ");";
			connection.query (sql, (err, result) => {
				if (err)
					throw err;
				resolve (true);
				connection.end ();
			});
		});
	});
}

const editarDados = async (dados) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		connection.connect ((err) => {
			if (err)
				throw err;

			if (dados.nome) {
				connection.query ("UPDATE usuario SET nome = " + mysql.escape(dados.nome) + "WHERE codigo = " + dados.id + ";", (err) => {
					if (err) {
						reject (false);
						console.log (err);
					}
				});
			}

			if (dados.email) {
				connection.query ("UPDATE usuario SET flagEmail = FALSE, email = " + mysql.escape(dados.email) + "WHERE codigo = " + dados.id + ";", (err) => {
					if (err) {
						reject (false);
						console.log (err);
					}
				});
			}

			if (dados.senha) {
				connection.query ("UPDATE usuario SET senha = " + mysql.escape(dados.senha) + "WHERE codigo = " + dados.id + ";", (err) => {
					if (err) {
						reject (false);
						console.log (err);
					}
				});
			}

			if (dados.fotoURL) {
				connection.query ("UPDATE usuario SET fotoURL = " + mysql.escape(dados.fotoURL) + "WHERE codigo = " + dados.id + ";", (err) => {
					if (err) {
						reject (false);
						console.log (err);
					}
				});
			}
			resolve (true);
			connection.end ();
		});
	});
}

const confirmarEmail = async (email) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		emailFiltered = mysql.escape (email);
		email = emailFiltered.slice (1, -1);

		connection.connect ((err) => {
			if (err)
				throw err;
			connection.query ("UPDATE usuario SET flagEmail = TRUE WHERE email LIKE '%" + email + "%';", (err, result) => {
				if (err)
					throw err;
				
				resolve (true);
				connection.end ();
			});
		});
	});
} 

const recuperarSenha = async (email, senha) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		emailFiltered = mysql.escape (email);
		email = emailFiltered.slice (1, -1);

		connection.connect ((err) => {
			if (err)
				throw err;
			
			connection.query ("UPDATE usuario u SET u.senha = " + mysql.escape (senha) + "WHERE u.email LIKE '%" + email + "%';", (err, result) => {
				if (err)
					throw err;

				resolve (true);
				connection.end ();
			});
		});
	});
}

const aprovarCurriculo = async (id) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});
		
		connection.connect ((err) => {
			if (err)
				throw err;

			connection.query ("UPDATE professor p SET p.habilitacao = TRUE WHERE p.codigo = " + id, (err, result) => {
				if (err)
					throw err;

				resolve (true);
				connection.end ();
			});
		});
	});
}

const autenticar = async (email) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		emailFiltered = mysql.escape (email);
		email = emailFiltered.slice (1, -1);

		connection.connect ((err) => {
			if (err)
				throw err;
			connection.query ("SELECT u.codigo, u.tipoConta, u.senha, u.email, u.nome, u.fotoURL, u.statusConta FROM usuario u WHERE u.email LIKE '" + email + "';", (err, result) => {
				if (err)
					throw err;
				resolve (result);
				connection.end ();
			});
		});
	});
}

const consultarHabilitacao = async (id) => {
	return new Promise ((resolve, reject) =>  {
		
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		let sql = "SELECT p.habilitacao, p.idArea, u.email, u.nome FROM professor p INNER JOIN usuario u ON p.codigo = u.codigo WHERE p.codigo = ?";

		connection.connect ((error) => {
			if (error)
				throw error;

			connection.query (sql, id, (error, result) => {
				if (error)
					throw error;
			
				resolve (result);
				connection.end ();
			});
		});
	});
};

const getTeachers = async () => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});
	
		connection.connect ((error) => {
			if (error)
				throw error;
	
			connection.query ("SELECT u.codigo, u.email, u.data_nascimento, u.nome, p.idArea, p.curriculo FROM professor p INNER JOIN usuario u ON u.codigo = p.codigo WHERE p.habilitacao = FALSE;", (error, result) => {
				if (error)
					throw error;

				resolve (result);
				connection.end ();
			});
		});
	});
}

const banir = async (id) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		connection.connect ((err) => {
			if (err)
				throw err;

			connection.query ("UPDATE usuario u SET u.statusConta = 'BANIDO' WHERE u.codigo = " + id + ";", (err, result) => {
				if (err)
					throw err;
				resolve (true);
				connection.end ();
			});
		})
	})
}

const advertir = async (id) => {
	return new Promise ((resolve, reject) => {
		let connection = mysql.createConnection ({
			host: process.env.LOCAL,
			user: process.env.USERDATA,
			password: process.env.PASS,
			database: process.env.DATABASE
		});

		connection.connect ((err) => {
			if (err)
				throw err;
			
			connection.query ("SELECT u.advertenciasQntd FROM usuario u WHERE u.codigo = " + id + ";", (err, result) => {
				if (err)
					throw err;
				
				if (result[0].advertenciasQntd < 2)
					connection.query ("UPDATE usuario u SET u.advertenciasQntd = " + (result[0].advertenciasQntd + 1) + " WHERE u.codigo = " + id + ";", (err, result) => {
						if (err)
							throw err;
						resolve (true);
						connection.end ();
					})
				else
					connection.query ("UPDATE usuario u SET u.statusConta = 'BANIDO' WHERE u.codigo = " + id + ";", (err, result) => {
						if (err)
							throw err;
						resolve (true);
						connection.end ();
					})
			})
		})
	});
}


module.exports = { 
	consultar,
	excluir,
	adicionar,
	adicionarProfessor,
	editarDados,
	confirmarEmail,
	recuperarSenha,
	aprovarCurriculo,
	autenticar,
	consultarHabilitacao,
	getTeachers,
	banir,
	advertir 
};
