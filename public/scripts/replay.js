
function startReplay(index) {
  // Set up the replay
  cancelAnimationFrame(animationRequest);

  let currentReplay = replays[index];
  Math.seed = currentReplay.seed;
  console.log('Setting seed:', Math.seed);

  input = InputFeeder(currentReplay);

  resetGame();
  gameLoop();
}

// Override game over condition
handleGameOver = () => {
  explosionSound.play();

  console.log(`Player dead. Game ran at ${fps} fps`);
  gameState = states.end;
  gameOver = true;
};

input.disable();

// Creating a mock input object
function InputFeeder(replay) {
  let that = {};
  let data = replay;
  let frameCount = 0;
  let index = 0;
  let first = true;

  that.update = () => {
    if(data.jumpFrames[index] === frameCount) {
      if (first) {
        gameState = states.play;
        first = false;
      }

      if(gameState !== states.end) {
        console.log(`Doing jump ${index} out of ${data.jumpFrames.length}`);
        helicopter.processJump();
        index++;
      }
    }

    frameCount++;
  };

  that.unregisterAllCommands = () => {
  };

  return that;
}

initSprites(img);
let div = document.getElementById('replayButtons');

// Set up the replay buttons
if(replays.length === 0) {
  div.innerHTML = 'There are no replays saved yet.';
} else {
  div.innerHTML = '<ul id="replayList"></ul>';
  let list = document.getElementById('replayList');

  for(let i = 0; i < replays.length; i++) {
    let s = replays[i].score;
    let item = `<button id="replay${i}" class="btn">Score: ${s}</button>`;
    list.innerHTML += '<li>' + item + '</li>';
  }

  for(let i = 0; i < replays.length; i++) {
    document.getElementById(`replay${i}`).onclick = () => {
      startReplay(i);
    };
  }
}


