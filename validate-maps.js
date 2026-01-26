#!/usr/bin/env node
/**
 * WorkAdventure Map Validator
 * Uses @workadventure/tiled-map-type-guard to validate Tiled JSON maps
 * 
 * Usage: node validate-maps.js [map1.json] [map2.json] ...
 *        node validate-maps.js  (validates all maps in subdirectories)
 */

const { ITiledMap } = require('@workadventure/tiled-map-type-guard');
const fs = require('fs');
const path = require('path');

// Find all map.json files recursively
function findMaps(dir, maps = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findMaps(fullPath, maps);
    } else if (file === 'map.json' || file.endsWith('.tmj')) {
      maps.push(fullPath);
    }
  }
  
  return maps;
}

// Validate a single map
function validateMap(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const map = JSON.parse(content);
    
    const result = ITiledMap.safeParse(map);
    
    if (result.success) {
      return { valid: true, path: filePath };
    } else {
      return { 
        valid: false, 
        path: filePath, 
        errors: result.error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      };
    }
  } catch (e) {
    return { 
      valid: false, 
      path: filePath, 
      errors: [{ path: 'file', message: e.message }]
    };
  }
}

// Main
const args = process.argv.slice(2);
const maps = args.length > 0 ? args : findMaps(process.cwd());

if (maps.length === 0) {
  console.log('No map files found.');
  process.exit(0);
}

console.log(`\n🗺️  Validating ${maps.length} map(s)...\n`);

let valid = 0;
let invalid = 0;

for (const mapPath of maps) {
  const result = validateMap(mapPath);
  const relativePath = path.relative(process.cwd(), result.path);
  
  if (result.valid) {
    console.log(`✅ ${relativePath}`);
    valid++;
  } else {
    console.log(`❌ ${relativePath}`);
    for (const err of result.errors.slice(0, 5)) {
      console.log(`   └─ ${err.path}: ${err.message}`);
    }
    if (result.errors.length > 5) {
      console.log(`   └─ ... and ${result.errors.length - 5} more errors`);
    }
    invalid++;
  }
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Total: ${maps.length} | Valid: ${valid} | Invalid: ${invalid}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

process.exit(invalid > 0 ? 1 : 0);
