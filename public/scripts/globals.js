// Canvas Elements
var canvas = document.getElementById('gameScreen');
var context = canvas.getContext('2d');

var input = Input();
var config = LocalStorage.getInputConfiguration();
var username = LocalStorage.getUsername();
var replays = LocalStorage.getReplays();
var explosionSound = SoundEffect({
    source: 'audio/explosion.mp3',
});
var wooshSound = SoundEffect({
    source: 'audio/woosh.mp3',
});
var score = 0;
var gameOver = false;

var replay = {
    jumpFrames: [],
};

// Particle options
const particlesPerExplosion = 30;
const particlesMinSpeed = 3;
const particlesMaxSpeed= 10;
const particlesMinSize = 1;
const particlesMaxSize = 5;
const explosions = [];

// Game State
var gameState = 0;
var states = {
    entry: 0,
    play: 1,
    end: 2,
};
var framesPassed = 0;

function resetGame() {
    framesPassed = 0;
    resetExplosions();
    resetHelicopter();
    resetPipes();
    resetTimers();

    gameState = states.entry;
    gameOver = false;
}

function resetTimers() {
    lastFire = performance.now();
    lastSecond = 0;
    totalTime = 0;
}

function resetPipes() {
    pipeNumber = 0;
    pipes.clear();
}

function resetExplosions() {
    explosions.splice(0, explosions.length);
}

function resetHelicopter() {
    helicopter.x = 80;
    helicopter.y = canvas.height - 270 + 5;
    helicopter.frame = 0;
    helicopter.bladeSpeed = 5;
    helicopter.velocity = 0;
}

// Game Elements
var pipeGap = 130;
var pipeNumber = 0;
var ghosts;
var helicopter = {
    x: 80,
    y: 0,
    frame: 0,
    bladeSpeed: 0,
    rotation: 0,
    radius: 27,
    gravity: 0.25,
    jump: 4.6,
    velocity: 0,
    processJump: function() {
		wooshSound.play();
        this.bladeSpeed = 5;
        this.velocity = -this.jump;
    },
    update: function() {
        // Auto fly if game has not started
        if (gameState === states.entry) {
            // Update animation frame
            this.frame += 1;
            if (this.frame > 8) {
                this.frame = 0;
            }
            // Update height
            this.y = canvas.height - 270 + 5 * Math.cos(framesPassed/15);
        } else {
            // Update height and velocity
            this.velocity += this.gravity;
            this.y += this.velocity;
            if (this.y >= canvas.height - heli[this.frame].height * 1.1) {
                this.y = canvas.height - heli[this.frame].height * 1.1;
                this.velocity = this.jump;
                if (this.y == canvas.height - heli[this.frame].height * 1.1 &&
                    !gameOver) {
                    explosions.push(
                        new explosion(helicopter.x, helicopter.y)
                    );
                    explosions.push(
                        new explosion(helicopter.x + randInt(0, 15, true),
                         helicopter.y)
                    );
                    explosions.push(
                        new explosion(helicopter.x, helicopter.y -
                        randInt(0, 15, true))
                    );
                    handleGameOver();
                }
            }
            if (this.y <= 0) {
                gameState = states.end;
            }
            // Update animation frame
            if (this.bladeSpeed > 4) {
                this.frame += 3;
                if (this.frame > 8) {
                    this.frame = 0;
                }
                this.bladeSpeed -= .05;
            } else if (this.bladeSpeed > 3) {
                this.frame += 2;
                if (this.frame > 8) {
                    this.frame = 0;
                }
                this.bladeSpeed -= .05;
            } else if (this.bladeSpeed > 2) {
                this.frame += 1;
                if (this.frame > 8) {
                    this.frame = 0;
                }
                this.bladeSpeed -= .05;
            }
            // Update rotation
            if (this.velocity >= this.jump &&
                this.y < canvas.height - heli[this.frame].height * 1.5) {
                this.rotation = Math.min(Math.PI/2, this.rotation + 0.05);
            } else if (this.y < canvas.height - heli[this.frame].height * 1.5) {
                this.rotation = -0.2;
            } else {

            }
        }
    },
    draw: function(context) {
        if (!gameOver) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.rotation);
            heli[this.frame].draw(context, -32, -32);
            context.restore();
        }
    },
};
var pipes = {
    pipeArray: [],

    clear: function() {
        this.pipeArray = [];
    },

    update: function() {
        if (framesPassed % 100 === 0) {
            let currentGhosts = [];
            ghosts.forEach((score) => {
                if (score.value == pipeNumber) {
                    currentGhosts.push(score.username);
                }
            });
            var top = canvas.height - pipeTop.height + 120
                         + 200 * seededRandom();
            this.pipeArray.push({
                x: 500,
                y: top,
                width: pipeTop.width,
                height: pipeTop.height,
                ghosts: currentGhosts,
            });
            pipeNumber += 1;
        }
        for (let i = 0; i < this.pipeArray.length; i++) {
            let pipe = this.pipeArray[i];

            if (i === 0 || i === 1 || i === 2) {
                var closestX = Math.min(Math.max(helicopter.x, pipe.x),
                                                 pipe.x + pipe.width);
                var closestYTop = Math.min(Math.max(helicopter.y, pipe.y),
                                                    pipe.y + pipe.height);
                var closestYBottom = Math.min(helicopter.y, pipe.y - pipeGap);
                var distanceX = helicopter.x - closestX;
                var distanceTop = helicopter.y - closestYTop;
                var distanceBottom = helicopter.y - closestYBottom;
                var circleDistance = distanceX * distanceX +
                                     distanceTop * distanceTop;
                var circleDistance2 = distanceX * distanceX +
                                      distanceBottom * distanceBottom;
                var radius = helicopter.radius * helicopter.radius;
                if (radius > circleDistance2 || radius > circleDistance) {
                    gameState = states.end;
                    handleDied();
                }
            }
            pipe.x -= 2;
            if (pipe.x < -50) {
                this.pipeArray.splice(i, 1);
                score++;
                i--;
            }
        }
    },
    draw: function() {
        for (let i = 0; i < this.pipeArray.length; i++) {
            let pipe = this.pipeArray[i];
            let ghostY = 30;
            pipeTop.draw(context, pipe.x, pipe.y);
            pipeBottom.draw(context, pipe.x, pipe.y - pipeGap - pipe.height);
            for (let j = 0; j < pipe.ghosts.length; j++) {
                context.font = '15px Arial';
                context.fillStyle = 'white';
                context.fillText(pipe.ghosts[j], pipe.x + 5, ghostY);
                ghostY += 25;
            }
        }
    },
};

