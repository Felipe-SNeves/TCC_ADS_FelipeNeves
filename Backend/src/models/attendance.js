const attendanceDAO = require ('../DAO/attendance');

class Attendance {

    async registerData (attendanceData, idTeacher) {
        return attendanceDAO.register (attendanceData.attendances[0].id, idTeacher, attendanceData.attendances[0].subarea, attendanceData.attendances[0].duvida);
    }
};

module.exports = Attendance;