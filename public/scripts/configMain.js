
(() => {
  let input = Input();
  let config = LocalStorage.getInputConfiguration();
  let keys = ['start', 'thrust', 'pause'];
  let selected = 'none';

  function init() {
    console.log('Initializing page.');

    keys.forEach((key) => {
      // Register callback for button click
      document.getElementById(key).onclick = () => {
        selected = key;
      };

      // Initialize label with value from local storage
      let labelId = key + 'Label';
      let text = '\'' + config[key] + '\'';
      document.getElementById(labelId).innerText = text;
    });

    // Register key presses from the input subsystem
    input.registerCatchAllKeyPress((event) => {
      if(selected !== 'none') {
        config[selected] = event.key;

        let id = selected + 'Label';
        document.getElementById(id).innerText = '\'' + event.key + '\'';
      }
    });

    // Handle selecting which item to change
    document.getElementById('save').onclick = () => {
      selected = 'none';
      LocalStorage.saveInputConfiguration(config);
    };
  }

  // Spin and check for input
  function loop() {
    input.update();
    requestAnimationFrame(loop);
  }

  init();
  requestAnimationFrame(loop);
})();
