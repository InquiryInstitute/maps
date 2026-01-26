import fs from 'fs';

const map = JSON.parse(fs.readFileSync('map.json', 'utf8'));

// Fix area objects - ensure all properties are strings where expected
map.layers.forEach(layer => {
  if (layer.type === 'objectgroup' && layer.objects) {
    layer.objects.forEach(obj => {
      // Ensure name is a string
      if (!obj.name) obj.name = '';
      // Ensure type is a string if it exists
      if (obj.type && typeof obj.type !== 'string') obj.type = String(obj.type);
      // Fix properties object
      if (obj.properties) {
        Object.keys(obj.properties).forEach(key => {
          const val = obj.properties[key];
          // Ensure all property values that might need toLowerCase are strings
          if (typeof val !== 'string' && typeof val !== 'boolean' && typeof val !== 'number') {
            obj.properties[key] = String(val);
          }
        });
      }
    });
  }
});

// Also ensure entry object has all required fields
map.layers.forEach(layer => {
  if (layer.type === 'objectgroup' && layer.objects) {
    layer.objects.forEach(obj => {
      if (obj.type === 'entry') {
        if (!obj.name) obj.name = 'entry';
        if (typeof obj.x !== 'number') obj.x = 0;
        if (typeof obj.y !== 'number') obj.y = 0;
        if (typeof obj.width !== 'number') obj.width = 32;
        if (typeof obj.height !== 'number') obj.height = 32;
      }
    });
  }
});

fs.writeFileSync('map.json', JSON.stringify(map, null, 2));
console.log('Fixed area and object properties');
