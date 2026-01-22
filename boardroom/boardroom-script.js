/**
 * WorkAdventure Boardroom Script
 * 
 * Places board members in their designated seats and configures Matrix chat
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Matrix boardroom room
    MATRIX_ROOM_ID: '!PXnmXLlzxpsYHbQidS:matrix.inquiry.institute',
    MATRIX_ROOM_ALIAS: '#boardroom:inquiry.institute',
    
    // Seating positions (in tile coordinates, 32x32 tiles)
    SEATS: {
      // Left side (5 seats)
      left: [
        { x: 300, y: 350, id: null }, // Seat 1 - to be assigned
        { x: 300, y: 400, id: null }, // Seat 2
        { x: 300, y: 450, id: null }, // Seat 3
        { x: 300, y: 500, id: null }, // Seat 4
        { x: 300, y: 550, id: null }, // Seat 5
      ],
      // Right side (5 seats)
      right: [
        { x: 1300, y: 350, id: null }, // Seat 1
        { x: 1300, y: 400, id: null }, // Seat 2
        { x: 1300, y: 450, id: null }, // Seat 3
        { x: 1300, y: 500, id: null }, // Seat 4
        { x: 1300, y: 550, id: null }, // Seat 5
      ],
      // Heretic at head of table
      heretic: { x: 800, y: 250, id: 'a.diogenes' },
      // Parliamentarian at bottom (unseated)
      parliamentarian: { x: 800, y: 750, id: null }, // To be determined
    },
    
    // Board member IDs (10 directors)
    DIRECTORS: [
      'a.turing',      // AINS
      'a.katsushikaoi', // ARTS
      'a.davinci',     // CRAF
      'a.darwin',      // ELAG
      'a.avicenna',    // HEAL
      'a.maryshelley', // HUMN
      'a.alkhwarizmi', // MATH
      'a.plato',       // META
      'a.newton',      // NATP
      'a.henryrobert', // SOCI
    ],
  };

  /**
   * Initialize boardroom
   */
  async function init() {
    console.log('[Boardroom] Initializing...');
    
    // Wait for WorkAdventure API
    if (typeof WA === 'undefined') {
      console.warn('[Boardroom] WorkAdventure API not available, retrying...');
      setTimeout(init, 1000);
      return;
    }

    await WA.onInit();
    console.log('[Boardroom] WorkAdventure initialized');

    // Check if we're in the boardroom
    const currentRoom = WA.room.id || '';
    if (!currentRoom.includes('boardroom')) {
      console.log('[Boardroom] Not in boardroom, skipping initialization');
      return;
    }

    // Configure Matrix chat zone for the entire room
    await configureMatrixChat();

    // Place board members in seats
    await placeBoardMembers();

    console.log('[Boardroom] Initialization complete');
  }

  /**
   * Configure Matrix chat zone
   */
  async function configureMatrixChat() {
    try {
      // Create a chat zone area covering the entire boardroom
      // This is typically done in the map editor, but we can verify it exists
      if (WA.room && WA.room.area) {
        const chatZone = WA.room.area.find(area => 
          area.properties && area.properties.chatZone
        );
        
        if (!chatZone) {
          console.warn('[Boardroom] Matrix chat zone not found in map. Please configure it in the map editor.');
        } else {
          console.log('[Boardroom] Matrix chat zone configured:', chatZone.properties.chatZone);
        }
      }
    } catch (error) {
      console.error('[Boardroom] Error configuring Matrix chat:', error);
    }
  }

  /**
   * Place board members in their seats
   */
  async function placeBoardMembers() {
    try {
      // Get current player
      const player = WA.player;
      const playerTags = player.tags || [];
      
      // Check if player is a board member
      const isBoardMember = CONFIG.DIRECTORS.some(id => 
        playerTags.includes(id) || 
        playerTags.includes('board_director')
      );
      
      const isHeretic = playerTags.includes('a.diogenes') || 
                        playerTags.includes('heretic');
      
      const isParliamentarian = playerTags.includes('parliamentarian');

      if (isHeretic) {
        // Place at head of table
        await WA.player.teleport(
          CONFIG.SEATS.heretic.x,
          CONFIG.SEATS.heretic.y
        );
        console.log('[Boardroom] Placed heretic at head of table');
      } else if (isParliamentarian) {
        // Place at bottom (unseated)
        await WA.player.teleport(
          CONFIG.SEATS.parliamentarian.x,
          CONFIG.SEATS.parliamentarian.y
        );
        console.log('[Boardroom] Placed parliamentarian at bottom');
      } else if (isBoardMember) {
        // Find available seat (left or right side)
        // For now, assign randomly or based on some logic
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const seats = CONFIG.SEATS[side];
        const availableSeat = seats.find(seat => !seat.occupied);
        
        if (availableSeat) {
          await WA.player.teleport(availableSeat.x, availableSeat.y);
          availableSeat.occupied = true;
          console.log(`[Boardroom] Placed board member on ${side} side`);
        }
      }
    } catch (error) {
      console.error('[Boardroom] Error placing board members:', error);
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for manual control
  window.Boardroom = {
    init,
    config: CONFIG,
  };

})();
