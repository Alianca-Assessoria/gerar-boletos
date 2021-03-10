const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const expressAccessToken = require('express-access-token');
const geraboleto = require('./util/geraboleto');
const { generateRemessaCnab } = require('@banco-br/nodejs-cnab');
const moment = require('moment');
const fs = require('fs');

app.use(express.json());
app.use(cookieParser());

/** Tokens de Acesso */
const accessTokens = [
  '6d7f3f6e-269c-4e1b-abf8-9a0add479511',
  '110546ae-627f-48d4-9cf8-fd8850e0ac7f',
  '04b90260-3cb3-4553-a1c1-ecca1f83a381'
];

/** Verifica Permissão */
const firewall = (req, res, next) => {
  const authorized = accessTokens.includes(req.accessToken);
  if(!authorized) return res.status(403).send('Forbidden');
  next();
};

app.post('/generate', 
    expressAccessToken, 
    firewall,
    async (req, res) => {
        try {

          let url = await new geraboleto(req.body, res) ;

          console.log(url);
  
        } catch(err) {

        console.log(err);
        res.sendStatus = 500;
        res.send(err);
        }

    });

  app.post('/remessa', 
    expressAccessToken, 
    firewall,
    async (req, res) => {
        try {

          let dados = req.body;

          let fileLayout = {
            header_arquivo: {
              tipo_registro: '0',
              tipo_operacao: '1',
              literal_remessa: 'REMESSA',
              codigo_servico: '1',
              literal_servico: 'COBRANCA',
              codigo_cedente: '3362315',
              razao_social: 'ALIANCA QUITACAO E NEGOCIACAO DE DIVIDAS LTDA',
              codigo_banco: '001',
              nome_banco: 'Banco do Brasil',
              data_geracao: '',
              brancos01: '',
              numero_aviso_bancario: 'MX',
              sequencial_remessa: '1',
              brancos02: '',
              numero_sequencial: '1'
            },
            detalhe: []
          };


          let count = 1;
          dados.parcels.forEach(parcel => {


            fileLayout.detalhe.push({
              tipo_registro: '1',
              dados_conta_pagador: '0000000000000000000',
              zeros01: '0',
              numero_carteira: '17',
              agencia: '1235',
              conta: '76428',
              conta_dv: '0',
              uso_empresa: 'ALIANCA QUITACAO E NEGOCIACAO DE DIVIDAS LTDA',
              zeros02: '000',
              multa: '0',
              valor_multa: '0000',
              nosso_numero: ('0000000000'+parcel.id).slice(-11),
              digito_nosso_numero: '0',
              condicao_emissao: '2',
              emissao_para_debito: 'N',
              brancos01: '           ',
              zeros03: '0',
              brancos02: '  ',
              codigo_ocorrencia: '01',
              numero_documento: ('000'+parcel.id).slice(-4),
              vencimento: moment(parcel.data_vencimento, 'DD/MM/YYYY').format('DDMMYYYY'),
              valor_titulo: parcel.valor,
              codigo_banco: '001',
              agencia_cobradora: '00000',
              especie: '01',
              aceite: 'N',
              data_emissao: moment().format('DDMMYYYY'),
              instrucao1: '  ',
              instrucao2: '  ',
              juros_um_dia: '0000000000000',
              desconto_ate: '000000',
              valor_desconto: '0000000000000',
              valor_iof: '0000000000000',
              abatimento: '0000000000000',
              sacado_numero_inscricao: dados.cpf,
              nome: dados.nome,
              logradouro: dados.endereco.logradouro,
              brancos03: '            ',
              cep: dados.endereco.cep,
              sacador: '                                                            ',
              numero_sequencial: '00000'+count
            });
            count++;

            
          });
          const bankCode = '001';
          const cnabCode = 400;
          const finalresult = generateRemessaCnab(fileLayout, cnabCode, bankCode);


          fs.writeFile('tmp/remessa-homolog.rem', finalresult, function (err) {
            if (err) return console.log(err);
            console.log('Salvando Arquivo de Remessa');
          });
  
        } catch(err) {
          console.log(err);
          res.sendStatus = 500;
          res.send(err);
        }

    });

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Gerador de Documentos aberto na PORTA: ${PORT}`));