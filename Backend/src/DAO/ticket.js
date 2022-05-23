const mysql = require ('mysql');

const getTicket = async (id) => {
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

            connection.query ("SELECT * FROM ticket WHERE idTicket = " + id + ";", (err, result) => {
                if (err)
                    throw err;
                resolve (result);
                connection.end ();
            })
        });
    });
};

const getTickets = async () => {
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
    
            connection.query ("SELECT * FROM ticket WHERE status = 'ABERTO'", (err, result) => {
                if (err)
                    throw err;
                resolve (result);
                connection.end ();
            });
        });
    });
}

const getClosedTickets = async () => {
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
            
            connection.query ("SELECT * FROM ticket WHERE status = 'FECHADO';", (err, result) => {
                if (err)
                    throw err;

                resolve (result);
                connection.end ();
            })
        })
    });
}

const submit = async (usuarioReportadoEmail, titulo, descricao, data_submissao) => {
    return new Promise ((resolve, reject) => {
        let connection = mysql.createConnection ({
            host: process.env.LOCAL,
            user: process.env.USERDATA,
            password: process.env.PASS,
            database: process.env.DATABASE
        });

        let usuarioEmail = mysql.escape (usuarioReportadoEmail).slice (1, -1);

        connection.connect ((err) => {
            if (err)
                throw err;

            connection.query ("INSERT INTO ticket(usuarioReportado, titulo, descricao, data_submissao) VALUES ((SELECT u.codigo FROM usuario u WHERE u.email LIKE '" + usuarioEmail + "'), " + mysql.escape (titulo) + ", " + mysql.escape (descricao) + ", " + mysql.escape (data_submissao) + ");", (err, result) => {
                
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
        });
    });
}

const close = async (id, message) => {
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

            connection.query ("UPDATE ticket t SET t.status = 'FECHADO', t.resposta = '" + message + "' WHERE t.idTicket = " + id + ";", (err, result) => {
                if (err) {
                    reject (false);
                    console.error (err);
                }

                resolve (true);
                connection.end ();
            });
        })
    });
}

module.exports = {
    getTicket,
    getTickets,
    submit,
    close,
    getClosedTickets
}