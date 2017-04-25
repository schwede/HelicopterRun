
function startReplay(index) {
  console.log('Running replay:', index);
}

let replays = LocalStorage.getReplays();
let div = document.getElementById('replayButtons');

if(replays.length === 0) {
  div.innerHTML = 'There are no replays saved yet.';
} else {
  div.innerHTML = '<ul id="replayList"></ul>';
  let list = document.getElementById('replayList');

  for(let i = 0; i < replays.length; i++) {
    let s = replays[i].score;
    let item = `<button id="replay${i}" class="btn">Score: ${s}</button>`;
    list.innerHTML += '<li>' + item + '</li>';
  }

  for(let i = 0; i < replays.length; i++) {
    console.log('registering callback on', `replay${i}`);
    document.getElementById(`replay${i}`).onclick = () => {
      startReplay(i);
    };
  }
}


