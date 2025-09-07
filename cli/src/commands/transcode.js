const { spawn } = require('node:child_process');

exports.transcode = async (input, opts) => {
  const out = input.replace(/\.[^.]+$/, '') + '.mp4';
  const args = ['-y', '-i', input, '-preset', opts.preset, out];
  console.log('ffmpeg', args.join(' '));
  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: 'inherit' });
    p.on('exit', code => (code === 0 ? resolve() : reject(new Error('ffmpeg failed with code ' + code))));
  });
  console.log('✅ output:', out);
};

