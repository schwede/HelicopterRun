
// Creates a single, global local storage database handler
let LocalStorage = (() => {
  let that = {};

  // Key names for the local storage
  let CONFIG_KEY = 'inputConfig';
  let SCORE_KEY = 'bestScore';
  let USERNAME_KEY = 'userName';

  // Default value for personal best bestScore
  let score = 0;

  // Default username
  let username = 'default';

  // Default configuration for input controls
  let config = {
    start: ' ',
    thrust: ' ',
    pause: 'p',
  };

  // Check whether score is valid
  function validatePersonalBest(value) {
    return value >= 0 && value <= 1000;
  }

  // Check if whether the right keys exist
  function validateInputConfiguration(config) {
    return config.start != null
      && config.thrust != null
      && config.pause != null;
  }

  // Get the username from the local storage if it exists
  that.getUsername = () => {
    let raw = localStorage.getItem(USERNAME_KEY);

    if(raw != null) {
      username = JSON.parse(raw);
    }

    return username;
  };

  // Get the personal best score from the local storage if it exists
  that.getPersonalBest = () => {
    let raw = localStorage.getItem(SCORE_KEY);

    if(raw !== null) {
      let temp = JSON.parse(raw);

      if(validatePersonalBest(temp)) {
        score = temp;
      }
    }

    return score;
  };

  // Get the configuration from local storage if it exists
  that.getInputConfiguration = () => {
    let raw = localStorage.getItem(CONFIG_KEY);

    if(raw !== null) {
      let temp = JSON.parse(raw);

      if(validateInputConfiguration(temp)) {
        config = temp;
      }
    }

    console.log('Retrieved input configuration');
    return config;
  };

  // Save the personal best as long as it's valid
  that.savePersonalBest = (newScore) => {
    if(validatePersonalBest(newScore)) {
      localStorage[SCORE_KEY] = JSON.stringify(newScore);
      console.log('Saved personal best of', newScore);
    }
  };

  // Save the username
  that.saveUsername = (name) => {
    localStorage[USERNAME_KEY] = JSON.stringify(name);
    console.log('Saved username');
  };

  // Save the configuration to local storage as long as it's valid
  that.saveInputConfiguration = (config) => {
    if(validateInputConfiguration(config)) {
      localStorage[CONFIG_KEY] = JSON.stringify(config);
      console.log('Saved input configuration');
    }
  };

  return that;
})();
