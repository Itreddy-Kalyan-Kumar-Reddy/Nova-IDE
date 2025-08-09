const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@agents': path.resolve(__dirname, 'src/agents'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@tools': path.resolve(__dirname, 'src/tools'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    'electron': 'commonjs2 electron',
  },
};

const rendererConfig = {
  ...commonConfig,
  target: 'electron-renderer',
  entry: './src/renderer.ts',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/monaco-editor/min/vs',
          to: 'vs',
        },
      ],
    }),
  ],
};

module.exports = [mainConfig, rendererConfig];