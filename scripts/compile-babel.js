/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

function getCommand(watch) {
  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');

  const ignore = [
    '**/__mocks__/',
    '**/tests/',
    '**/__tests__/',
    '**/*.test.js',
    '**/*.test.ts',
    '**/stories/',
    '**/*.story.js',
    '**/*.story.ts',
    '**/*.stories.js',
    '**/*.stories.ts',
    '**/__snapshots__',
    '**/*.d.ts',
  ];

  const args = [
    './src',
    '--out-dir ./dist',
    `--config-file ${path.resolve(__dirname, '../.babelrc.js')}`,
    `--extensions ".js,.jsx,.ts,.tsx"`,
    `--copy-files`,
    `--ignore "${ignore.join('","')}"`,
  ];

  if (watch) {
    args.push('-w');
  }

  return `${babel} ${args.join(' ')}`;
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback();
    }

    shell.exit(code);
  }
}

function babelify(options = {}) {
  if (process.cwd().includes(path.join('app', 'angular'))) {
    return;
  }

  const { watch = false, silent = false, errorCallback } = options;

  if (!fs.existsSync('src')) {
    if (!silent) {
      console.log('No src dir');
    }
    return;
  }

  const command = getCommand(watch);
  const { code } = shell.exec(command, { silent });

  handleExit(code, errorCallback);
}

module.exports = {
  babelify,
};