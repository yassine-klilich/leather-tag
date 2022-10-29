const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    "yk-tags": "./src/yk-tags.js",
    script: "./src/script.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      }
    ]
  }
};