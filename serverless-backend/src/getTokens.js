import rp from 'request-promise';
import AWS from 'aws-sdk';
import { clientID, clientSecret, redirectUri, region } from './config';
import '@babel/polyfill';

AWS.config.update({ region });

exports.handler = async (event) => {
    const dynamo = new AWS.DynamoDB();
    const proceed = await new Promise((resolve, reject) => dynamo.getItem(
        {
            TableName: 'states',
            Key: {
                stateCode: {
                    S: event.queryStringParameters.state,
                },
            },
        },
        (err, data) => {
            if (err || data.Item.stateCode.S !== event.queryStringParameters.state || data.Item.used) {
                reject(err);
            }
            else {
                resolve();
            }
        }
    ))
        .then(() => true)
        .catch(() => false);

    if (!proceed) {
        return { statusCode: 500 };
    }
    const options = {
        method: 'POST',
        uri: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${new Buffer(`${clientID}:${clientSecret}`).toString('base64')}`,
        },
        form: {
            grant_type: 'authorization_code',
            code: event.queryStringParameters.code,
            redirect_uri: redirectUri,
        },
        json: true,
    };

    return rp(options)
        .then((data) => new Promise((resolve, reject) => dynamo.updateItem(
            {
                TableName: 'states',
                Key: {
                    stateCode: {
                        S: event.queryStringParameters.state,
                    },
                },
                UpdateExpression: 'set access_token = :at, refresh_token=:rt, used = :s',
                ExpressionAttributeValues: {
                    ':at': { S: data.access_token },
                    ':rt': { S: data.refresh_token },
                    ':s': { BOOL: true },
                },
            },
            (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            }
        ))
            .then(() => ({
                statusCode: 303,
                headers: {
                    location: `https://listen2gether.net?state=${event.queryStringParameters.state}`,
                },
            }))
            .catch((err) => ({ statusCode: 500, body: JSON.stringify(err) })))
        .catch((err) => ({
            statusCode: 500,
            body: JSON.stringify(err),
        }));
};
