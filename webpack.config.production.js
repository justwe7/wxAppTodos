const config = require("./webpack.config");
const merge = require("webpack-merge");

module.exports = merge(config, {
  mode: 'production'
});
