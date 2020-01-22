import rp from 'request-promise';

export const getInfo = (access_token) => {
    const options = {
        method: 'GET',
        uri: 'https://api.spotify.com/v1/me/player',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        json: true,
    };

    return rp(options);
};
export const getTrackInfo = (uri, access_token) => {
    const options = {
        method: 'GET',
        uri: `https://api.spotify.com/v1/tracks/${uri.match(/\w{22}$/)[0]}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        json: true,
    };

    return rp(options).then((track) => ({
        uri,
        artists: track.artists.map((artist) => artist.name),
        album: track.album.name,
        name: track.name,
        albumImg: track.album.images[1],
    }));
};

export const isPremium = (access_token) => {
    const options = {
        method: 'GET',
        uri: 'https://api.spotify.com/v1/me',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        json: true,
    };

    return rp(options).then((data) => data.product === 'premium');
};

export const getUserId = (access_token) => {
    const options = {
        method: 'GET',
        uri: 'https://api.spotify.com/v1/me',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        json: true,
    };

    return rp(options).then((data) => data.id);
};
