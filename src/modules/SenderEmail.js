const SparkPost = require('sparkpost');
const keys = require('../config/keys.json');

const client = new SparkPost(keys.API_KEY_SPARKPOST);
const getTemplate = require('./templates/template_basic');

module.exports = async (params) =>{

    try
    {
    
        const template = getTemplate(params);

        const data = await client.transmissions.send({
            content: {
                from: 'contato@app.brunoiglesias.eng.br',
                subject: 'Mensagem de teste com template',
                html: template
            },
            recipients: [
                {address: params.email}
            ]
        });

        console.log(data);
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}