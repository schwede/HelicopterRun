
function Input() {
  let that = {};

  let keyRegistry = {};
  let keyEvents = [];
  let catchAllRegistry = [];
  let catchAllKeys = [];

  function onKeyPress(event) {
    if(keyRegistry[event.key] != null) {
      keyEvents.push(keyRegistry[event.key]);
    }

    catchAllKeys.push(event);
  }

  that.registerKeyPress = (key, callback) => {
    keyRegistry[key] = callback;
  };

  that.unregisterKeyPress = (key, callback) => {
    delete keyRegistry[key];
  };

  that.registerCatchAllKeyPress = (callback) => {
    catchAllRegistry.push(callback);
  };

  that.unregisterCatchAllKeyPress = (callback) => {
    let index = catchAllRegistry.indexOf(callback);
    if(index >= 0) {
      catchAllRegistry.splice(index, 1);
    }
  };

  that.unregisterAllCommands = () => {
    keyRegistry = {};
    catchAllRegistry = [];
  };

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
