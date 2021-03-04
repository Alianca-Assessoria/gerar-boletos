const fs = require('fs');
const { Bancos, Boletos, streamToPromise } = require('../lib/index');
const GeradorDeBoletos = require('../lib/boleto/gerador-de-boleto');

const boleto = {
  banco: new Bancos.BancoBrasil(),
  pagador: {
    nome: 'José Bonifácio de Andrada',
    registroNacional: '12345678',
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030'
    }
  },
  instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
  beneficiario: {
    nome: 'Empresa Fictícia LTDA',
    cnpj:'43576788000191',
    dadosBancarios: {
      carteira: '09',
      agencia: '18455',
      agenciaDigito: '4',
      conta: '1277165',
      contaDigito: '1',
      nossoNumero: '00000000061',
      nossoNumeroDigito: '8'
    },
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030'
    }
  },
  boleto: {
    numeroDocumento: '1001',
    especieDocumento: 'DM',
    valor: 110.00,
    datas: {
      vencimento: '02-04-2020',
      processamento: '02-04-2019',
      documentos: '02-04-2019'
    }
  }
};


const boleto2 = {
  banco: new Bancos.Sicoob(),
  pagador: {
    nome: 'José Bonifácio de Andrada',
    registroNacional: '12345678',
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030'
    }
  },
  instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
  beneficiario: {
    nome: 'ALIANCA QUITACAO E NEGOCIACAO DE DIVIDAS LTDA',
    cnpj:'38538685000105',
    dadosBancarios: {
      carteira: '1',
      agencia: '4367',
      agenciaDigito: '8',
      conta: '48855',
      contaDigito: '0',
      nossoNumero: '21',
      nossoNumeroDigito: '2'
    },
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030'
    }
  },
  boleto: {
    numeroDocumento: '1001',
    especieDocumento: 'DM',
    valor: 110.00,
    datas: {
      vencimento: '02-04-2021',
      processamento: '02-04-2019',
      documentos: '02-04-2019'
    }
  }
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();


const novoBoleto2 = new Boletos(boleto2);
novoBoleto2.gerarBoleto();

let carne = new GeradorDeBoletos([novoBoleto2.boletoInfo, novoBoleto2.boletoInfo, novoBoleto2.boletoInfo,novoBoleto2.boletoInfo,  novoBoleto.boletoInfo, novoBoleto.boletoInfo, novoBoleto2.boletoInfo,novoBoleto2.boletoInfo,  novoBoleto.boletoInfo, novoBoleto.boletoInfo]);



let dir = './tmp/boletos';
let filename='boleto';

if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const stream = fs.createWriteStream(`${dir}/${filename}.pdf`);

carne.gerarCarne({
  creditos: '',
  stream,
});

// novoBoleto.pdfFile()

//console.log(novoBoleto.boletoInfo.getLinhaDigitavelFormatado());


// novoBoleto.pdfFile().then(async ({ stream }) => {
//   // ctx.res.set('Content-type', 'application/pdf');	
//   await streamToPromise(stream);
// }).catch((error) => {
//   return error;
// });



