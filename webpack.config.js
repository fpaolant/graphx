const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/GraphX.ts', './src/index.ts'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: "umd",
      name: "$mwt",
    }
  },
  devServer : {
    static: {
      directory: path.join(__dirname, "./dist")
    },
    port: 3000,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.wasm'],
  }
};
