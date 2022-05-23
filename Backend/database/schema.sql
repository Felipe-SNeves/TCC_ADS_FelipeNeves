/************ AREA DE DDL ************/

CREATE TABLE IF NOT EXISTS conhecimento_area (
	idArea SMALLINT NOT NULL PRIMARY KEY,
	area VARCHAR (12) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS conhecimento_subarea (
	idArea SMALLINT NOT NULL,
	subarea VARCHAR (40) NOT NULL UNIQUE,
	PRIMARY KEY (idArea, subarea),
	FOREIGN KEY (idArea) REFERENCES conhecimento_area (idArea) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario (
	codigo INTEGER NOT NULL AUTO_INCREMENT,
	nome VARCHAR (50) NOT NULL,
	data_nascimento DATE NOT NULL,
	email VARCHAR (50) NOT NULL UNIQUE,
	senha VARCHAR (100) NOT NULL,
	fotoURL VARCHAR (100) NULL,
	tipoConta VARCHAR (15) NOT NULL DEFAULT 'ALUNO',
	advertenciaFlag BOOLEAN NOT NULL DEFAULT FALSE,
	advertenciasQntd SMALLINT NOT NULL DEFAULT 0,
	flagEmail BOOLEAN NOT NULL DEFAULT FALSE,
	statusConta VARCHAR (10) NOT NULL DEFAULT 'ATIVO',
	PRIMARY KEY (codigo),
	CHECK (tipoConta IN ('ADMINISTRADOR', 'ALUNO', 'PROFESSOR')),
	CHECK (advertenciasQntd >= 0 AND advertenciasQntd <= 3),
	CHECK (statusConta IN ('ATIVO', 'INATIVO', 'BANIDO'))
);

CREATE TABLE IF NOT EXISTS professor (
	codigo INTEGER NOT NULL PRIMARY KEY,
	idArea SMALLINT NOT NULL,
	curriculo VARCHAR (100) NOT NULL,
	habilitacao BOOLEAN NOT NULL DEFAULT FALSE,
	qntdAtendimentos INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY (codigo) REFERENCES usuario(codigo) ON DELETE CASCADE,
	FOREIGN KEY (idArea) REFERENCES conhecimento_area(idArea) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS atendimento (
	idAtendimento INTEGER NOT NULL AUTO_INCREMENT,
	aluno INTEGER NOT NULL,
	professor INTEGER NULL,
	data DATE NOT NULL,
	PRIMARY KEY (idAtendimento),
	FOREIGN KEY (aluno) REFERENCES usuario(codigo) ON DELETE CASCADE,
	FOREIGN KEY (professor) REFERENCES professor(codigo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questionario (
	idAtendimento INTEGER NOT NULL PRIMARY KEY,
	subarea VARCHAR(40) NOT NULL,
	duvida VARCHAR (500) NOT NULL,
	FOREIGN KEY (idAtendimento) REFERENCES atendimento(idAtendimento) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ticket (
	idTicket INTEGER NOT NULL AUTO_INCREMENT,
	usuarioReportado INTEGER NOT NULL,
	titulo VARCHAR (50) NOT NULL,
	descricao VARCHAR (500) NOT NULL,
	data_submissao DATE NOT NULL,
	status VARCHAR (10) NOT NULL DEFAULT 'ABERTO',
	resposta VARCHAR (500) NULL,
	PRIMARY KEY (idTicket),
	FOREIGN KEY (usuarioReportado) REFERENCES usuario(codigo) ON DELETE CASCADE,
	CHECK (status IN ('ABERTO', 'EXPIRADO', 'FECHADO'))
);

CREATE TABLE IF NOT EXISTS selo (
	idSelo SMALLINT NOT NULL AUTO_INCREMENT,
	titulo VARCHAR (20) NOT NULL UNIQUE,
	idArea SMALLINT NOT NULL,
	descricao VARCHAR (300) NOT NULL,
	meta SMALLINT NOT NULL,
	FOREIGN KEY (idArea) REFERENCES conhecimento_area(idArea) ON DELETE CASCADE,
	CHECK (meta >= 1 AND meta <= 1000),
	PRIMARY KEY (idSelo)
);

CREATE TABLE IF NOT EXISTS professor_selo (
	codigoProfessor INTEGER NOT NULL,
	idSelo SMALLINT NOT NULL,
	dataObtencao DATE NULL,
	PRIMARY KEY (codigoProfessor, idSelo),
	FOREIGN KEY (codigoProfessor) REFERENCES professor(codigo) ON DELETE CASCADE,
	FOREIGN KEY (idSelo) REFERENCES selo(idSelo) ON DELETE CASCADE,
	CHECK (progressao >= 0.00)
);

/*************** AREA DE DML *************************/

INSERT INTO conhecimento_area (idArea, area) VALUES (1, 'FISICA'), (2, 'MATEMATICA'), (3, 'QUIMICA'), (4, 'BIOLOGIA');
INSERT INTO conhecimento_area (idArea, area) VALUES (5, 'LITERATURA'), (6, 'GRAMATICA'), (7, 'ARTES');
INSERT INTO conhecimento_area (idArea, area) VALUES (8, 'HISTORIA'), (9, 'GEOGRAFIA'), (10, 'FILOSOFIA'), (11, 'SOCIOLOGIA');

INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (1, 'Vetores'), (1, 'Sistema de unidades'), (1, 'Cinematica');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (1, 'Dinamica'), (1, 'Energia e momento'), (1, 'Estatica e hidroestatica');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (1, 'Gravitacao'), (1, 'Eletricidade e eletromagnetismo'), (1, 'Termologia'), (1, 'Optica'), (1, 'Ondulatoria'), (1, 'Fisica Moderna');


INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (2, 'Matematica Basica'), (2, 'Geometria Plana'), (2, 'Geometria Espacial');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (2, 'Estatistica e Probabilidade'), (2, 'Algebra'), (2, 'Geometria Analitica'), (2, 'Trigonometria');

INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (3, 'Atomistica'), (3, 'Estequeometria'), (3, 'Quimica Inorganica');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (3, 'Fisico Quimica'), (3, 'Quimica Organica'), (3, 'Estudo dos Gases');

INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (4, 'Citologia'), (4, 'Bioquimica'), (4, 'Metabolismo celular');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (4, 'Histologia'), (4, 'Fisiologia animal'), (4, 'Embriologia');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (4, 'Taxionomia'), (4, 'Botanica'), (4, 'Genetica'), (4, 'Origem da Vida e Evolucao'), (4, 'Ecologia');

INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (5, 'Teoria Literaria'), (5, 'Escolas Literarias');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (6, 'Morfologia'), (6, 'Ortografia'), (6, 'Sintaxe'), (6, 'Interpretacao de Textos');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (7, 'Arte pre historica'), (7, 'Arte na Antiguidade'), (7, 'Arte medieval'), (7, 'Arte na era moderna'), (7, 'Arte na era contemporanea');


INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (8, 'Pre Historia'), (8, 'Antiguidade Classica'), (8, 'Antiguidade Oriental'), (8, 'Idade Media');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (8, 'Idade Moderna'), (8, 'Idade Contemporanea'), (8, 'Brasil Colonia'), (8, 'Brasil Imperio'), (8, 'Brasil Republica');

INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (9, 'Geografia do Brasil'), (9, 'Regionalizacao Mundial'), (9, 'Movimentos sociais e politicos');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (9, 'Industria e Agropecuaria'), (9, 'Comercio e Transporte'), (9, 'Natureza e Geologia'), (9, 'Cartologia');

INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (10, 'Filosofia Geral'), (10, 'Filosofia Antiga'), (10, 'Filosofia Medieval e Patristica');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (10, 'Filosofia Moderna'), (10, 'Filosofia Contemporanea');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (11, 'Classicos da Sociologia'), (11, 'Estruturas Produtivas e Politicas');
INSERT INTO conhecimento_subarea (idArea, subarea) VALUES (11, 'Homem, Natureza e Cultura');

-- Senha do admin: 123123
INSERT INTO usuario(nome, data_nascimento, email, senha, fotoURL, tipoConta) VALUES ('ADMIN', '2000-01-01', 'a@a.com', '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e', '../photos/general.jpg', 'ADMINISTRADOR');
