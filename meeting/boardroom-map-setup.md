# Boardroom Map Setup

This document describes the boardroom map structure and seating arrangement for the Inquiry Institute Council of Inquiry.

## Seating Arrangement

### Table Layout
- **Long conference table** in the center
- **5 directors** on the left side
- **5 directors** on the right side
- **Heretic** at the head of the table (end)
- **Parliamentarian** at the bottom, unseated (standing position)

### Coordinates (32x32 tile grid)

**Table:**
- Center of room: x=800, y=500
- Table extends: x=400-1200, y=400-600

**Left Side (5 seats):**
1. Seat 1: x=300, y=350
2. Seat 2: x=300, y=400
3. Seat 3: x=300, y=450
4. Seat 4: x=300, y=500
5. Seat 5: x=300, y=550

**Right Side (5 seats):**
1. Seat 1: x=1300, y=350
2. Seat 2: x=1300, y=400
3. Seat 3: x=1300, y=450
4. Seat 4: x=1300, y=500
5. Seat 5: x=1300, y=550

**Heretic (head of table):**
- Position: x=800, y=250

**Parliamentarian (bottom, unseated):**
- Position: x=800, y=750

**Entry Point:**
- x=800, y=900

## Matrix Integration

**Matrix Room:**
- Room ID: `!PXnmXLlzxpsYHbQidS:matrix.inquiry.institute`
- Room Alias: `#boardroom:inquiry.institute`

The entire boardroom area should be configured as a Matrix chat zone.

## Map Creation

This map should be created using:
1. **Tiled Editor** - Create the visual map (TMJ file)
2. **WorkAdventure Map Editor** - Add interactive areas and Matrix chat zones
3. **Export** as `map.json` (WAM format)

## Next Steps

1. Create the visual map in Tiled
2. Add seating positions as interactive areas
3. Configure Matrix chat zone for the entire room
4. Export and upload to GitHub repository
