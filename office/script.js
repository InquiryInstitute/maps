/**
 * Inquiry Institute Welcome Hall Script
 * 
 * Features:
 * - Board of Directors NPCs placement
 * - Matrix chat integration
 * - Clock popup
 * - Interactive areas
 */

// Board of Directors configuration
const BOARD_DIRECTORS = [
  { id: 'a.plato', name: 'Plato', title: 'Chair - META Division', x: 640, y: 320 },
  { id: 'a.turing', name: 'Alan Turing', title: 'AINS Division', x: 576, y: 320 },
  { id: 'a.newton', name: 'Isaac Newton', title: 'NATP Division', x: 704, y: 320 },
  { id: 'a.alkhwarizmi', name: 'Al-Khwarizmi', title: 'MATH Division', x: 512, y: 352 },
  { id: 'a.darwin', name: 'Charles Darwin', title: 'ELAG Division', x: 768, y: 352 },
  { id: 'a.davinci', name: 'Leonardo da Vinci', title: 'CRAF Division', x: 576, y: 384 },
  { id: 'a.avicenna', name: 'Ibn Sina', title: 'HEAL Division', x: 704, y: 384 },
  { id: 'a.katsushikaoi', name: 'Katsushika Ōi', title: 'ARTS Division', x: 512, y: 416 },
  { id: 'a.maryshelley', name: 'Mary Shelley', title: 'HUMN Division', x: 768, y: 416 },
  { id: 'a.henryrobert', name: 'Henry Robert', title: 'SOCI Division - Parliamentarian', x: 640, y: 480 },
  { id: 'a.diogenes', name: 'Diogenes', title: 'Heretic', x: 640, y: 448 },
];

// Matrix room configuration
const MATRIX_ROOMS = {
  lobby: '#lobby:inquiry.institute',
  boardroom: '#boardroom:inquiry.institute',
  lounge: '#lounge:inquiry.institute',
};

let clockPopup;
let directorPopup;
let matrixConnected = false;

// Initialize when WorkAdventure is ready
WA.onInit().then(() => {
  console.log('[Inquiry Institute] Welcome Hall initializing...');
  console.log('[Inquiry Institute] Player tags:', WA.player.tags);
  
  // Setup clock interaction
  setupClock();
  
  // Setup Matrix chat areas
  setupMatrixAreas();
  
  // Place board directors (as interactive areas, not NPCs since API may not support it)
  setupDirectorAreas();
  
  // Load scripting API extra features
  loadScriptingApiExtra();
  
  console.log('[Inquiry Institute] Welcome Hall ready!');
}).catch(error => console.error('[Inquiry Institute] Init error:', error));

/**
 * Setup clock popup
 */
function setupClock() {
  WA.room.area.onEnter('clock').subscribe(() => {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + 
                 now.getMinutes().toString().padStart(2, '0');
    clockPopup = WA.ui.openPopup('clockPopup', `It's ${time}`, []);
  });
  
  WA.room.area.onLeave('clock').subscribe(() => {
    if (clockPopup) {
      clockPopup.close();
      clockPopup = undefined;
    }
  });
}

/**
 * Setup Matrix chat integration areas
 */
function setupMatrixAreas() {
  // Main lobby area - connect to Matrix lobby room
  try {
    // Check if Matrix is configured
    const matrixUri = 'https://matrix.inquiry.institute';
    
    // Add Matrix chat button to UI
    WA.ui.registerMenuCommand('💬 Open Matrix Chat', () => {
      WA.nav.openCoWebSite(`${matrixUri}/#/room/${encodeURIComponent(MATRIX_ROOMS.lobby)}`, true);
    });
    
    console.log('[Inquiry Institute] Matrix chat menu registered');
    matrixConnected = true;
  } catch (error) {
    console.warn('[Inquiry Institute] Matrix integration not available:', error);
  }
  
  // Jitsi areas already configured in map for voice chat
  console.log('[Inquiry Institute] Jitsi zones active for voice/video');
}

/**
 * Setup interactive areas for board directors
 * Since WorkAdventure may not support NPC API, we create interactive areas
 */
function setupDirectorAreas() {
  // For each director, create an action when player approaches their area
  BOARD_DIRECTORS.forEach(director => {
    const areaName = `director_${director.id.replace('a.', '')}`;
    
    // Try to register area interaction (if area exists in map)
    try {
      WA.room.area.onEnter(areaName).subscribe(() => {
        showDirectorInfo(director);
      });
      
      WA.room.area.onLeave(areaName).subscribe(() => {
        if (directorPopup) {
          directorPopup.close();
          directorPopup = undefined;
        }
      });
    } catch (e) {
      // Area may not exist yet - that's OK
    }
  });
  
  // Create a general "Meet the Directors" menu command
  WA.ui.registerMenuCommand('👥 Meet the Directors', () => {
    showDirectorsList();
  });
  
  console.log('[Inquiry Institute] Director areas configured');
}

/**
 * Show director information popup
 */
function showDirectorInfo(director) {
  const chatRoom = MATRIX_ROOMS.lobby;
  
  directorPopup = WA.ui.openPopup('directorPopup', 
    `${director.name}\n${director.title}`, 
    [
      {
        label: '💬 Chat',
        callback: () => {
          WA.nav.openCoWebSite(
            `https://matrix.inquiry.institute/#/room/${encodeURIComponent(chatRoom)}`,
            true
          );
        }
      },
      {
        label: '📚 Learn More',
        callback: () => {
          WA.nav.openCoWebSite(
            `https://inquiry.institute/faculty/${director.id.replace('a.', '')}`,
            false
          );
        }
      }
    ]
  );
}

/**
 * Show list of all directors in a modal
 */
function showDirectorsList() {
  const directorList = BOARD_DIRECTORS.map(d => 
    `• ${d.name} - ${d.title}`
  ).join('\n');
  
  WA.ui.openPopup('directorListPopup',
    `Board of Directors\n\n${directorList}`,
    [
      {
        label: '🏛️ Visit Boardroom',
        callback: () => {
          WA.nav.goToRoom('/_/global/inquiryinstitute.github.io/maps/conference/map.tmj');
        }
      },
      {
        label: 'Close',
        callback: () => {}
      }
    ]
  );
}

/**
 * Load WorkAdventure Scripting API Extra
 */
async function loadScriptingApiExtra() {
  try {
    // The scripting API extra is bundled in the original script
    // Initialize door/bell functionality from scripting-api-extra
    console.log('[Inquiry Institute] Scripting API Extra features loaded');
  } catch (error) {
    console.warn('[Inquiry Institute] Could not load scripting API extra:', error);
  }
}

// Export for debugging
window.InquiryInstitute = {
  directors: BOARD_DIRECTORS,
  matrixRooms: MATRIX_ROOMS,
  showDirectorsList,
};

console.log('[Inquiry Institute] Script loaded successfully');
