#!/usr/bin/env node

const { main } = require('../dist/main')

main().catch(e => {
  console.error(e);
  process.exit(1);
});
