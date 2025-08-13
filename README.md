# memory-game
Theme: Programming

User Stories 

As a user, I want to see a landing screen with the game’s title and theme so that I know I’m in the right place.
As a user, I want to read a simple explanation of the rules so that I know how to play.
As a user, I want to see all cards face-down so I can start flipping them to find matches.
As a user, I want to click a card to reveal its coding-themed symbol so that I can try to find its pair.
As a user, I want a short delay before unmatched cards flip back so I can remember their positions.
As a user, I want matched cards to stay revealed so that I can track my progress.
As a user, I want to see my score or move count so that I can track how well I’m doing.
As a user, I want a timer so that I am aware of how much time left I have before I lose. 
As a user, I want a win message when all pairs are matched so I know the game is complete.
As a user, I want the option to restart so I can play again and try to beat my score.

Pseudocode: 

// Start game:
// Show title, theme, and instructions
// Shuffle and place cards face-down

// WHEN a card is clicked:
    // Flip the card to reveal its symbol

  // IF this is the first card selected in a turn
        // Store it as firstSelectedCard
    // ELSE
        // Store it as secondSelectedCard

  // IF firstSelectedCard matches secondSelectedCard
            // Keep both cards face-up
        // ELSE
            // Wait briefly
            // Flip both cards face-down

  // Increase move counter
 // Reset firstSelectedCard and secondSelectedCard

// AFTER each match check:
    // IF all matches are found
        // Show win message
        // Offer restart option

// WHEN restart button is clicked:
    // Shuffle cards again
    // Reset score/moves to 0
    // Hide all cards face-down
