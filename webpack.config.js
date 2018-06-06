const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        port: 3000,
        proxy: {
            '/': 'http://localhost:5000'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        'env',
                        'react'
                    ],
                    plugins: [
                        "transform-object-rest-spread",
                        [
                            "import", 
                            { 
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": true
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html')
        })
    ],
    externals: {
        
    }
}