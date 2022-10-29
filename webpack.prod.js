const path = require('path');
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      cache: false,
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css"
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/i,
        minify: [
          CssMinimizerPlugin.cssnanoMinify,
        ]
      }),
      new TerserPlugin(),
    ],
  },
});