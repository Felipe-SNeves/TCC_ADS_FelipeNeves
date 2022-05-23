const ticketDAO = require ('../DAO/ticket');

class Ticket {
    async getTicket (id) {
        return ticketDAO.getTicket (id);
    }

    async getTickets () {
        return ticketDAO.getTickets ();
    }

    async getClosed () {
        return ticketDAO.getClosedTickets ();
    }

    async submit (data) {
        return ticketDAO.submit (data.usuarioReportado, data.titulo, data.descricao, data.data_submissao);
    }

    async close (id, message){
        return ticketDAO.close (id, message);
    }
};

module.exports = Ticket;