
// Returns an object that handles all keyboard inputs
function Input() {
  let that = {};

  let keyRegistry = {};
  let keyCallbacks = [];

  let catchAllRegistry = [];
  let catchAllToProcess = [];

  // Record events triggered by the browser
  function onKeyPress(event) {
    if(keyRegistry[event.key] != null) {
      keyRegistry[event.key].forEach((callback) => {
        keyCallbacks.push(callback);
      });
    }

    catchAllToProcess.push(event);
  }

  // Add a key press registration
  that.registerKeyPress = (key, callback) => {
    if(keyRegistry[key] == null) {
      keyRegistry[key] = [];
    }

    keyRegistry[key].push(callback);
  };

  // Remove a key press registration
  that.unregisterKeyPress = (key, callback) => {
    if(keyRegistry[key] != null) {
      let index = keyRegistry[key].indexOf(callback);

      if(index !== -1) {
        keyRegistry[key].splice(index, 1);
      }
    }
  };

  // Add a catch-all registration
  that.registerCatchAllKeyPress = (callback) => {
    catchAllRegistry.push(callback);
  };

  // Remove a catch-all registration
  that.unregisterCatchAllKeyPress = (callback) => {
    let index = catchAllRegistry.indexOf(callback);

    if(index !== -1) {
      catchAllRegistry.splice(index);
    }
  };

  // Clear all the key press registrations
  that.unregisterAllCommands = () => {
    keyRegistry = {};
    catchAllRegistry = [];
  };

  // Handle all the events since last update
  that.update = () => {
    keyCallbacks.forEach((callback) => {
      callback();
    });

    catchAllRegistry.forEach((callback) => {
      catchAllToProcess.forEach((event) => {
        callback(event);
      });
    });

    keyCallbacks = [];
    catchAllToProcess = [];
  };

  window.addEventListener('keypress', onKeyPress);

  return that;
}
