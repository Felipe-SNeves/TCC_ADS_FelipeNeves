const jwt = require ('jsonwebtoken');

function verifyToken (token) {
    try {
        let decodedToken = jwt.verify (token, process.env.HASH_SECRET);
        return decodedToken;
    }
    catch (error) {
        console.log ("Invalid token received: ", error);
        return false;
    }
}

module.exports = {
    verifyToken
}