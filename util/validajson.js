const { Bancos, Boletos } = require('../lib/index');
const moment = require('moment');

class validajson {

    constructor(json){
        if( typeof json['cpf'] == 'undefined' || 
            typeof json['parcels'] == 'undefined')
            throw {erro: 'JSON Encaminhado é Inválido'} ;

        return this.formataJson(json);
    }


    formataJson(json){


        let sicoob = {
            nome: 'ALIANCA QUITACAO E NEGOCIACAO DE DIVIDAS LTDA',
            cnpj:'38538685000105',
            dadosBancarios: {
              carteira: '1',
              agencia: '4367',
              agenciaDigito: '8',
              conta: '48855',
              contaDigito: '0',
            //   nossoNumero: '21',
            //   nossoNumeroDigito: '2'
            },
            endereco: {
                logradouro: 'Rua Pedro Lessa, 15',
                bairro: 'Centro',
                cidade: 'Rio de Janeiro',
                estadoUF: 'RJ',
                cep: '20030-030'
            }
        };

        let bb = {
            nome: 'ALIANCA QUITACAO E NEGOCIACAO DE DIVIDAS LTDA',
            cnpj:'38538685000105',
            dadosBancarios: {
                carteira: '17',
                agencia: '01235',
                agenciaDigito: '1',
                conta: '0076428',
                contaDigito: '0',
                // nossoNumero: '00000000061',
                // nossoNumeroDigito: '8'
            },
            endereco: {
                logradouro: 'Rua Pedro Lessa, 15',
                bairro: 'Centro',
                cidade: 'Rio de Janeiro',
                estadoUF: 'RJ',
                cep: '20030-030'
            }
        };

        let boletos = [];

        let totalparcelas = json.parcels.length;
        let parcela = 1;

        json.parcels.forEach(parcel => {

            let boleto = {
                banco: parcel.tipo === 'service' ? new Bancos.BancoBrasil() : new Bancos.Sicoob(),
                pagador: {
                    nome: json.cpf,
                    registroNacional: json.cpf,
                    endereco: {
                    logradouro: 'Rua Pedro Lessa, 15',
                    bairro: 'Centro',
                    cidade: 'Rio de Janeiro',
                    estadoUF: 'RJ',
                    cep: '20030-030'
                    }
                },
                instrucoes: ['Parcela '+parcela+'/'+totalparcelas],
                beneficiario: parcel.tipo === 'service' ? bb : sicoob ,
                boleto: {
                    numeroDocumento: parcel.id,
                    especieDocumento: 'DM',
                    valor: parcel.valor,
                    datas: {
                        vencimento: moment(parcel.data_vencimento, 'DD/MM/YYYY').format('DD-MM-YYYY'),
                        processamento: moment().format('DD-MM-YYYY'),
                        documentos: moment().format('DD-MM-YYYY')
                    }
                }
            };


            if(parcel.tipo === 'service'){
                boleto.beneficiario.dadosBancarios.nossoNumero = ('00000000000' + parcel.id).slice(-11);
                //boleto.beneficiario.dadosBancarios.nossoNumeroDigito = '0';
            } else {
                boleto.beneficiario.dadosBancarios.nossoNumero = parcel.id;
                boleto.beneficiario.dadosBancarios.nossoNumeroDigito = '0';
            }
            

            let boletoObj =  new Boletos(boleto);

            boletoObj.gerarBoleto();

            boletos.push(boletoObj.boletoInfo);

            parcela++;

        });

        return boletos;
    }

}

module.exports = validajson;