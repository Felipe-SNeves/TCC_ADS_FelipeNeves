const express = require ('express');
const router = express.Router ();
const { verifyToken } = require ('../middleware/auth');
const ticketController = require ('../controllers/ticket');

router.get ('/list', (req, res, next) => {
    ticketController.listar ().then ((tickets) => {
        res.status (200).json ({
            tickets: tickets
        });
    });
});

router.get ('/getClosed', (req, res, next) => {
    ticketController.getClosed ().then ((result) => {
        res.status (200).json ({
            tickets: result
        });
    });
});

router.get ('/:idTicket', (req, res, next) => {
    ticketController.getTicket (req.params.idTicket).then ((result) => {
        res.status (200).json ({
            ticket: result
        });
    })
});

router.post ('/submit', (req, res, next) => {

    let token = verifyToken (req.body.token);
    
    if (token) {
        let reportData = {
            usuarioReportado: req.body.emailReportado,
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            data_submissao: req.body.data_submissao
        };

        ticketController.submit (reportData).then ((result) => {
            if (result)
                res.status (200).json ({
                    mensagem: "Ticket submetido"
                });
            else
                res.status (409).json ({
                    mensagem: "Nao foi possivel submeter o ticket"
                });
        }).catch ((err) => {
            console.error (err);
            res.status (500).json ({
                mensagem: "Could not submit ticket"
            });
        });
    }
    else
        res.status (401).json ({
            mensagem: "Invalid operation"
        });
});

router.put ('/close/:idTicket', (req, res, next) => {

    let token = verifyToken (req.body.token);

    if (token) {
        if (token.account === "ADMINISTRADOR") {
            ticketController.close (req.params.idTicket, req.body.message).then ((result) => {
                res.status (200).json ({
                    mensagem: "Ticket closed"
                });
            }).catch ((err) => {
                console.error (err);
                res.status (500).json ({
                    mensagem: "Could not close the current ticket"
                });
            })
        }
        else
            res.status (403).json ({
                mensagem: "Nao e administrador"
            });
    }
    else
        res.status (401).json ({
            mensagem: "Invalid operation"
        });
});

module.exports = router;