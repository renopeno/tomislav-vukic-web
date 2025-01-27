const path = require('path');

module.exports = {
  entry: {
    global: './global/index.js',
    home: './home/index.js',
    work: './work/index.js',
    about: './about/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true, // Automatski briše stare fajlove u 'dist'
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
  mode: 'production', // Promijenite na 'development' za lokalni rad
  devtool: 'source-map', // Dodaje source mapove za debugging
};