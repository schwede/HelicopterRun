var lastFire = performance.now();

function gameLoop () {
  var timePassed = performance.now() - lastFire;
  lastFire = performance.now();
  update(timePassed);
  render(timePassed);
  requestAnimationFrame(gameLoop);
}

function update (timePassed) {

}

function render (timePassed) {

}