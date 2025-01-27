const path = require('path');

module.exports = {
    entry: {
      global: './global/index.js',
      home: './home/index.js',
      work: './work/index.js',
      about: './about/index.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: __dirname + '/dist',
    },
    module: {
      rules: [
        {
          test: /\.js$/, // Svi JS fajlovi
          exclude: /node_modules/, // Isključi node_modules
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // Babel preset konfiguracija
            },
          },
        },
      ],
    },
    mode: 'development',
  };