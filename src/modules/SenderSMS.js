const http = require("http");
const keys = require('../config/keys.json');

module.exports = async (params) =>{

    const KEY = keys.API_KEY_SMSDEV;

    const message = "BASIC API REST - Digite seu token no app: " + String(params.token);
    const options = {
        "method": "GET",
        "hostname": "api.smsdev.com.br",
        "port": null,
        "path": "/v1/send?key="+KEY+"&type=9&number="+params.number+"&msg="+encodeURIComponent(message),
        "headers": {}
    };
    var retorno = "";

    const req = http.request(options, function(res){
        const chunks = [];
        res.on("data", function(chunk){
        chunks.push(chunk);
    });

    res.on("end", function(){
        const body = Buffer.concat(chunks);
        console.log(body.toString());
        });
    });

    req.end();
    return true;
}