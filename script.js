let currentSong = new Audio();
let currfolder;
let songs;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img src="img/music.svg" class="invert" alt="">
              <div class="info">
                <div> ${song}</div>
                <div>Daman</div>
              </div>
              <div class="playnow">
                <span>Play Now</span>
                <img src="img/play.svg" class="invert" alt="">

              </div>
    
   </li>`;
  }
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  // audio.play()
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  Array.from(anchors).forEach(async (e) => {
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-1)[0];

           let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
           let response = await a.json();


      cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card ">
                <div class="play"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%"
                    fill="none">
                    <path fill="#000"
                      d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                      stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                  </svg>

                </div>
                <img src="/songs/${folder}/cover.jpeg" alt="">
                <h2>${response.title}</h2>
              q <p>${response.description}</p>
              </div>`
    }
     Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
  });
}

async function main() {
  await getsongs("songs/Allsongs");
  playMusic(songs[0], true); // Play the first song by default

  displayAlbum();

  play.addEventListener("click", (e) => {
    console.log("play button clicked");
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}${" / " + secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume>0) 
        {
        
          document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace ("img/mute.svg","img/volume.svg")
      }
    });
   document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target)
    if (e.target.src.includes("volume.svg")) {
      e.target.src = "img/mute.svg";
      currentSong.muted = true;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      currentSong.volume = 0;
    } else {
      e.target.src = "img/volume.svg";
      currentSong.muted = false;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 100;  
      currentSong.volume = 0.4;
    }
   })
}
main();
