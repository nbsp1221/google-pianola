import path from 'path';
import { capitalCase } from 'change-case';
import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { isProduction } from './config/env';
import packageJson from './package.json';

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  watch: !isProduction,
  resolve: {
    extensions: [
      '.js',
      '.ts',
    ],
    fallback: { path: require.resolve('path-browserify') },
  },
  entry: {
    app: path.join(__dirname, 'src', 'app.ts'),
    background: path.join(__dirname, 'src', 'background.ts'),
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
        { from: './sheets/**/*.sheet' },
        { from: './sheets/**/*.json' },
      ],
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
};

export default config;
