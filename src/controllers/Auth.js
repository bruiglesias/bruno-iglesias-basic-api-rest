const connection = require('../database');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys.json');
const senderEmail = require('../modules/SenderEmail');
const senderSMS = require('../modules/SenderSMS');

User.init(connection);

function generateToken(params = {})
{
    return jwt.sign(params, keys.SECRET_APP, { expiresIn: 86400});
}

module.exports = {

    async register(request, response){

        const { name, email, password } = request.body;
        try
        {
            user_verify = await User.findOne({
                where:{
                    email,
                }
            });

            if(user_verify)
            {
                return response.json({
                    user: null,
                    error: "O email já está cadastrado no banco de dados.",
                });
            }

            user = await User.create({
                name,
                email,
                password,
            });
            
            user.password = null;

            return response.json({
                user,
                token: generateToken({ id: user.id}),
                error: null,
            });
        }
        catch(e)
        {
            return response.json({
                user: null,
                error: "Falha na conexão com banco de dados.",
            });
        }   
    },

    async authenticate(request, response){
        const { email, password } = request.body;

        try
        {
            user = await User.findOne({
                where:{
                    email,
                }
            });
    
            if(!user)
            {
                return response.json({
                    user: null,
                    error: "E-mail não cadastrado.",
                });
            }
    
            if(!await bcrypt.compare(password, user.password))
            {
                return response.json({
                    user: null,
                    error: "Senha inválida.",
                });
            }
            
            user.password = null;

            const token = generateToken({ id: user.id});

            return response.json({
                user,
                error: null,
                token,
            });
        }
        catch(e)
        {
            console.log(e);
            return response.json({
                user: null,
                error: "Falha na conexão com banco de dados.",
            });
        }
    },

    async project(request, response){
        return response.json({
            msg: "ok",
            user: request.user_id_request,
        });
    },

    async forgot_use_email(request, response){

        const { email } = request.body;

        try
        {
            user = await User.findOne({
                where:{
                    email,
                }
            });
    
            if(!user)
            {
                return response.json({
                    error: "E-mail não cadastrado.",
                });
            }

            const token = Math.floor(Math.random()*90000) + 10000;

            const now = new Date();
            now.setHours(now.getHours() + 1);

            user.passwordResetToken = token;
            user.passwordResetExpires = now;
            await user.save();


            params = {
                email: user.email,
                msg: `Utilize esse Token para recuperar o seu cadastro na API: ${token}`
            }

            const resposta = senderEmail(params);

            if(resposta)
            {
                return response.json({
                    msg: "Email enviado com sucesso!",
                    user,
                    error: null,
                });
            }

            return response.json({
                error: "Falha ao enviar email!",
            });
        }
        catch(e)
        {
            console.log(e);
            return response.json({
                error: "Falha ao tentar recuperar dados.",
            });
        }
    },

    async forgot_use_sms(request, response){

        const { email } = request.body;

        try
        {
            user = await User.findOne({
                where:{
                    email,
                }
            });
    
            if(!user)
            {
                return response.json({
                    error: "E-mail não cadastrado.",
                });
            }

            const token = Math.floor(Math.random()*90000) + 10000;

            const now = new Date();
            now.setHours(now.getHours() + 1);

            user.passwordResetToken = token;
            user.passwordResetExpires = now;
            await user.save();


            params = {
                number: request.number,
                msg: `Utilize esse Token para recuperar o seu cadastro na API: ${token}`
            }

            const resposta = senderSMS(params);

            if(resposta)
            {
                return response.json({
                    msg: "SMS enviado com sucesso!",
                    user,
                    error: null,
                });
            }

            return response.json({
                error: "Falha ao enviar SMS!",
            });
        }
        catch(e)
        {
            console.log(e);
            return response.json({
                error: "Falha ao tentar recuperar dados.",
            });
        }
    },

    async reset_password(request, response)
    {
        const { email, token, password } = request.body;

        try{
            user = await User.findOne({
                where:{
                    email,
                }
            });
    
            if(!user)
            {
                return response.json({
                    error: "E-mail não cadastrado!",
                });
            }

            if(user.passwordResetToken != token)
            {
                return response.json({
                    error: "Token inválido!",
                });
            }

            const now = new Date();

            if(now > user.passwordResetExpires)
            {
                return response.json({
                    error: "Token expirado!",
                });
            }

            user.password = password;
            await user.save();

            return response.json({
                msg: "Senha alterada com sucesso!",
                error: null,
            });
        }
        catch(e)
        {
            console.log(e);
            return response.json({
                error: "Falha ao tentar recuperar dados.",
            });
        }

    },
}