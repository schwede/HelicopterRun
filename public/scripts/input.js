
// Returns an object that handles all keyboard inputs
function Input() {
  let that = {};

  let keyRegistry = {};
  let keyEvents = [];
  let catchAllRegistry = [];
  let catchAllKeys = [];

  // Record events triggered by the browser
  function onKeyPress(event) {
    if(keyRegistry[event.key] != null) {
      keyEvents.push(keyRegistry[event.key]);
    }

    catchAllKeys.push(event);
  }

  // Add a key press registration
  that.registerKeyPress = (key, callback) => {
    keyRegistry[key] = callback;
  };

  // Remove a key press registration
  that.unregisterKeyPress = (key, callback) => {
    delete keyRegistry[key];
  };

  // Add a catch-all registration
  that.registerCatchAllKeyPress = (callback) => {
    catchAllRegistry.push(callback);
  };

  // Remove a catch-all registration
  that.unregisterCatchAllKeyPress = (callback) => {
    let index = catchAllRegistry.indexOf(callback);
    if(index >= 0) {
      catchAllRegistry.splice(index, 1);
    }
  };

  // Clear all the key press registrations
  that.unregisterAllCommands = () => {
    keyRegistry = {};
    catchAllRegistry = [];
  };

  // Handle all the events since last update
  that.update = () => {
    keyEvents.forEach((callback) => {
      callback();
    });

    catchAllRegistry.forEach((callback) => {
      catchAllKeys.forEach((keyEvent) => {
        callback(keyEvent);
      });
    });

    keyEvents = [];
    catchAllKeys = [];
  };

  window.addEventListener('keypress', onKeyPress);

  return that;
}
