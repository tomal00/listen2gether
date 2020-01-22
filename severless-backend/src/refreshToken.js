import { clientID, clientSecret, region } from './config';
import AWS from 'aws-sdk';
import rp from 'request-promise';
import '@babel/polyfill';

AWS.config.update({ region });

exports.handler = async (event) => {
    const dynamo = new AWS.DynamoDB();
    const refresh_token = await new Promise((resolve, reject) => dynamo.getItem(
        {
            TableName: 'states',
            Key: {
                stateCode: {
                    S: event.state,
                },
            },
        },
        (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        }
    ))
        .then((data) => data.Item.refresh_token.S)
        .catch(() => false);

    if (!refresh_token) {
        return { statusCode: 401, body: 'INVALID state' };
    }

    const options = {
        method: 'POST',
        uri: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${new Buffer(clientID + ':' + clientSecret).toString('base64')}`,
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        json: true,
    };

    const access_token = await rp(options)
        .then((data) => (data.access_token))
        .catch((err) => (err));

    const out = await new Promise((resolve, reject) => dynamo.updateItem(
        {
            TableName: 'states',
            Key: {
                stateCode: {
                    S: event.state,
                },
            },
            UpdateExpression: 'set access_token = :at',
            ExpressionAttributeValues: {
                ':at': { S: access_token },
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
        .then(() => ({ statusCode: 200, body: 'SUCCESS' }))
        .catch((err) => ({ statusCode: 500, body: JSON.stringify(err) }));

    return out;
};
