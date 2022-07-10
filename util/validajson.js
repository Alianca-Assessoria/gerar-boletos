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


        let bbold = {
            nome: 'ALIANCA ASSESSORIA DE CREDITO LTDA',
            cnpj:'25276719000180',
            dadosBancarios: {
                carteira: '17',
                agencia: '2895',
                agenciaDigito: '19',
                conta: '400723',
                contaDigito: '9'
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
            //if(parcel.tipo === 'service'){
            let boleto = {
                // Aqui vai a validação do tipo de boleto que será gerado
                // banco: parcel.tipo === 'service' ? new Bancos.BancoBrasil() : new Bancos.BancoBrasil(),
                banco: new Bancos.BancoBrasil(),
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
                instrucoes: ['Parcela '+parcel.numeroparcela+' relacionada à '+(parcel.tipo == 'service'? 'Prestação de Serviços' : (parcel.tipo == 'reduction' ? 'Parcelas Reduzidas': 'Confissão de Dividas')), parcel.observacoes ? parcel.observacoes : ''],
                // Aqui vai a validação do tipo de boleto que será gerado
                //beneficiario: parcel.tipo === 'service' ? bb : bb ,
                beneficiario: (parcel.importado == 1 || parcel.parcel_nova_conta) ? bbold : bb,
                boleto: {
                    numeroDocumento: parcel.contract,
                    especieDocumento: 'DM',
                    valor: parcel.valor,
                    datas: {
                        vencimento: moment(parcel.data_vencimento, 'DD/MM/YYYY').tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                        processamento: parcel.importado == 1 ? moment(parcel.dataprocessamento).tz('America/Sao_Paulo').format('YYYY-MM-DD') : moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                        documentos: parcel.importado == 1 ? moment(parcel.dataprocessamento).tz('America/Sao_Paulo').format('YYYY-MM-DD') : moment().tz('America/Sao_Paulo').format('YYYY-MM-DD')
                    },
                    locaisDePagamento: [
                        'Pagável em qualquer banco'
                    ]
                }
            };


           // if(parcel.tipo === 'service'){

            if(parcel.importado == 1){
                boleto.beneficiario.dadosBancarios.nossoNumero = '2966443'+parcel.banknumber;
            } else if(parcel.parcel_nova_conta == true) {
                boleto.beneficiario.dadosBancarios.nossoNumero = '2966443'+((''+parcel.id).padEnd(10, '0'));
            } else {
                boleto.beneficiario.dadosBancarios.nossoNumero = '3362315'+((''+parcel.id).padEnd(10, '0'));
            }
            
                //boleto.beneficiario.dadosBancarios.nossoNumeroDigito = '0';
            // } else {
            //     boleto.beneficiario.dadosBancarios.nossoNumero = parcel.id;
            //     boleto.beneficiario.dadosBancarios.nossoNumeroDigito = '0';
            // }

            //console.log(parcela);
            

            let boletoObj =  new Boletos(boleto);

            boletoObj.gerarBoleto();

            boletos.push(boletoObj.boletoInfo);

            parcela++;
       // }

        });

        return boletos;
    }

}

module.exports = validajson;