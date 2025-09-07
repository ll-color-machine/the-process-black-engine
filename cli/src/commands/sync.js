const { readdir, readFile, stat } = require('node:fs/promises');
const path = require('node:path');

exports.sync = async (opts = {}) => {
  const plansDir = path.resolve(process.cwd(), '../_context/plans');
  try {
    const entries = await readdir(plansDir);
    const files = [];
    for (const name of entries) {
      const p = path.join(plansDir, name);
      const s = await stat(p);
      if (s.isFile()) files.push(p);
    }
    console.log('Syncing plans:', files.map(f => path.basename(f)));
    for (const file of files) {
      const content = await readFile(file, 'utf8');
      if (opts.dryRun) {
        console.log(`-- ${path.basename(file)} (${content.length} bytes)`);
      } else {
        // TODO: upload or register plans as needed
        console.log(`Uploaded ${path.basename(file)} (stub)`);
      }
    }
  } catch (err) {
    console.error('sync error:', err.message);
    process.exitCode = 1;
  }
};

