const express = require('express');
const Auth = require('./controllers/Auth');
const auth = require('./middleware/auth');

const routes = express.Router();

routes.get('/', (request, response) => {
    return response.json({msg: "BASIC API REST NODE JS - Software Engineer: Bruno Iglesias"});
});

// Rotas Publicas para AUTH
routes.post('/register', Auth.register);
routes.post('/authenticate', Auth.authenticate);
routes.post('/forgot-password-use-email', Auth.forgot_use_email);
routes.post('/forgot-password-use-sms', Auth.forgot_use_sms);
routes.post('/reset-password', Auth.reset_password);

// Rotas para usuários autenticados
routes.get('/project', auth, Auth.project);


module.exports = routes;