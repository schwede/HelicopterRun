var lastFire = performance.now();
var fps = 0;
var lastSecond = 0;
var totalTime = 0;

function init() {
  Math.seed = Math.round(performance.now());
  console.log('Generating seed:', Math.seed);
  replay.seed = Math.seed;

  input.registerKeyPress(config.thrust, () => {
    if(gameState != states.end) {
      gameState = states.play;

      replay.jumpFrames.push(framesPassed);
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
  explosionSound.play();

  // Server determines whether the score belongs on the leaderboard
  sendScore();

  console.log(`Player dead. Game ran at ${fps} fps`);
  let best = LocalStorage.getPersonalBest();
  if(score > best) {
    LocalStorage.savePersonalBest(score);

    // Keep the replay if you broke your record
    replay.score = score;
    replays.push(replay);
    LocalStorage.saveReplays(replays);
  }

  gameState = states.end;
  gameOver = true;
}

function handleDied() {
  input.unregisterAllCommands();
}

function gameLoop() {
  var timePassed = performance.now() - lastFire;
  totalTime += timePassed;
  lastSecond += timePassed;

  if(lastSecond >= 1000) {
    fps = Math.round(framesPassed / (totalTime / 1000));
    lastSecond = 0;
  }

  update(timePassed);
  render(timePassed);

  animationRequest = requestAnimationFrame(gameLoop);
  lastFire = performance.now();
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
  drawBackground(context);
  pipes.draw(context);
  drawForeground(context);
  helicopter.draw(context);
  drawExplosion(context);
  drawScore(context);
}
