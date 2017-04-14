var lastFire = performance.now();

function init() {
  input.registerKeyPress(config.thrust, () => {
    if(gameState != states.end) {
      gameState = states.play;
      helicopter.processJump();
    }
  });
}

function gameLoop() {
  var timePassed = performance.now() - lastFire;
  lastFire = performance.now();
  update(timePassed);
  render(timePassed);
  requestAnimationFrame(gameLoop);
}

function update(timePassed) {
  framesPassed++;
  input.update();
  helicopter.update();
  if (gameState === states.play) {
      pipes.update();
  }
}

function render(timePassed) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  pipes.draw(context);
  helicopter.draw(context);
}
