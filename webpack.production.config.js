const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 自动写入将引用写入html
module.exports = {
    entry: {
        main: path.resolve(__dirname, "./src/index.js"),
        vendor: ["react", "react-dom"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle-[hash:5].js"
    },
    mode: "production",
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require("cssnano"),
                cssProcessorOptions: {
                    discardComments: { removeAll: true },
                    // 避免 cssnano 重新计算 z-index
                    safe: true
                },
                canPrint: true
            }) // use OptimizeCSSAssetsPlugin
        ],
        // minimizer: true, // [new UglifyJsPlugin({...})]
        splitChunks: {
            chunks: "async",
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
                vendor: {
                    name: "vendor",
                    chunks: "initial",
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/
                },
                styles: {
                    name: "styles",
                    test: /\.(scss|css)$/,
                    chunks: "all",
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: { loader: "babel-loader?cacheDirectory=true" },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
            },
            {
                test: /\.sc|ass$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader?importLoaders=2",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 10000, //表示小于10kb的图片转为base64,大于10kb的是路径
                    outputPath: "images/", //定义输出的图片文件夹
                    publicPath: "../images/" //解决css背景图的路径问题
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            //这个插件的作用是依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html。这在每次生成的js文件名称不同时非常有用（比如添加了hash值）
            filename: "index.html", //定义生成的页面的名称
            template: __dirname + "/src/index.html", //new 一个这个插件的实例，并传入相关的参数
            title: "这里是设置HTML title",
            minify: {
                collapseWhitespace: true //压缩html空白代码
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/index.[name].[hash:5].css",
            chunkFilename: "css/index.[contenthash:5].css"
        })
    ]
};