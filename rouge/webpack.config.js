const path = require('path');

module.exports = {
    mode: 'production', // 使用生产环境
    entry: 'C:/Users/15422/Desktop/git/rouge/rouge/assets/libs/signalr-protocol-msgpack.js', // 入口文件路径
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出文件目录
        filename: 'signalr-protocol-msgpack.bundle.js', // 输出文件名
        libraryTarget: 'module', // 输出为 ES 模块
    },
    experiments: {
        outputModule: true, // 保持输出为模块
    },
    resolve: {
        fallback: {
            "util": false,  // 忽略 polyfill
            "url": false,
            "https": false,
            "http": false,
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 匹配所有 .js 文件
                exclude: /node_modules/, // 排除 node_modules 目录
                use: {
                    loader: 'babel-loader', // 使用 babel-loader 处理
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                modules: false, // 保持 ES 模块
                                targets: {
                                    esmodules: true, // 确保编译为 ES6 及以上版本
                                },
                            }],
                        ],
                    },
                },
            },
        ],
    },
    optimization: {
        minimize: false, // 禁用文件压缩
    },
};
