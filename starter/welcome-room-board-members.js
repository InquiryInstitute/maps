/**
 * WorkAdventure Welcome Room - Board of Directors NPCs
 * 
 * Places all 11 board members in the welcome room with their custom Woka avatars.
 * Loads Woka data from Supabase and positions each board member.
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Supabase configuration (will be injected by WorkAdventure or set via env)
    SUPABASE_URL: 'https://pilmscrodlitdrygabvo.supabase.co',
    SUPABASE_ANON_KEY: '', // Will be set from environment or WorkAdventure config
    
    // Welcome room board member positions
    // Arranged in a welcoming semicircle or conference table layout
    POSITIONS: [
      // Row 1 (front) - 5 members
      { x: 400, y: 300, id: 'a.plato' },           // Center - Plato (META)
      { x: 300, y: 300, id: 'a.turing' },          // Left - Turing (AINS)
      { x: 500, y: 300, id: 'a.newton' },         // Right - Newton (NATP)
      { x: 200, y: 300, id: 'a.alkhwarizmi' },    // Far left - Al-Khwarizmi (MATH)
      { x: 600, y: 300, id: 'a.darwin' },         // Far right - Darwin (ELAG)
      
      // Row 2 (middle) - 4 members
      { x: 350, y: 400, id: 'a.davinci' },        // Left center - Da Vinci (CRAF)
      { x: 450, y: 400, id: 'a.avicenna' },       // Right center - Avicenna (HEAL)
      { x: 250, y: 400, id: 'a.katsushikaoi' },   // Left - Ōi (ARTS)
      { x: 550, y: 400, id: 'a.maryshelley' },    // Right - Shelley (HUMN)
      
      // Row 3 (back) - 2 members
      { x: 300, y: 500, id: 'a.henryrobert' },    // Left - Robert (SOCI)
      { x: 500, y: 500, id: 'a.diogenes' },       // Right - Diogenes (Heretic)
    ],
    
    // Welcome room map identifier
    WELCOME_ROOM_MAP: 'welcome',
  };

  // Board member data cache
  let boardMembers = new Map();
  let positionsAssigned = new Map();

  /**
   * Initialize Supabase client
   */
  function getSupabaseClient() {
    // Try to get from WorkAdventure environment or global
    const supabaseUrl = CONFIG.SUPABASE_URL;
    const supabaseKey = CONFIG.SUPABASE_ANON_KEY || 
                       (typeof WA !== 'undefined' && WA.state?.supabaseKey) ||
                       '';
    
    if (!supabaseKey) {
      console.warn('[Board Members] Supabase key not configured');
      return null;
    }

    // Use Supabase JS client if available
    if (typeof createClient !== 'undefined') {
      return createClient(supabaseUrl, supabaseKey);
    }
    
    // Fallback: use fetch API
    return {
      from: (table) => ({
        select: (columns) => ({
          in: (column, values) => ({
            async then(callback) {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?${column}=in.(${values.join(',')})&select=${columns}`,
                {
                  headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                  },
                }
              );
              const data = await response.json();
              callback({ data, error: response.ok ? null : new Error('Failed to fetch') });
            },
          }),
        }),
      }),
    };
  }

  /**
   * Load board members from Supabase
   */
  async function loadBoardMembers() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[Board Members] Cannot load board members - Supabase not configured');
      return;
    }

    try {
      const boardMemberIds = CONFIG.POSITIONS.map(p => p.id);
      
      // Fetch faculty with Woka data
      const { data, error } = await supabase
        .from('faculty')
        .select('id, name, woka')
        .in('id', boardMemberIds);

      if (error) {
        console.error('[Board Members] Error loading board members:', error);
        return;
      }

      // Cache board members
      if (data) {
        data.forEach(member => {
          boardMembers.set(member.id, member);
        });
        console.log(`[Board Members] Loaded ${data.length} board members`);
      }
    } catch (error) {
      console.error('[Board Members] Failed to load board members:', error);
    }
  }

  /**
   * Apply Woka customization to a player
   */
  async function applyWokaToPlayer(playerId, wokaData) {
    if (!wokaData || typeof WA === 'undefined') {
      return;
    }

    try {
      // WorkAdventure Woka API
      if (WA.player.loadTexture && wokaData.texture_id) {
        await WA.player.loadTexture(wokaData.texture_id);
      }

      // Apply colors if available
      if (wokaData.colors && WA.player.setColor) {
        if (wokaData.colors.skin) {
          WA.player.setColor('skin', wokaData.colors.skin);
        }
        if (wokaData.colors.hair) {
          WA.player.setColor('hair', wokaData.colors.hair);
        }
        if (wokaData.colors.eyes) {
          WA.player.setColor('eyes', wokaData.colors.eyes);
        }
      }

      // Load accessories
      if (wokaData.accessories && Array.isArray(wokaData.accessories)) {
        for (const accessory of wokaData.accessories) {
          if (WA.player.loadAccessory) {
            await WA.player.loadAccessory(accessory);
          }
        }
      }

      console.log(`[Board Members] Applied Woka to ${playerId}`);
    } catch (error) {
      console.error(`[Board Members] Failed to apply Woka to ${playerId}:`, error);
    }
  }

  /**
   * Place board member at position
   */
  async function placeBoardMember(memberId, position) {
    if (typeof WA === 'undefined') {
      console.warn('[Board Members] WorkAdventure API not available');
      return;
    }

    const member = boardMembers.get(memberId);
    if (!member) {
      console.warn(`[Board Members] Member ${memberId} not found`);
      return;
    }

    try {
      // Check if this is the current player and they're a board member
      const currentPlayer = WA.player;
      const playerTags = currentPlayer.tags || [];
      
      // Check if player matches this board member (by tag or name)
      const isBoardMember = playerTags.includes('board_director') || 
                           playerTags.includes(memberId) ||
                           currentPlayer.name?.toLowerCase().includes(member.name?.toLowerCase() || '');

      if (isBoardMember) {
        // Teleport player to position
        await WA.player.teleport(position.x, position.y);
        
        // Apply Woka customization
        if (member.woka) {
          await applyWokaToPlayer(memberId, member.woka);
        }
        
        positionsAssigned.set(memberId, position);
        console.log(`[Board Members] Placed ${member.name} at (${position.x}, ${position.y})`);
      }
    } catch (error) {
      console.error(`[Board Members] Failed to place ${memberId}:`, error);
    }
  }

  /**
   * Create NPCs for board members (if WorkAdventure supports NPCs)
   */
  async function createBoardMemberNPCs() {
    if (typeof WA === 'undefined' || !WA.room) {
      console.warn('[Board Members] Cannot create NPCs - WorkAdventure API not available');
      return;
    }

    // Check if NPC API is available
    if (!WA.room.createNPC) {
      console.warn('[Board Members] NPC API not available in this WorkAdventure version');
      return;
    }

    try {
      for (const position of CONFIG.POSITIONS) {
        const member = boardMembers.get(position.id);
        if (!member) continue;

        const woka = member.woka || {};
        
        // Create NPC with Woka customization
        const npc = await WA.room.createNPC({
          name: member.name,
          x: position.x,
          y: position.y,
          texture: woka.texture_id || 'default',
          color: woka.colors || {},
          accessories: woka.accessories || [],
        });

        // Set NPC behavior (idle, greeting, etc.)
        if (npc && npc.setBehavior) {
          npc.setBehavior('idle'); // or 'greeting', 'patrol', etc.
        }

        console.log(`[Board Members] Created NPC for ${member.name}`);
      }
    } catch (error) {
      console.error('[Board Members] Failed to create NPCs:', error);
    }
  }

  /**
   * Initialize board members in welcome room
   */
  async function init() {
    console.log('[Board Members] Initializing board members in welcome room...');

    // Wait for WorkAdventure API
    if (typeof WA === 'undefined') {
      console.warn('[Board Members] WorkAdventure API not available, retrying...');
      setTimeout(init, 1000);
      return;
    }

    // Wait for WorkAdventure to be ready
    await WA.onInit();
    console.log('[Board Members] WorkAdventure initialized');

    // Check if we're in the welcome room
    const currentRoom = WA.room.id || '';
    if (!currentRoom.includes('welcome') && !currentRoom.includes('starter')) {
      console.log('[Board Members] Not in welcome room, skipping board member placement');
      return;
    }

    // Load board members from database
    await loadBoardMembers();

    // Try to create NPCs first (if supported)
    await createBoardMemberNPCs();

    // Also place real players who are board members
    if (WA.players && WA.players.configureTracking) {
      await WA.players.configureTracking();
      
      WA.players.list().forEach(player => {
        const playerTags = player.tags || [];
        const isBoardMember = playerTags.includes('board_director');
        
        if (isBoardMember) {
          // Find position for this board member
          const position = CONFIG.POSITIONS.find(p => {
            // Try to match by tag or name
            return playerTags.includes(p.id) || 
                   player.name?.toLowerCase().includes(boardMembers.get(p.id)?.name?.toLowerCase() || '');
          });
          
          if (position) {
            placeBoardMember(position.id, position);
          }
        }
      });

      // Listen for new players joining
      WA.players.onPlayerEnters.subscribe(async (player) => {
        const playerTags = player.tags || [];
        if (playerTags.includes('board_director')) {
          // Find position and place them
          const position = CONFIG.POSITIONS.find(p => 
            playerTags.includes(p.id)
          );
          if (position) {
            await placeBoardMember(position.id, position);
          }
        }
      });
    }

    console.log('[Board Members] Board members initialized in welcome room');
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for manual control
  window.BoardMembers = {
    load: loadBoardMembers,
    place: placeBoardMember,
    positions: CONFIG.POSITIONS,
    members: boardMembers,
  };

})();
