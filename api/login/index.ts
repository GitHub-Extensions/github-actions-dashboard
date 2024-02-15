import  {VercelRequest, VercelResponse} from '@vercel/node'
import * as formidable from 'formidable'
import {IncomingMessage} from 'http'
// @ts-ignore
import StatusCodes from 'http-status-codes'

if (!process.env.CLIENT_ID) {
    throw Error('CLIENT_ID is not set in environment')
}

const baseUrl = 'https://github.com'
const authorizePath = '/login/oauth/authorize'
const scope = 'user:email,actions:read'
const allowSignup = 'false'
const authorizationUrl = `${baseUrl}${authorizePath}?client_id=${process.env.CLIENT_ID}&scope=${scope}&allow_signup=${allowSignup}`


export default async (request: VercelRequest, response: VercelResponse) => {
    switch (request.method) {
        case 'POST':
            return await handlePost(request, response);
        default:
            return response.status(StatusCodes.METHOD_NOT_ALLOWED)
                .send({error: 'Method not allowed'});
    }
};

async function handlePost(request: VercelRequest, response: VercelResponse) {
    return response.status(StatusCodes.TEMPORARY_REDIRECT)
        .setHeader('Location', authorizationUrl)
}

async function parseFormData(request: IncomingMessage, options: formidable.Options) {
    return await new Promise((resolve, reject) => {
        formidable.formidable(options).parse(request, (err: any, fields: formidable.Fields, files: formidable.Files) => {
            if (err) reject(err); else resolve({fields, files});
        });
    }) as { fields: formidable.Fields, files: formidable.Files };
}
