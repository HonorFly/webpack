const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动写入将引用写入html
module.exports = {
    entry: {
        main: path.resolve(__dirname, "./src/index.js"),
        vendors: ["react", "react-dom"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle-[hash:5].js'
    },
    mode: "development",
    devtool: "source-map",
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        //注意一下, extensions 第一个是空字符串! 对应不需要后缀的情况.
        extensions: ['', '.js', '.json', '.scss', 'jsx'],
    },

    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendors: {
                    name: 'vendors',
                    test: /node_modules\/(.*)\.js/,
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|css|sass)$/,
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    devServer: {
        contentBase: "/dist",
        inline: true,
        port: "8080"
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: { loader: "babel-loader?cacheDirectory=true" },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            }, {
                test: /\.sc|ass$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader?importLoaders=2', 'postcss-loader', 'sass-loader'] //css-loader?importLoaders=1，限制css-loader后面用一个loader，sass-loader没用
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, //表示小于10kb的图片转为base64,大于10kb的是路径
                    outputPath: "images/", //定义输出的图片文件夹
                    publicPath: '../'//解决css背景图的路径问题
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ //这个插件的作用是依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html。这在每次生成的js文件名称不同时非常有用（比如添加了hash值）
            filename: 'index.html', //定义生成的页面的名称
            template: __dirname + "/src/index.html", //new 一个这个插件的实例，并传入相关的参数
            title: "这里是设置HTML title"
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css'
        })
    ]
}