
// Creates a single, global local storage database handler
let LocalStorage = (() => {
  let that = {};

  // Key name in the local storage
  let CONFIG_KEY = 'inputConfig';

  // Default configuration for input controls
  let config = {
    start: ' ',
    thrust: ' ',
    pause: 'p',
  };

  // Check if whether the right keys exist
  function validateInputConfiguration(config) {
    return config.start != null
      && config.thrust != null
      && config.pause != null;
  }

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

  // Save the configuration to local storage as long as it's valid
  that.saveInputConfiguration = (config) => {
    if(validateInputConfiguration(config)) {
      localStorage[CONFIG_KEY] = JSON.stringify(config);
      console.log('Saved input configuration');
    }
  };

  return that;
})();
