const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/sirin/OneDrive/Desktop/chota_beta';
const files = ['chota_beta_cache.sql', 'chota_beta_categories.sql', 'chota_beta_products.sql', 'chota_beta_settings.sql'];

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.match(/\buse\b/i) || line.match(/\bcreate\s+database\b/i)) {
      console.log(`${file} L${idx+1}: ${line.trim()}`);
    }
  });
});
process.exit(0);
