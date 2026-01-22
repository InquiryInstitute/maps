# WorkAdventure Maps

This repository hosts WorkAdventure maps for the Inquiry Institute.

## Structure

```
.
├── starter/
│   ├── map.json      # WorkAdventure map file (WAM format)
│   ├── map.tmj       # Tiled map file (TMJ format)
│   └── assets/       # Map assets (images, tilesets, etc.)
├── welcome/
│   ├── map.json
│   ├── map.tmj
│   └── assets/
└── README.md
```

## Adding Maps

1. Create a new directory (e.g., `welcome/`)
2. Add `map.json` and `map.tmj` files
3. Add any assets to `assets/` subdirectory
4. Commit and push

Maps will be automatically available at:
`https://inquiryinstitute.github.io/maps/[map-name]/map.json`

## WorkAdventure Configuration

WorkAdventure is configured to load maps from:
```
https://inquiryinstitute.github.io/maps
```

## Map Creation

Use the WorkAdventure map editor or Tiled to create maps:
- Export as `map.tmj` (Tiled format)
- Convert to `map.json` (WorkAdventure format) using WorkAdventure tools
