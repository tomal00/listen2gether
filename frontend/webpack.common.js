const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry: {
        main: [
            '@babel/polyfill',
            path.join(__dirname, 'src', 'index.js'),
        ],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: 'babel-loader',
        }, {
            test: /\.(gif|jpg|png|svg|ttf|eot|woff)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            }],
        }],
    },
    plugins: [
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /node_modules/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};

module.exports = config;
