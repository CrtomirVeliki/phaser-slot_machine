const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const path = require('path');

module.exports = {
  entry: './src/index.ts',  

  output: {
    
    filename: 'bundle.js',  
    path: path.resolve(__dirname, 'dist'),  
    clean: true,  
  },

  module: {
    
    rules: [
      {
        test: /\.ts$/,  
        exclude: /node_modules/,
        use: 'ts-loader',  
      },

      {
        test: /\.(png|jpe?g|gif)$/i,  
        type: 'asset/resource',  
      },
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
  mode: 'production',  
};