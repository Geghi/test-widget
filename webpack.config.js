const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "technet-chatbot.min.js",
    path: __dirname + "/dist",
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new Dotenv()],
};
