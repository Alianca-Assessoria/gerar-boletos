const fs = require('fs');
const validajson = require('./validajson');
const s3upload = require('./s3upload');
const { Boletos } = require('../lib/index');
const GeradorDeBoletos = require('../lib/boleto/gerador-de-boleto');


class gerareport {

    url = "";

    constructor(body, res){
        return (async (body, res) => {
            body = new validajson(body);

            // const novoBoleto = new Boletos(boleto);
            // novoBoleto.gerarBoleto();

            let carne = new GeradorDeBoletos(body);

            //console.log (carne);


            // if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            // const stream = fs.createWriteStream(`${dir}/${filename}.pdf`);


            await carne.gerarCarne({
            creditos: '',
            base64: true,
            }).then(
                async function (result) {

                    let data = new Buffer.from(result, 'base64');

                    let upload = new s3upload();
                    this.url =  await upload.upload(data) ;
                    
                    
                    res.send({url: this.url});
                }.bind(this),
                function (error) {

                }
            );

            return this.url;

        })(body, res);

    }


}

module.exports = gerareport;