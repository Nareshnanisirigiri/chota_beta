const fs = require('fs');
const path = require('path');

const dirs = [
  'C:/Users/sirin/Downloads',
  'C:/Users/sirin/OneDrive/Desktop',
  'D:/Office/Chota_beta'
];

const matches = [];

function search(dir) {
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!file.startsWith('.') && !['node_modules', 'temp_extract'].includes(file)) {
            search(fullPath);
          }
        } else if (file.endsWith('.sql')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.toLowerCase().includes('create database')) {
            matches.push({
              path: fullPath,
              hasCollation: content.includes('utf8mb4_0900_ai_ci')
            });
          }
        }
      } catch(e) {}
    });
  } catch(e) {}
}

dirs.forEach(search);
console.log('Matches:', JSON.stringify(matches, null, 2));
process.exit(0);
