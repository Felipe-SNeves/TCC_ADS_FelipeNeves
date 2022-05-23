const Ticket = require ('../models/ticket');

const getTicket = async (id) => {
    let ticket = new Ticket ();
    return ticket.getTicket (id);
}

const listar = async () => {
    let ticket = new Ticket ();
    return ticket.getTickets ();
}

const submit = async (data) => {
    let ticket = new Ticket ();
    return ticket.submit (data);
}

const close = async (id, message) => {
    let ticket = new Ticket ();
    return ticket.close (id, message);
}

const getClosed = async () => {
    let ticket = new Ticket ();
    return ticket.getClosed ();
}

module.exports = {
    getTicket,
    listar,
    submit,
    close,
    getClosed
}