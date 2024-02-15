import https from "https"
// @ts-ignore
import StatusCodes from 'http-status-codes'
import {URL} from "url"
import {VercelRequest, VercelResponse} from '@vercel/node'

if (!process.env.CLIENT_ID) {
    throw Error('CLIENT_ID is not set in environment')
}
if (!process.env.CLIENT_SECRET) {
    throw Error('CLIENT_SECRET is not set in environment')
}

const oauthCallbackUrl = 'https://github-dashboards.vercel.app/login'

export default async (request: VercelRequest, response: VercelResponse) => {
    switch (request.method) {
        case 'GET':
            return await handleGet(request, response);
        default:
            return response.status(StatusCodes.METHOD_NOT_ALLOWED)
                .send({error: 'Method not allowed'});
    }
};

async function handleGet(request: VercelRequest, response: VercelResponse) {

    const code = Array.isArray(request.query.code) ? request.query.code[0] : request.query.code

    if (!code) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: `did not get expected query string named [code]`,
        });
    }

    let tokenResponse
    try {
        tokenResponse = await exchangeCodeForToken(code)
    } catch (e) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: `Failed to exchange code for access_token`,
        });
    }

    if (!tokenResponse || !tokenResponse.access_token) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: `did not receive expected [access_token]`,
        });
    }

    return response.status(StatusCodes.TEMPORARY_REDIRECT)
        .setHeader('Location', process.env.OAUTH_CALLBACK_URL + '?access_token=' + tokenResponse.access_token)
}

async function exchangeCodeForToken (code) {
    const api = new URL('https://github.com/login/oauth/access_token')
    api.searchParams.set('client_id', process.env.CLIENT_ID)
    api.searchParams.set('client_secret', process.env.CLIENT_SECRET)
    api.searchParams.set('code', code)

    return asyncHttpsPostRequest(api)
}

async function asyncHttpsPostRequest (url) {
    return new Promise(function (resolve, reject) {
        https.request({
            method: 'POST',
            host: url.host,
            path: url.pathname + url.search,
            headers: {
                'Accept': 'application/json'
            }
        }, (resp) => {
            let data = ''
            resp.on('data', (chunk) => {
                data += chunk
            })
            resp.on('end', () => {
                try {
                    let parsed = JSON.parse(data)
                    resolve(parsed)
                } catch (e) {
                    reject(data)
                }
            })
        }).on('error', reject)
            .end()
    })
}
