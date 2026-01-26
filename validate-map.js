import fs from 'fs';

const map = JSON.parse(fs.readFileSync('boardroom/map.json', 'utf8'));

// Check for common WorkAdventure map properties
const checks = {
  hasVersion: !!map.version,
  hasMapUrl: !!map.mapUrl,
  hasMapName: !!map.mapName,
  hasRoomId: !!map.roomId,
  hasTilesets: Array.isArray(map.tilesets) && map.tilesets.length > 0,
  hasLayers: Array.isArray(map.layers) && map.layers.length > 0,
  hasStartLayer: !!map.startLayer,
  hasStartX: typeof map.startX === 'number',
  hasStartY: typeof map.startY === 'number',
  tilesetHasName: map.tilesets?.[0]?.name !== undefined,
  tilesetHasImage: map.tilesets?.[0]?.image !== undefined,
  layersHaveData: map.layers?.every(l => l.hasOwnProperty('data') || l.type === 'objectgroup'),
};

console.log('Map validation:');
Object.entries(checks).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅' : '❌'}`);
});

// Check for potential undefined values that might cause toLowerCase error
console.log('\nString properties that might need toLowerCase:');
['mapUrl', 'mapName', 'roomId', 'startLayer'].forEach(prop => {
  const val = map[prop];
  console.log(`  ${prop}: ${val} (type: ${typeof val})`);
});

// Check tileset image path
console.log('\nTileset image path:');
console.log(`  ${map.tilesets?.[0]?.image}`);
