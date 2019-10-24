import fs from 'fs';
import yargs from 'yargs';
import { fetchGist } from './fetch-gist';

const VERSION = '1.0.1';

const helpMessage = `\
Usage:
  $ gist-fetch <username> <filename>: fetch user's gist file by filename

Options:
  --out, -o: specify output path (default: \${pwd}/\${filename}
  --stdout : output to stdout
`;

function help() {
  console.log(helpMessage);
  process.exit(1);
}

function version() {
  console.log(VERSION);
  process.exit(1);
}

export async function main() {
  const { argv } = yargs.options({
    v: { type: 'boolean', alias: 'version', default: false },
    h: { type: 'boolean', alias: 'help', default: false },
    o: { type: 'string', alias: 'out' },
    stdout: { type: 'boolean', default: false }
  });

  if (argv.v) {
    version();
  }

  if (argv._.length !== 2 || argv.h) {
    help();
  }

  const username = argv._[0];
  const filename = argv._[1];

  const outputPath = argv.o || filename;

  const outFile = await fetchGist(username, filename);

  if (argv.stdout) {
    process.stdout.write(outFile);
  } else {
    await new Promise((resolve, reject) => {
      fs.writeFile(outputPath, outFile, e => {
        if (e) {
          reject(e);
        }
        resolve();
      });
    });
  }
}
