const { Bancos, Boletos } = require('../lib/index');
const moment = require('moment-timezone');

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
              contaDigito: '0'
            },
            endereco: {
                logradouro: 'QUADRA QNA 6 LOTE, 23, Sala 301',
                bairro: 'Taguatinga Norte',
                cidade: 'Brasília',
                estadoUF: 'DF',
                cep: '72110-060'
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
                contaDigito: '0'
            },
            endereco: {
                logradouro: 'QUADRA QNA 6 LOTE, 23, Sala 301',
                bairro: 'Taguatinga Norte',
                cidade: 'Brasília',
                estadoUF: 'DF',
                cep: '72110-060'
            }
        };

        let boletos = [];

        let totalparcelas = json.parcels.length;
        let parcela = 1;

        json.parcels.forEach(parcel => {

            let boleto = {
                // Aqui vai a validação do tipo de boleto que será gerado
                banco: parcel.tipo === 'service' ? new Bancos.BancoBrasil() : new Bancos.BancoBrasil(),
                pagador: {
                    nome: json.nome,
                    registroNacional: json.cpf,
                    endereco: {
                    logradouro: json.endereco.logradouro,
                    bairro: json.endereco.bairro,
                    cidade: json.endereco.cidade,
                    estadoUF: json.endereco.uf,
                    cep: json.endereco.cep
                    }
                },
                instrucoes: ['Parcela '+parcela+'/'+totalparcelas],
                // Aqui vai a validação do tipo de boleto que será gerado
                beneficiario: parcel.tipo === 'service' ? bb : bb ,
                boleto: {
                    numeroDocumento: parcel.id,
                    especieDocumento: 'DM',
                    valor: parcel.valor,
                    datas: {
                        vencimento: moment(parcel.data_vencimento, 'DD/MM/YYYY').tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                        processamento: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                        documentos: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD')
                    },
                    locaisDePagamento: [
                        'Pagável em qualquer banco'
                    ]
                }
            };


            if(parcel.tipo === 'service'){
                boleto.beneficiario.dadosBancarios.nossoNumero = '3362315'+(('0000000000' + parcel.id).slice(-10));
                //boleto.beneficiario.dadosBancarios.nossoNumeroDigito = '0';
            } else {
                boleto.beneficiario.dadosBancarios.nossoNumero = parcel.id;
                boleto.beneficiario.dadosBancarios.nossoNumeroDigito = '0';
            }

            console.log(parcela);
            

            let boletoObj =  new Boletos(boleto);

            boletoObj.gerarBoleto();

            boletos.push(boletoObj.boletoInfo);

            parcela++;

        });

        return boletos;
    }

}

module.exports = validajson;