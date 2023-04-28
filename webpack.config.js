const path = require('path');

module.exports = {
    entry: './src/Pocketrose.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
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
    performance: {
        hints: false,
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};
