// Sprite class
function Sprite(img, x, y, width, height) {
	this.img = img;
	this.x = x*2;
	this.y = y*2;
	this.width = width*2;
	this.height = height*2;
};

// Draw a sprite on the canvas
Sprite.prototype.draw = function(context, x, y) {
	context.drawImage(this.img, this.x, this.y, this.width, this.height,
		x, y, this.width, this.height);
};

// Initiate sprites on image load
function initSprites(img) {
	heli = [
		new Sprite(img, 0, 0, 32, 32),
        new Sprite(img, 32, 0, 32, 32),
        new Sprite(img, 64, 0, 32, 32),
        new Sprite(img, 96, 0, 32, 32),
        new Sprite(img, 128, 0, 32, 32),
        new Sprite(img, 0, 32, 32, 32),
        new Sprite(img, 32, 32, 32, 32),
        new Sprite(img, 64, 32, 32, 32),
        new Sprite(img, 96, 32, 32, 32),
	];
	pipeTop = new Sprite(img, 251, 0, 26, 200);
	pipeBottom = new Sprite(img, 277, 0, 26, 200);
	background = new Sprite(img, 310, 0, 500, 500);
	foreground = new Sprite(img, 310, 250, 500, 500);
}
