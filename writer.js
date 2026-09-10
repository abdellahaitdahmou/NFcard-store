const fs = require('fs');
const path = require('path');

const target = process.argv[2];
if (!target) {
  console.error('Usage: node writer.js <target-file> [base64-content]');
  process.exit(1);
}

const dir = path.dirname(target);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

if (process.argv[3]) {
  const content = Buffer.from(process.argv[3], 'base64').toString('utf-8');
  fs.writeFileSync(target, content, 'utf-8');
  console.log('Saved: ' + target);
} else {
  let data = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.on('end', () => {
    fs.writeFileSync(target, data, 'utf-8');
    console.log('Saved from stdin: ' + target);
  });
}
