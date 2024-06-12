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

           // console.log(body);

            if(body['parcels'].length == 1 && body['parcels'][0].id_asaas != null){
               return 'https://www.asaas.com/b/pdf/'+body['parcels'][0].id_asaas.substring(4)
            } else {
                let carne = new GeradorDeBoletos(body);

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
    
                        console.log(error);
    
                    }
                );
    
                return this.url;
            }

            

        })(body, res);

    }


}

module.exports = gerareport;