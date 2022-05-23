const mysql = require ('mysql');

const register = async (alunoID, professorID, subarea, duvida) => {
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

            let data_atendimento = new Date ();
            let data_at = data_atendimento.toISOString ().split ('T')[0];

            connection.query ("INSERT INTO atendimento(aluno, professor, data) VALUES (" + alunoID + ", " + professorID + ", '" + data_at + "');", (err, result) => {
                if (err)
                    throw err;

                connection.query ("INSERT INTO questionario(idAtendimento, subarea, duvida) VALUES ((SELECT a.idAtendimento FROM atendimento a WHERE a.professor = " + professorID + " AND a.data LIKE '" + data_at + "' ORDER BY a.idAtendimento DESC LIMIT 1), '" + subarea + "', '" + duvida + "');", (err, result) => {
                    if (err)
                        throw err;

                    connection.query ("UPDATE professor p SET p.qntdAtendimentos = p.qntdAtendimentos + 1 WHERE p.codigo = " + professorID + ";", (err) => {
                        if (err)
                            throw err;
                        
                        connection.end ();
                    });
                })
            });
        })
    });
}

module.exports = {
    register
}