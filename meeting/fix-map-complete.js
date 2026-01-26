const fs = require('fs');
const map = JSON.parse(fs.readFileSync('map.json', 'utf8'));

// Ensure all common WorkAdventure map properties exist
// Add any missing properties that might cause toLowerCase errors

// Ensure mapUrl is lowercase (WorkAdventure might expect this)
if (map.mapUrl) {
  map.mapUrl = map.mapUrl.toLowerCase();
}

// Ensure roomId is lowercase
if (map.roomId) {
  map.roomId = map.roomId.toLowerCase();
}

// Ensure startLayer exists and is a string
if (!map.startLayer || typeof map.startLayer !== 'string') {
  map.startLayer = 'floor';
}

// Ensure all layer names are strings
map.layers.forEach(layer => {
  if (!layer.name || typeof layer.name !== 'string') {
    layer.name = layer.name || 'unnamed';
  }
  if (!layer.type || typeof layer.type !== 'string') {
    layer.type = layer.type || 'tilelayer';
  }
  
  // Ensure tile layers have data
  if (layer.type === 'tilelayer') {
    const expectedLength = (layer.width || 50) * (layer.height || 32);
    if (!layer.data || layer.data.length !== expectedLength) {
      layer.data = Array(expectedLength).fill(0);
    }
  }
  
  // Ensure object groups have proper object types
  if (layer.type === 'objectgroup' && layer.objects) {
    layer.objects.forEach(obj => {
      // Ensure name is a string
      if (!obj.name || typeof obj.name !== 'string') {
        obj.name = obj.name || '';
      }
      // Ensure type is a string (not null/undefined)
      if (!obj.type || typeof obj.type !== 'string') {
        obj.type = obj.type || (obj.properties ? 'area' : 'object');
      }
      // Ensure all property values that might be processed are strings
      if (obj.properties) {
        Object.keys(obj.properties).forEach(key => {
          const val = obj.properties[key];
          // Convert boolean to string if it might be processed with toLowerCase
          if (typeof val === 'boolean') {
            obj.properties[key] = String(val);
          }
        });
      }
    });
  }
});

// Ensure tileset has all required properties as strings
map.tilesets.forEach(tileset => {
  if (!tileset.name || typeof tileset.name !== 'string') {
    tileset.name = tileset.name || 'default';
  }
  if (tileset.image && typeof tileset.image !== 'string') {
    tileset.image = String(tileset.image);
  }
});

fs.writeFileSync('map.json', JSON.stringify(map, null, 2));
console.log('✅ Map fixed - all properties ensured to be proper types');
