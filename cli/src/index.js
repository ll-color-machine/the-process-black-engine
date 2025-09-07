require('dotenv').config();
const { program } = require('commander');
const { ingest } = require('./commands/ingest');
const { transcode } = require('./commands/transcode');
const { sync } = require('./commands/sync');

program.name('prism-job').version('0.1.0');

program
  .command('ingest <path>')
  .option('--type <kind>', 'link|pdf|image|video', 'link')
  .description('Register asset with the Prism/DB')
  .action(ingest);

program
  .command('transcode <input>')
  .option('-p, --preset <preset>', 'ffmpeg preset', 'medium')
  .description('Run local ffmpeg job')
  .action(transcode);

program
  .command('sync')
  .option('--dry-run', 'do not upload, just print', true)
  .description('Sync _context/plans with the Prism')
  .action(sync);

program.parseAsync(process.argv);

