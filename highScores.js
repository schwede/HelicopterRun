
let fs = require('fs');

module.exports = (() => {
  let scores = [];
  const MAX_LENGTH = 10;
  const DATA_DIR = 'persistent';
  const DATA_FILE = 'scores.json';

  function getAll() {
    return scores;
  }

  function clearAll() {
    scores = [];
    writeScores();
  }

  function add(newScore) {
    if(newScore.username != null
    && newScore.value != null
    && newScore.location != null) {
      scores.push(newScore);
      writeScores();
      return true;
    }

    return false;
  }

  function readScores() {
    console.log('Reading the high scores');
    try {
      let jsonData = fs.readFileSync(DATA_DIR + '/' + DATA_FILE, 'utf-8');
      if (jsonData != null) {
        scores = JSON.parse(jsonData);
        sort();
        limit();
      } else {
        scores = [];
      }
    } catch (err) {
      scores = [];

      // Create the scores file and its folder if they don't exist
      if(!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
        writeScores();
      }
    }
  }

  function writeScores() {
    console.log('Writing the high scores');
    sort();
    limit();
    fs.writeFile(DATA_DIR + '/' + DATA_FILE, JSON.stringify(scores), 'utf-8');
  }

  function limit() {
    // Cap the size of the high score list
    while(scores.length > MAX_LENGTH) {
      scores.splice(scores.length - 1, 1);
    }
  }

  function sort() {
    // Sort the high scores in descending order
    scores.sort((a, b) => {
      return b.value - a.value;
    });
  }

  readScores();

  return {
    getAll: getAll,
    clearAll: clearAll,
    add: add,
  };
})();
