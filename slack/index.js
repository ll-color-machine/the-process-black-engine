require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');

// Ensure required envs are present at runtime
if (!process.env.SLACK_APP_TOKEN || !process.env.SLACK_BOT_TOKEN) {
  console.error('Missing SLACK_APP_TOKEN or SLACK_BOT_TOKEN in slack/.env');
  process.exit(1);
}

const app = new App({
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  token: process.env.SLACK_BOT_TOKEN,
  logLevel: LogLevel.INFO
});

app.event('app_mention', async ({ say }) => {
  const name = process.env.MACHINE_NAME || 'the-machine';
  const color = process.env.MACHINE_COLOR || 'UNKNOWN';
  await say(`👋 ${name} (${color}) online.`);
});

app.command('/purple', async ({ ack, respond }) => {
  await ack();
  await respond('💜 Running a quick health check…');
  const url = (process.env.PY_SERVICE_URL || 'http://127.0.0.1:4071') + '/health';
  try {
    const res = await fetch(url, { method: 'GET' });
    const json = await res.json();
    await respond(`🩺 py health: \`${JSON.stringify(json)}\``);
  } catch (e) {
    await respond(`⚠️ py health fetch failed: ${e.message}`);
  }
});

(async () => {
  await app.start();
  console.log('⚡ slack bot (socket-mode) up');
})();

