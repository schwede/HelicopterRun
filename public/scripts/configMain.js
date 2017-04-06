
(() => {
  let input = Input();
  let config = LocalStorage.getInputConfiguration();
  let selected = 'none';

  function init() {
    console.log('Initializing page.');

    input.registerCatchAllKeyPress((event) => {
      console.log('Keypress: \'', event.key, '\'');

      if(selected !== 'none') {
        config[selected] = event.key;
        LocalStorage.saveInputConfiguration(config);
      }
    });
  }

  function loop() {
    input.update();
    requestAnimationFrame(loop);
  }

  init();
  requestAnimationFrame(loop);
})();
