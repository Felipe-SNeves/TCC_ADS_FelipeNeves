const express = require ('express');
const path = require ('path');
const app = express ();
const bodyParser = require ('body-parser');

const usuarioRoutes = require ('./routes/usuario');
const attendanceRoutes = require ('./routes/attendance');
const seloRoutes = require ('./routes/selo');
const ticketRoutes = require ('./routes/ticket');

app.use (bodyParser.json ());
app.use ((req, res, next) => {
    res.setHeader ("Access-Control-Allow-Origin", "*");
    res.setHeader ("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.setHeader ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader ("Content-Type", 'application/json');
    next ();
});

let dirPhotos = path.join (__dirname, '../photos');
app.use (express.static (dirPhotos));

let dirCurriculum = path.join (__dirname, '../curriculum');
app.use (express.static (dirCurriculum));

app.get ("/curriculum/:filename", (req, res, next) => {
    res.download (dirCurriculum + "/" + req.params.filename);
});

console.log ("Opening routes");

app.use ('/account', usuarioRoutes);
console.log ("User's routes opened!");

app.use ('/attendance', attendanceRoutes);
console.log ("Attendance's routes opened!");

app.use ('/selo', seloRoutes);
console.log ("Selo's routes opened!");

app.use ('/ticket', ticketRoutes);
console.log ("Tickets's routes opened!");

module.exports = app;
