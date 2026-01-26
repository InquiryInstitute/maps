// Check if tileset has all required fields
const fs = require('fs');
const boardroom = JSON.parse(fs.readFileSync('boardroom/map.json', 'utf8'));
const starter = JSON.parse(fs.readFileSync('starter/map.json', 'utf8'));

console.log('Boardroom tileset:', JSON.stringify(boardroom.tilesets[0], null, 2));
console.log('\nStarter tileset:', JSON.stringify(starter.tilesets[0], null, 2));

// Check for common required fields
const required = ['name', 'firstgid', 'image', 'imagewidth', 'imageheight', 'tilewidth', 'tileheight'];
const optional = ['tilecount', 'columns', 'margin', 'spacing'];

console.log('\n=== Field Check ===');
[boardroom.tilesets[0], starter.tilesets[0]].forEach((ts, i) => {
  const name = i === 0 ? 'Boardroom' : 'Starter';
  console.log(`\n${name}:`);
  required.forEach(field => {
    const has = ts.hasOwnProperty(field);
    console.log(`  ${field}: ${has ? '✅' : '❌'} ${has ? `(${ts[field]})` : 'MISSING'}`);
  });
  optional.forEach(field => {
    const has = ts.hasOwnProperty(field);
    if (has) console.log(`  ${field}: ✅ (${ts[field]})`);
  });
});
