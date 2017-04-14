var lastFire = performance.now();

function init() {
  input.registerKeyPress(config.thrust, () => {
    if(gameState != states.end) {
      gameState = states.play;
      helicopter.processJump();
    }
  });
}

function sendScore() {
    let url = window.location.origin + '/api/addHighScore';

    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        username: username,
        value: score,
        location: {
          x: 0,
          y: 0,
        },
      }),
    });

    // Fetch api uses promises and callbacks
    fetch(request).then((requestPromise) => {
      return requestPromise.text();
    }).then((response) => {
      console.log(response);
      return response;
    }).catch((err) => {
      console.log('Could not reach api:', err);
    });
}

function handleGameOver() {
  console.log('Game over condition');
  input.unregisterAllCommands();

  sendScore();

  let best = LocalStorage.getPersonalBest();
  if(score > best) {
    LocalStorage.savePersonalBest(score);
  }
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
