const Selo = require ('../models/selo');

const getSelo = async (idSelo) => {
    let selo = new Selo ();
    return selo.getInfo (idSelo);
};

const list = async (idArea) => {
    let selo = new Selo ();
    return selo.list (idArea);
}

const adicionar = async (data) => {
    let selo = new Selo ();
    return selo.adicionar (data.titulo, data.idArea, data.descricao, data.meta);
}

const excluir = async (id) => {
    let selo = new Selo ();
    return selo.excluir (id);
}

const editar = async (dados) => {
    let selo = new Selo ();
    return selo.editar (dados);
}

const getObtained = async (idTeacher) => {
    let selo = new Selo ();
    return selo.obtained (idTeacher);
}

module.exports = {
    getSelo,
    list,
    adicionar,
    excluir,
    editar,
    getObtained
}