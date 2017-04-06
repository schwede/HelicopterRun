
let LocalStorage = (() => {
  let that = {};

  that.getInputConfiguration = () => {
    console.log('Retrieved input configuration');
    return {
      start: ' ',
      thrust: ' ',
      pause: 'p',
    };
  };

  that.saveInputConfiguration = (config) => {
    console.log('Saved input configuration');
  };

  return that;
})();
