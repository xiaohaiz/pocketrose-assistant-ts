const path = require('path');
const webpack = require('webpack');

const now = new Date();
const buildVersion = '3.4.8'
const buildDate = `${now.toLocaleString()}`;

// noinspection JSUnresolvedReference
module.exports = {
    entry: './src/Pocketrose.ts',
    output: {
        filename: 'pocketrose.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: "none",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            }
        ],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "// ==UserScript==\n" +
                "// @name         pocketrose assistant\n" +
                "// @namespace    https://pocketrose.itsns.net.cn/\n" +
                "// @description  Intercepts and modifies pocketrose CGI requests\n" +
                "// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\n" +
                "// @license      mit\n" +
                "// @author       xiaohaiz,fugue\n" +
                "// @version      " + buildVersion + "\n" +
                "// @grant        unsafeWindow\n" +
                "// @match        *://pocketrose.itsns.net.cn/*\n" +
                "// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js\n" +
                "// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js\n" +
                "// @require      https://cdn.bootcdn.net/ajax/libs/pako/2.1.0/pako.min.js\n" +
                "// @run-at       document-start\n" +
                "// @unwrap\n" +
                "// ==/UserScript==\n",
            raw: true
        }),
        new webpack.ProgressPlugin({
            profile: true,
        }),
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify('Pocketrose Assistant (' + buildVersion + ') Build: ' + buildDate)
        }),
    ],
    performance: {
        hints: false,
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: {
        lodash: '_',
        "pako": 'pako'
    }
};
