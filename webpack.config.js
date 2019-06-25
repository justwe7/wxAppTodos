const path = require("path");
const globby = require("globby");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 复制文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 单独打包样式文件
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries"); //删除多余js

const ENTRY_PATH = ["./src/*.scss", "./src/pages/**/**/*.scss"];

module.exports = {
  entry: getEntries(ENTRY_PATH),
  output: {
    path: path.join(__dirname, "/dist")
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: [resolveResouce("mixin.scss")] // it need a absolute path
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    ]
  },
  plugins: [
    /* 删除多余的js入口信息 */
    new FixStyleOnlyEntriesPlugin(),
    /* 处理样式表后缀名 */
    new MiniCssExtractPlugin({
      filename: "[name].wxss"
    }),
    /* 复制其余所有未处理文件至指定的小程序工程目录 */
    new CopyWebpackPlugin([
      {
        from: "**/*",
        to: "",
        ignore: ["*.scss", "pages/**/*.png", "pages/**/*.jpg", "pages/**/*.jpeg"],
        context: "src/"
      }
    ])
  ]
};

/**
 * 混入的样式位置
 * @author huaxi.li
 * @date 2019-06-24
 * @param {*} name scss文件的名称
 * @returns
 */
function resolveResouce(name) {
  return path.resolve(__dirname, "./src/common/style/" + name);
}
/**
 * 根据入口列表获取入口文件对象格式
 * @author huaxi.li
 * @date 2019-06-24
 * @param {*} pattern Array[String]
 * @returns
 */
function getEntries(pattern) {
  let fileList = globby.sync(pattern); //读出文件列表
  return fileList.reduce((entryObj, current) => {
    let filePath = path.parse(
      path.relative(path.join(__dirname, "src"), current)
    ); //读取基于当前文件系统路径信息
    let filePathUri = path.join(filePath.dir, filePath.name); //合并出webpack entry的 key
    entryObj[filePathUri] = path.resolve(__dirname, current);
    return entryObj;
  }, {});
}
