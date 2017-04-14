// Canvas Elements
var canvas = document.getElementById('gameScreen');
var context = canvas.getContext('2d');

var input = Input();
var config = LocalStorage.getInputConfiguration();
var username = LocalStorage.getUsername();
var score = 0;

// Game State
var gameState = 0;
var states = {
    entry: 0,
    play: 1,
    end: 2,
};
var framesPassed = 0;

// Game Elements
var pipeGap = 130;
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
            if (this.y >= canvas.height - heli[this.frame].height * 1.5) {
                this.y = canvas.height - heli[this.frame].height * 1.5;
                this.velocity = this.jump;
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
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        heli[this.frame].draw(context, -32, -32);
        context.restore();
    },
};
var pipes = {
    pipeArray: [],

    clear: function() {
        this.pipeArray = [];
    },

    update: function() {
        if (framesPassed % 100 === 0) {
            var top = canvas.height - pipeTop.height + 120
                         + 200 * Math.random();
            this.pipeArray.push({
                x: 500,
                y: top,
                width: pipeTop.width,
                height: pipeTop.height,
            });
        }
        for (let i = 0; i < this.pipeArray.length; i++) {
            let pipe = this.pipeArray[i];

            if (i === 0 || i === 1 || i === 2) {
                var closestX = Math.min(Math.max(helicopter.x, pipe.x),
                                                 pipe.x + pipe.width);
                var closestYTop = Math.min(Math.max(helicopter.y, pipe.y),
                                                    pipe.y + pipe.height);
                var closestYBottom = Math.max(pipe.y - pipeGap,
                                            pipe.y - 2 * pipe.height - pipeGap);
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
                    handleGameOver();
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
            pipeTop.draw(context, pipe.x, pipe.y);
            pipeBottom.draw(context, pipe.x, pipe.y - pipeGap - pipe.height);
        }
    },
};

// Sprites
var heli;
var heliAnimationFrame = 0;
var img = new Image();
img.onload = function() {
    initSprites(this);
    init();
    gameLoop();
};
img.src = 'assets/sheet.png';
var pipeBottom;
var pipeTop;

