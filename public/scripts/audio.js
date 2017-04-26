
function SoundEffect(spec) {
  let that = {};

  let audoObj = new Audio(spec.source);

  if(spec.loop != null) {
    audoObj.loop = spec.loop;
  } else {
    audoObj.loop = false;
  }

  if(spec.volume != null) {
    audoObj.volume = spec.volume;
  } else {
    audoObj.volume = 0.1;
  }

  that.play = () => {
    audoObj.currentTime = 0;
    audoObj.play();
  };

  that.pause = () => {
    audoObj.pause();
  };

  return that;
}
