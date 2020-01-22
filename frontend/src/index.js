import { render } from 'react-dom';
import React from 'react';
import App from './components/App';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import cfg from './cfg';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import MobileDetect from 'mobile-detect';

window.onSpotifyWebPlaybackSDKReady = () => {

    const md = new MobileDetect(window.navigator.userAgent);

    if (md.phone()) {
        render(
            'Unfortunately this web application is not supported by mobile browsers at the moment, please try it out on another device.'
            , document.getElementById('root')
        );

        return;
    }

    const socket = io(`https://${cfg.endpoint}:${cfg.port}`, { secure: true, query: `state=${(new URL(document.location)).searchParams.get('state')}` });

    socket.on('connect_error', () => {
        if (!socket.connected) {
            render(
                'Unable to establish connection with the server.'
                , document.getElementById('root')
            );
        }
    });

    socket.on('connect', () => {
        const sagaMiddleware = createSagaMiddleware();
        const store = createStore(reducer, applyMiddleware(sagaMiddleware));

        sagaMiddleware.run(rootSaga, socket);

        const theme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    dark: '#1db954',
                    main: '#1db954',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#4dabf5',
                    contrastText: '#ffffff',
                },
                background: {
                    secondary: '#333333',
                },
            },
        });

        render(
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <App />
                </MuiThemeProvider>
            </Provider>
            , document.getElementById('root')
        );
    });
};

