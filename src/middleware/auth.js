const jwt = require('jsonwebtoken');
const keys = require('../config/keys.json');

module.exports = (request, response, next) => {

    const auth_header = request.headers.authorization;
    
    if(!auth_header)
    {
        return response.json({
            error: "O token de autorização não foi informado."
        });
    }

    const parts = auth_header.split(' ');
    
    if(parts.length != 2)
    {
        return response.json({
            error: "Formato de Token de autorização inválido."
        });
    }

    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
    {
        return response.json({
            error: "Formato de Bearer no token de autorização inválido."
        });
    }

    jwt.verify(token, keys.SECRET_APP, (error, decoded) => {
        if(error)
        {
            return response.json({
                error: "Token Inválido."
            });
        }

        request.user_id_request = decoded.id;

        return next();
    });
}