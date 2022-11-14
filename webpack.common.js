const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    "leather-tag": "./src/leather-tag.js",
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