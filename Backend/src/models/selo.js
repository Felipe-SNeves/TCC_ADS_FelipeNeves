const seloDAO = require ('../DAO/selo');

class Selo {
    async getInfo (idSelo) {
        return seloDAO.getInfo (idSelo);
    }

    async list (idArea) {
        return seloDAO.listSelos (idArea);
    }

    async adicionar (titulo, idArea, descricao, meta) {
        return seloDAO.adicionarSelo (titulo, idArea, descricao, meta);
    }

    async excluir (id) {
        return seloDAO.excluir (id);
    }

    async editar (dados) {
        return seloDAO.editarSelo (dados);
    }

    async obtained (id) {
        return seloDAO.getObtained (id);
    }
}

module.exports = Selo;