
(() => {
  let lastTime = performance.now();
  let timeOut = 1000;
  let highScores = [];

  // Make a fetch request from the api for the scores
  function requestScores() {
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
      highScores = response;
      renderScores();
    }).catch((err) => {
      console.log('Could not reach api:', err);
    });
  }

  // Display the scores formatted onto the DOM
  function renderScores() {
    scoresElement = document.getElementById('scores-list');
    scoresElement.innerHTML = '';

    highScores.forEach((score) => {
      let entry = '<li>' + score.username + ': ' + score.value + '</li>';
      scoresElement.innerHTML += entry;
   });
  }

  // Set up the page with current high scores
  function init() {
    console.log('Initializing page.');
    requestScores();
  }

  // Spin and request the scores again after the timeout
  function loop() {
    let currentTime = performance.now();

    if(currentTime - lastTime > timeOut) {
      console.log('Checking for new scores...');
      requestScores();

      lastTime = currentTime;
    }

    requestAnimationFrame(loop);
  }

  init();
  requestAnimationFrame(loop);
})();
