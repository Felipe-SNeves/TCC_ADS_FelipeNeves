const express = require ('express');
const router = express.Router ();
const Chatroom = require ('../models/Chatroom');
const { verifyToken } = require ('../middleware/auth');
const attendanceController = require ('../controllers/attendance');

router.post ('/enable', (req, res, next) => {
    let token = verifyToken (req.body.token);
    if (token)
        attendanceController.enableTeacher (token).then ((result) => {
            if (result)
                res.status (200).json ({
                    mensagem: "Enabling teacher for attendance"
                });
            else
                res.status (403).json ({
                    mensagem: "Professor sem permissao"
                });
        });  
    else
        res.status (401).json ({
            mensagem: "Invalid operation!"
        });
});

router.post ('/disable', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token) 
        attendanceController.disableTeacher (token).then ((result) => {
            res.status (200).json ({
                mensagem: "Disabling teacher for attendance"
            });
        })
    else
        res.status (401).json ({
            mensagem: "Invalid operation!"
        });
});

router.post ('/onqueue', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token)
        if (attendanceController.addAttendanceToQueue (token.id, token.nome, req.body.area, req.body.subarea, req.body.duvida, token.email))
            res.status (200).json ({
                mensagem: "queued"
            });
        else
            res.status (503).json ({
                mensagem: "Sem professor na area"
            });
    else
        res.status (403).json ({
            mensagem: "Invalid operation"
        })
});

router.post ('/getNextAttendance', (req, res, next) => {

    let token = verifyToken (req.body.token);

    if (token) {
        attendanceController.getNextAttendance (token.id).then ((attendanceData) => {
            if (attendanceData === undefined)
                res.status (409).json ({
                    mensagem: "Sem atendimentos na fila"
                });
            else {
                let port = Math.floor ((Math.random () * 45500) + 5000);
                res.status (200).json ({
                    mensagem: "Chatroom opened!",
                    porta: port,
                    attendance: attendanceData
                });
                new Chatroom (port);
            }
        });
    }
    else
        res.status (403).json ({
            mensagem: "Invalid operation"
        });
});

router.post ('/acceptAttendance', (req, res, next) => {
    let token = verifyToken (req.body.token);

    if (token) {
        attendanceController.blockTeacher (token.id);
        attendanceController.removeAttendance (token.id, req.body.porta);
        res.status (200).json ({
            mensagem: "Attendance started",
            inicialDate: new Date ()
        })
    }
    else
        res.status (403).json ({
            mensagem: "Invalid operation"
        });
});

module.exports = router;