const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const expressAccessToken = require('express-access-token');
const geraboleto = require('./util/geraboleto');

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

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Gerador de Documentos aberto na PORTA: ${PORT}`));