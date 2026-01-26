import fs from 'fs';

const map = JSON.parse(fs.readFileSync('map.json', 'utf8'));

// WorkAdventure might need top-level width and height
// Calculate from the largest layer
let maxWidth = 0;
let maxHeight = 0;

map.layers.forEach(layer => {
  if (layer.width && layer.width > maxWidth) maxWidth = layer.width;
  if (layer.height && layer.height > maxHeight) maxHeight = layer.height;
});

// Set map dimensions
map.width = maxWidth || 50;
map.height = maxHeight || 32;

// Also ensure tilewidth and tileheight are set
if (!map.tilewidth) map.tilewidth = 32;
if (!map.tileheight) map.tileheight = 32;

fs.writeFileSync('map.json', JSON.stringify(map, null, 2));
console.log(`Added map dimensions: ${map.width}x${map.height}`);
