import crypto from 'crypto';
import { clientID, redirectUri, scopesString, region } from './config';
import AWS from 'aws-sdk';
import '@babel/polyfill';

AWS.config.update({ region });

exports.handler = async () => {
    const hash = crypto.createHash('sha256');
    const dynamo = new AWS.DynamoDB();

    await hash.write(Math.random().toString());
    hash.end();
    const stateCode = hash.read().toString('hex');

    return new Promise((resolve, reject) => dynamo.putItem(
        {
            TableName: 'states',
            Item: {
                stateCode: {
                    S: stateCode,
                },
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
                location: `https://accounts.spotify.com/authorize/?client_id=${clientID}&response_type=code&redirect_uri=${redirectUri}&scope=${scopesString}&state=${stateCode}`,
            },
        }))
        .catch(() => ({ statusCode: 500 }));
};
