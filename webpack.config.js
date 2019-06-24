const path = require("path");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// 单独打包样式文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//删除多余js
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const CSS_PATH = {
  pattern: ["./src/pages/**/*.scss"],
  src: path.join(__dirname, "src")
};

// 遍历所有需要打包的SCSS/CSS文件路径
/* let getCSSEntries = (config) => {
	let fileList = glob.sync(config.pattern);
	return fileList.reduce((previous, current) => {
		let filePath = path.parse(path.relative(config.src, current));
		let withoutSuffix = path.join(filePath.dir, filePath.name);
		previous[withoutSuffix] = path.resolve(__dirname, current);
		return previous;
	}, {});
}; */

// console.log(getCSSEntries(CSS_PATH));

// getEntry()
// function getEntry (rootSrc) {
//   var map = {};
//   glob.sync('./src/pages/**/*.scss')
//   .forEach(file => {
//     console.log(file);
//     /* var key = relative(rootSrc, file).replace('.js', '');
//     map[key] = file; */
//   })
//    return map;
// }

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  mode: "production",
  entry: ["./src/pages/detail/detail.scss", "./src/pages/index/index.scss"],
  optimization: {
    splitChunks: {
      cacheGroups: {
        fooStyles: {
          name: 'detail',
          test: (m, c, entry = 'detail') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        barStyles: {
          name: 'index',
          test: (m, c, entry = 'index') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  output: {
    path: '/dist',
    filename: '[name].css'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 需要用到的 loader
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    // new MiniCssExtractPlugin({
    // 	filename: '/src/pages/**/[name].wxss'
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].wxss",
      chunkFilename: "[id].wxss"
    })
    // new CopyWebpackPlugin(
    //   [
    //     {
    //       from: "**/*",
    //       to: "",
    //       ignore: ['*.scss'],
    //       context: "src/"
    //     }
    //   ]
    // )
  ]
};
