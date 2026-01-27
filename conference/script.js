/**
 * Inquiry Institute Boardroom Script
 * 
 * Features:
 * - Matrix chat integration for boardroom
 * - Board meeting functionality
 * - Interactive website area
 */

// Matrix room configuration
const MATRIX_ROOMS = {
  boardroom: '#boardroom:inquiry.institute',
  lobby: '#lobby:inquiry.institute',
};

// Board meeting state
let meetingActive = false;
let websitePopup;

// Initialize when WorkAdventure is ready
WA.onInit().then(() => {
  console.log('[Inquiry Institute] Boardroom initializing...');
  console.log('[Inquiry Institute] Player tags:', WA.player.tags);
  
  // Setup Matrix chat for boardroom
  setupMatrixChat();
  
  // Setup interactive areas
  setupInteractiveAreas();
  
  // Check if player is a board member
  checkBoardMemberStatus();
  
  console.log('[Inquiry Institute] Boardroom ready!');
}).catch(error => console.error('[Inquiry Institute] Init error:', error));

/**
 * Setup Matrix chat integration
 */
function setupMatrixChat() {
  const matrixUri = 'https://matrix.inquiry.institute';
  
  // Add Matrix boardroom chat to menu
  WA.ui.registerMenuCommand('💬 Boardroom Chat', () => {
    WA.nav.openCoWebSite(
      `${matrixUri}/#/room/${encodeURIComponent(MATRIX_ROOMS.boardroom)}`,
      true
    );
  });
  
  // Add button to return to lobby chat
  WA.ui.registerMenuCommand('🏠 Lobby Chat', () => {
    WA.nav.openCoWebSite(
      `${matrixUri}/#/room/${encodeURIComponent(MATRIX_ROOMS.lobby)}`,
      true
    );
  });
  
  console.log('[Inquiry Institute] Matrix chat registered for boardroom');
}

/**
 * Setup interactive areas
 */
function setupInteractiveAreas() {
  // Jitsi conference area is already configured in map
  // The jitsiConference area triggers on action
  
  // Website area interaction
  try {
    WA.room.area.onEnter('website').subscribe(() => {
      console.log('[Inquiry Institute] Entered website area');
    });
  } catch (e) {
    // Area may not exist
  }
  
  // Setup portal notifications
  try {
    WA.room.area.onEnter('to-office').subscribe(() => {
      WA.ui.displayActionMessage({
        message: 'Press SPACE to return to Welcome Hall',
        callback: () => {
          WA.nav.goToRoom('/_/global/inquiryinstitute.github.io/maps/office/map.tmj#from-conference');
        }
      });
    });
  } catch (e) {
    // Area may not exist
  }
}

/**
 * Check if player is a board member and provide special options
 */
function checkBoardMemberStatus() {
  const playerTags = WA.player.tags || [];
  const isBoardMember = playerTags.includes('board_director') || 
                        playerTags.includes('faculty') ||
                        playerTags.includes('admin');
  
  if (isBoardMember) {
    console.log('[Inquiry Institute] Board member detected');
    
    // Add board member specific commands
    WA.ui.registerMenuCommand('📋 Start Board Meeting', () => {
      startBoardMeeting();
    });
  }
}

/**
 * Start a board meeting
 */
function startBoardMeeting() {
  if (meetingActive) {
    WA.ui.openPopup('meetingPopup', 'A meeting is already in progress.', [
      { label: 'OK', callback: () => {} }
    ]);
    return;
  }
  
  meetingActive = true;
  
  // Broadcast to all players in room
  WA.state.meetingStarted = Date.now();
  
  WA.ui.openPopup('meetingPopup', 
    'Board Meeting Started\n\nAll participants are now connected.', 
    [
      {
        label: '💬 Open Matrix Chat',
        callback: () => {
          WA.nav.openCoWebSite(
            `https://matrix.inquiry.institute/#/room/${encodeURIComponent(MATRIX_ROOMS.boardroom)}`,
            true
          );
        }
      },
      {
        label: '🎤 Join Jitsi Call',
        callback: () => {
          // Jitsi is handled by the jitsiConference area
          WA.player.teleport(128, 200); // Teleport to Jitsi area
        }
      },
      {
        label: 'Close',
        callback: () => {}
      }
    ]
  );
  
  console.log('[Inquiry Institute] Board meeting started');
}

// Listen for meeting state changes
WA.state.onVariableChange('meetingStarted').subscribe((value) => {
  if (value && !meetingActive) {
    WA.ui.displayActionMessage({
      message: 'A board meeting has started! Press SPACE to join.',
      callback: () => {
        WA.player.teleport(128, 200);
      }
    });
  }
});

// Export for debugging
window.InquiryBoardroom = {
  matrixRooms: MATRIX_ROOMS,
  startMeeting: startBoardMeeting,
};

console.log('[Inquiry Institute] Boardroom script loaded');
