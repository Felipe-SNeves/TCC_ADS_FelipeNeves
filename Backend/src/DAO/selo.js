const mysql = require ('mysql');

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

            connection.query ("DELETE FROM selo WHERE idSelo = " + id, (err, result) => {
                if (err)
                    throw err;

                if (result.affectedRows === 0)
                    resolve (false);
                resolve (true);
                connection.end ();
            });
        });
    });
}

const adicionarSelo = async (titulo, idArea, descricao, meta) => {
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

            let sql = "INSERT INTO selo(titulo, idArea, descricao, meta) VALUES (?);";
            let values = [[ mysql.escape (titulo).split ("'")[1], idArea, descricao, mysql.escape (meta) ]];

            connection.query (sql, values, (err, result) => {
                if (err)
                    if (err.sqlState === '23000')
                        resolve (false);
                    else
                        throw err;
                else
                    if (result.affectedRows === 0)
                        resolve (false);
                    resolve (true);
                connection.end ();
            });
        })
    });
}

const listSelos = async (idArea) => {
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

            let sql = (idArea === "0") ? "SELECT * FROM selo;" : "SELECT * FROM selo WHERE idArea = " + idArea + ";";

            connection.query (sql, (err, result) => {
                if (err)
                    throw err;
                resolve (result);
                connection.end ();
            });
        })
    });
}

const editarSelo = async (dados) => {
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

            if (dados.titulo) {
                connection.query ("UPDATE selo SET titulo = " + mysql.escape (dados.titulo) + " WHERE idSelo = " + dados.id + ";", (err) => {
                    if (err) {
                        reject (false);
                        console.error (err);
                    }
                })
            }

            if (dados.idArea) {
                connection.query ("UPDATE selo SET idArea = " + dados.idArea + " WHERE idSelo = " + dados.id + ";", (err) => {
                    if (err) {
                        reject (false);
                        console.error (err);
                    }
                })
            }

            if (dados.descricao) {
                connection.query ("UPDATE selo SET descricao = " + mysql.escape (dados.descricao) + " WHERE idSelo = " + dados.id + ";", (err) => {
                    if (err) {
                        reject (false);
                        console.error (err);
                    }
                })
            }

            if (dados.meta) {
                connection.query ("UPDATE selo SET meta = " + mysql.escape (dados.meta) + " WHERE idSelo = " + dados.id + ";", (err) => {
                    if (err) {
                        reject (false);
                        console.error (err);
                    }
                })
            }

            resolve (true);
            connection.end ();
        })
    });
}

const getInfo = async (id) => {
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

            connection.query ("SELECT * FROM selo s WHERE s.idSelo = " + id + ";", (err, result) => {
                if (err)
                    throw err;
                resolve (result);
                connection.end ();
            });
        });
    });
}

const getObtained = async (idTeacher) => {
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

            connection.query ("SELECT s.idSelo, s.titulo, s.descricao, s.meta FROM selo s INNER JOIN professor p WHERE (SELECT p.idArea FROM professor p WHERE p.codigo = " + idTeacher + ") = s.idArea AND p.qntdAtendimentos >= s.meta", (err, result) => {
                if (err)
                    throw err;
                resolve (result);
                connection.end ();
            });
        });
    });
}

module.exports = {
    getInfo,
    listSelos,
    adicionarSelo,
    adicionarSelo,
    excluir,
    editarSelo,
    getObtained
}