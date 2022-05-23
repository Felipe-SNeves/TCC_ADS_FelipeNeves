const Usuario = require ('../models/usuario');
const Attendance = require ('../models/attendance');
const AttendanceSubject = require ('../models/AttendanceSubject');

let attendanceSub = new AttendanceSubject (4999);

let active_teachers = [
    { area: "FISICA", teachers: [] }, { area: "MATEMATICA", teachers: [] }, { area: "QUIMICA", teachers: [] },
    { area: "BIOLOGIA", teachers: [] }, { area: "LITERATURA", teachers: [] }, { area: "GRAMATICA", teachers: [] },
    { area: "ARTES", teachers: [] }, { area: "HISTORIA", teachers: [] }, { area: "GEOGRAFIA", teachers: [] },
    { area: "FILOSOFIA", teachers: [] }, { area: "SOCIOLOGIA", teachers: [] }
];

let attendance_queue = [
    { area: "FISICA", attendances: [] }, { area: "MATEMATICA", attendances: [] }, { area: "QUIMICA", attendances: [] },
    { area: "BIOLOGIA", attendances: [] }, { area: "LITERATURA", attendances: [] }, { area: "GRAMATICA", attendances: [] },
    { area: "ARTES", attendances: [] }, { area: "HISTORIA", attendances: [] }, { area: "GEOGRAFIA", attendances: [] },
    { area: "FILOSOFIA", attendances: [] }, { area: "SOCIOLOGIA", attendances: [] }
];

const enableTeacher = async (token) => {
    return new Promise ((resolve, reject) => {
        let usuario = new Usuario ();
        usuario.getHabilitacao (token.id).then ((teachersData) => {
            if (teachersData[0].habilitacao === 1) {
                active_teachers[(teachersData[0].idArea) - 1].teachers.push ({ token: token, state: "DISPONIVEL" });
                console.log ("Active teachers of the same subject: ", active_teachers[(teachersData[0].idArea) - 1].teachers);
                resolve (true);
            }
            resolve (false);
        });
    });
};

const disableTeacher = async (token) => {
    return new Promise ((resolve, reject) => {
        let usuario = new Usuario ();
        usuario.getHabilitacao (token.id).then ((teachersData) => {
            let index = active_teachers[(teachersData[0].idArea) - 1].teachers.findIndex ((teachersData) => {
                if (teachersData != undefined)
                    return teachersData.token.id === token.id;
            });
            delete active_teachers[(teachersData[0].idArea) - 1].teachers[index];
            active_teachers[(teachersData[0].idArea) - 1].teachers = active_teachers[(teachersData[0].idArea) - 1].teachers.filter ((data) => {
                return data != null;
            });
            console.log ("Active teachers of the same subject: ", active_teachers[(teachersData[0].idArea) - 1].teachers);
            resolve (true);
        });
    });
};

const addAttendanceToQueue = (id, nome, area, subarea, duvida, email) => {
    if (active_teachers[area - 1].teachers.length > 0) {
        attendance_queue[(area) - 1].attendances.push ({ id: id, aluno: nome, status: "ESPERA", subarea: subarea, duvida: duvida, email: email });
        console.log ("Queued attendances of the subject: ", attendance_queue[(area) - 1].attendances);
        return true;
    }
    return false;
};

const getNextAttendance = async (id) => {
    return new Promise ((resolve, reject) => {
        let usuario = new Usuario ();

        usuario.getHabilitacao (id).then ((result) => {
            resolve (attendance_queue[(result[0].idArea) - 1].attendances[0]);
        });
    });
};

const blockTeacher = (id) => {
    let usuario = new Usuario ();
    usuario.getHabilitacao (id).then ((result) => {
        let index = active_teachers[(result[0].idArea) - 1].teachers.findIndex ((teachersData) => {
            return teachersData.token.id === id;
        });
        active_teachers[(result[0].idArea) - 1].teachers[index].state = 'ATENDENDO';
    });
};

const removeAttendance = (id, port) => {
    let usuario = new Usuario ();

    usuario.getHabilitacao (id).then ((result) => {
        attendanceSub.notify ({ idAluno: attendance_queue[(result[0].idArea) - 1].attendances[0].id, port: port, teachersEmail: result[0].email, teacher: result[0].nome });
        let currentAttendance = attendance_queue[(result[0].idArea) - 1];
        let attendance = new Attendance ();
        attendance.registerData (currentAttendance, id);
        attendance_queue[(result[0].idArea) - 1].attendances.shift ();
        console.log ("Attendance's queue: " + attendance_queue[(result[0].idArea) - 1].attendances);
    });
};

module.exports = {
    enableTeacher,
    disableTeacher,
    addAttendanceToQueue,
    getNextAttendance,
    blockTeacher,
    removeAttendance
};