const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const config = {
    mode: 'development',
    entry: {
        app: [
            'react-hot-loader/patch',
        ],
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'assets'),
        hot: true,
        historyApiFallback: true,
    },
};

module.exports = merge(common, config);
