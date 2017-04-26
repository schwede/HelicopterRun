
// This the entry point for the game
img.onload = function() {
    initSprites(this);
    init();
    gameLoop();
};
