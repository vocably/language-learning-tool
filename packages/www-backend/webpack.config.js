const path = require('path');
const getModules = require('./webpack/getModules.js');
const { getEnvironmentVariables } = require('@vocably/webpack');
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  entry: getModules('./src/lambdas'),
  externals: {
    'aws-sdk': 'aws-sdk',
    '@aws-sdk/client-s3': '@aws-sdk/client-s3',
    '@aws-sdk/client-cognito-identity-provider':
      '@aws-sdk/client-cognito-identity-provider',
    '@aws-sdk/client-dynamodb': '@aws-sdk/client-dynamodb',
    '@aws-sdk/client-sesv2': '@aws-sdk/client-sesv2',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  target: 'node',
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },
  plugins: [new DefinePlugin(getEnvironmentVariables().stringified)],
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name].js',
  },
};
