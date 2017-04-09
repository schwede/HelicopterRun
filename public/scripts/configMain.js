
(() => {
  let input = Input();
  let config = LocalStorage.getInputConfiguration();
  let keys = ['start', 'thrust', 'pause'];
  let selected = 'none';

  function clearBold() {
    keys.forEach((otherKey) => {
      let labelId = otherKey + 'Label';
      document.getElementById(otherKey).style.fontWeight = 'normal';
      document.getElementById(labelId).style.fontWeight = 'normal';
    });
  }

  // Make the selected item bold
  function setBold(key) {
    clearBold();

    let labelId = key + 'Label';
    document.getElementById(key).style.fontWeight = 'bold';
    document.getElementById(labelId).style.fontWeight = 'bold';
  }

  function init() {
    console.log('Initializing page.');

    keys.forEach((key) => {
      // Register callback for button click
      document.getElementById(key).onclick = () => {
        selected = key;
        setBold(key);
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
      clearBold();
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