// Sprites
var heli;

var img = new Image();
img.src = 'assets/newSheet.png';

var pipeBottom;
var pipeTop;
var background;
var foreground;

// Particle functions
function drawExplosion(context) {
  if (explosions.length === 0) {
    return;
  }
  for (let i = 0; i < explosions.length; i++) {
    const explosion = explosions[i];
    const particles = explosion.particles;
    if (particles.length === 0) {
      explosions.splice(i, 1);
      return;
    }
    const particlesAfterRemoval = particles.slice();
    for (let j = 0; j < particles.length; j++) {
      const particle = particles[j];
      if (particle.size <= 0) {
        particlesAfterRemoval.splice(j, 1);
        continue;
      }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
      context.closePath();
      context.fillStyle = 'rgb(' + particle.r + ','
                        + particle.g + ',' + particle.b + ')';
      context.fill();
      particle.x += particle.xv;
      particle.y += particle.yv;
      particle.size -= .1;
    }
    explosion.particles = particlesAfterRemoval;
  }
}


// Explosion class
function explosion(x, y) {
  this.particles = [];
  for (let i = 0; i < particlesPerExplosion; i++) {
    this.particles.push(
      new particle(x, y, 'red')
    );
    this.particles.push(
      new particle(x, y, 'orange')
    );
    this.particles.push(
      new particle(x, y, 'white')
    );
  }
}

// Particle class
function particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.size = randInt(particlesMinSize, particlesMaxSize, true);
  if (color === 'red') {
    this.r = randInt(113, 222);
    this.g = '00';
    this.b = randInt(0, 50);
  } else if (color === 'orange') {
    this.r = '244';
    this.g = randInt(101, 200);
    this.b = '66';
  } else if (color === 'white') {
    this.r = '222';
    this.g = '222';
    this.b = '222';
  }
}

// Credit: http://indiegamr.com/generate-repeatable-random-numbers-in-js/
function seededRandom() {
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    return Math.seed / 233280.0;
}

function randInt(min, max, positive) {
  let num;
  if (positive === false) {
    num = Math.floor(Math.random() * max) - min;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  } else {
    num = Math.floor(Math.random() * max) + min;
  }
  return num;
}

// Get High Scores
let url = window.location.origin + '/api/getHighscores';
let request = new Request(url, {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
});

// Fetch api uses promises and callbacks
fetch(request).then((requestPromise) => {
  return requestPromise.json();
}).then((response) => {
  fillGhosts(response);
  return response;
}).catch((err) => {
  console.log('Could not reach api:', err);
});


function fillGhosts(highScores) {
  ghosts = highScores;
}

// Background and foreground
function drawBackground(context) {
    background.draw(context, 0, 0);
}

function drawForeground(context) {
    foreground.draw(context, 0, canvas.height - heli[0].height * 1.1);
}

