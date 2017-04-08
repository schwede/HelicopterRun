
(() => {
  let lastTime = performance.now();
  let timeOut = 1000 * 1;
  let highScores = [];

  function requestScores() {
    let url = window.location.origin + '/api/getHighscores';
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');

    let request = new Request(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    fetch(request).then((requestPromise) => {
      return requestPromise.json();
    }).then((response) => {
      highScores = response;

      console.log('Got the scores!');
      renderScores();
    }).catch((err) => {
      console.log('Could not reach api:', err);
    });
  }

  function renderScores() {
    scoresElement = document.getElementById('scores-list');
    scoresElement.innerHTML = '';

    highScores.forEach((score) => {
      let entry = '<li>' + score.username + ': ' + score.value + '</li>';
      scoresElement.innerHTML += entry;
   });
  }

  function init() {
    console.log('Initializing page.');
    requestScores();
  }

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
