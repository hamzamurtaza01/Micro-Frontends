const HtmlWebPackPlugin = require("html-webpack-plugin")
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")

const deps = require("./package.json").dependencies
module.exports = (_, argv) => ({
    output: {
        publicPath: "http://localhost:4000/"
    },

    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"]
    },

    devServer: {
        port: 4000,
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.m?js/,
                type: "javascript/auto",
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: ["style-loader", "css-loader", "postcss-loader"]
            },
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "home",
            filename: "remoteEntry.js",
            remotes: {},
            exposes: {
                "./Header": "./src/Header.jsx",
                "./Footer": "./src/Footer.jsx",
                "./products": "./src/products.js"
            },
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"]
                }
            }
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html"
        })
    ]
})
