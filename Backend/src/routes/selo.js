const express = require ('express');
const router = express.Router ();
const { verifyToken } = require ('../middleware/auth');
const seloController = require ('../controllers/selo');

router.get ('/list/:idArea', (req, res, next) => {
    seloController.list (req.params.idArea).then ((result) => {
        res.status (200).json ({
            selos: result
        });
    });
});

router.post ('/getConquered/:idTeachers', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token) {
        if (token.id == req.params.idTeachers) {
            seloController.getObtained (token.id).then ((result) => {
                res.status (200).json ({
                    selos: result
                });
            })
        }
        else   
            res.status (403).json ({
                mensagem: "Conta invalida"
            });
    }
    else
        res.status (401).json ({
            mensagem: "Invalid operation"
        });
});

router.delete ('/delete/:idSelo', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token) {
        if (token.account === "ADMINISTRADOR") {
            seloController.excluir (req.params.idSelo).then ((result) => {
                if (result)
                    res.status (200).json ({
                        mensagem: "Selo excluido com sucesso"
                    });
                else
                    res.status (400).json ({
                        mensagem: "Selo nao encontrado"
                    });
            });
        }
        else
            res.status (403).json ({
                mensagem: "Conta invalida"
            })
    }
    else
        res.status (401).json ({
            mensagem: "Invalid operation"
        })
});

router.post ('/addSelo', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token) {
        let dados = {
            titulo: req.body.titulo,
            idArea: req.body.idArea,
            descricao: req.body.descricao,
            meta: req.body.meta
        };
        seloController.adicionar (dados).then ((result) => {
            if (result)
                res.status (201).json ({
                    mensagem: "Selo inserido"
                });
            else
                res.status (409).json ({
                    mensagem: "Selo nao inserido"
                });
        });
    }
    else
        res.status (401).json ({
            mensagem: "Invalid operation"
        });
});

router.get ('/:idSelo', (req, res, next) => {
    seloController.getSelo (req.params.idSelo).then ((result) => {
        let selo = {
            idSelo: result[0].idSelo,
            titulo: result[0].titulo,
            idArea: result[0].idArea,
            descricao: result[0].descricao,
            meta: result[0].meta
        };

        res.status (200).json ({
            selo: selo
        });
    }).catch ((error) => {
        console.error ("Error on getting selo: " + error);
        res.status (404).json ({
            mensagem: "Nao foi possivel encontrar o selo"
        });
    });
});

router.put ('/edit', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token) {
        if (token.account === "ADMINISTRADOR") {
            let dados = {
                id: req.body.id,
                titulo: req.body.titulo,
                idArea: req.body.idArea,
                descricao: req.body.descricao,
                meta: req.body.meta
            };
            seloController.editar (dados).then ((result) => {
                if (result)
                    res.status (200).json ({
                        mensagem: "Atualizado"
                    });
                else
                    res.status (409).json ({
                        mensagem: "Nao foi possivel atualizar"
                    });
            });
        }
        else
            res.status (403).json ({
                mensagem: "Conta invalida"
            })
    }
    else
        res.status (401).json ({
            mensagem: "Invalid account"
        });
});

module.exports = router;