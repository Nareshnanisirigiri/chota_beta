const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/sirin/OneDrive/Desktop/chota_beta';

fs.readdirSync(dir).filter(f => f.endsWith('.sql')).forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (content.match(/\buse\b/i) || content.match(/\bcreate\s+database\b/i)) {
    console.log(file, 'has matches');
  }
});
process.exit(0);
