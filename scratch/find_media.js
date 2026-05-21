const fs = require('fs');
const logPath = 'C:\\Users\\sirin\\.gemini\\antigravity\\brain\\ad0801d7-c018-4eb4-bd97-ae64a3ab92b9\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist');
  process.exit(1);
}

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.source === 'MODEL' && obj.type === 'PLANNER_RESPONSE') {
      if (obj.step_index >= 20 && obj.step_index <= 200) {
        console.log(`\n=== Step ${obj.step_index} ===`);
        console.log(obj.content);
      }
    }
  } catch (err) {}
}
