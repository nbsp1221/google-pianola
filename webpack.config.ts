import path from 'path';
import { capitalCase } from 'change-case';
import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { isProduction } from './config/env';
import packageJson from './package.json';

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  entry: {
    app: path.join(__dirname, 'src', 'app.ts'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'manifest.json'),
          transform: (content) => {
            return Buffer.from(JSON.stringify({
              name: capitalCase(packageJson.name),
              description: packageJson.description,
              version: packageJson.version,
              ...JSON.parse(content.toString()),
            }));
          },
        },
      ],
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
};

export default config;
