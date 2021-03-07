
const AWS = require('aws-sdk');
const { callbackify } = require('util');
require("dotenv").config();
var uuid = require('uuid');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

class s3upload {


    url = "";

    upload(buffer, base64 = false){

        return (async (buffer, base64) => {

            var docname = await uuid.v4();

            const params = {
              Bucket: 'documentos-alianca',
              Key: docname+'.pdf', 
              Body: buffer,
              ContentType: 'application/pdf',
              ContentDisposition:"inline"
            };

            // if(base64) {
            //     params.ContentEncoding = 'base64'
            // }
            
            await s3.upload(params).promise(); 
    
            return await s3.getSignedUrl('getObject', {
                Bucket: 'documentos-alianca',
                Key: docname+'.pdf'
                });
            
        })(buffer, base64);

        

    }

}

module.exports = s3upload;