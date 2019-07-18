const config = require("./webpack.config");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(config, {
  mode: "production",
  plugins: [new CleanWebpackPlugin()]
});
