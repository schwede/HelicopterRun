var lastFire = performance.now();
document.addEventListener('keypress', getInput);

function gameLoop() {
  var timePassed = performance.now() - lastFire;
  lastFire = performance.now();
  update(timePassed);
  render(timePassed);
  requestAnimationFrame(gameLoop);
}

function update(timePassed) {
  framesPassed++;
  helicopter.update();
  if (gameState === states.play) {
      pipes.update();
  }
}

function getInput(event) {
  switch (gameState) {
    case states.entry:
      gameState = states.play;
      helicopter.processJump();
      break;

    case states.play:
      helicopter.processJump();
      break;

    case states.end:
      break;

  }
}

function render(timePassed) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  helicopter.draw(context);
  pipes.draw(context);
}
