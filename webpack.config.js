const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production"; // Detect the mode

  return {
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        }
      ],
    },
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      open: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/images', to: 'images' },
        ],
      }),
    ],
    devtool: 'source-map',
    mode: isProduction ? "production" : "development"
  }
};