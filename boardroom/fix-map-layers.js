import fs from 'fs';

const map = JSON.parse(fs.readFileSync('map.json', 'utf8'));

// WorkAdventure might need at least some tile data in layers
// Let's add minimal tile data (all zeros = no tiles, but array is populated)
map.layers.forEach(layer => {
  if (layer.type === 'tilelayer' && (!layer.data || layer.data.length === 0)) {
    // Create array of zeros for width * height
    layer.data = new Array(layer.width * layer.height).fill(0);
  }
});

// Also ensure all required layer properties exist
map.layers.forEach(layer => {
  if (!layer.hasOwnProperty('visible')) layer.visible = true;
  if (!layer.hasOwnProperty('opacity')) layer.opacity = 1;
  if (layer.type === 'tilelayer' && !layer.hasOwnProperty('data')) {
    layer.data = new Array((layer.width || 50) * (layer.height || 32)).fill(0);
  }
});

fs.writeFileSync('map.json', JSON.stringify(map, null, 2));
console.log('Fixed map layers - added tile data arrays');
