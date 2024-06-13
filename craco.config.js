const path = require("path");
const { webpack } = require("@storybook/react-webpack5/preset");
const SemiWebpackPlugin = require("@douyinfe/semi-webpack-plugin").default;

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },

    plugins: [
      new SemiWebpackPlugin({
        theme: "@semi-bot/semi-theme-pk",
        include: "~@semi-bot/semi-theme-pk/scss/local.scss",
      }),
      // 定义环境变量
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development",
        ),
      }),
    ],
  },
};
