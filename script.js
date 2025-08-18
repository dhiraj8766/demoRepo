let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Screen Wake Lock activated");
    wakeLock.addEventListener("release", () => {
      console.log("Wake Lock released");
    });
  } catch (err) {
    console.error(`Wake Lock error: ${err.name}, ${err.message}`);
  }
}

document.addEventListener("visibilitychange", () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
});

function toggleSound(id, btn) {
  const audio = document.getElementById(id);
  if (audio.paused) {
    audio.play();
    btn.textContent = "⏸";
  } else {
    audio.pause();
    btn.textContent = "▶️";
  }
}

function setVolume(id, volume) {
  document.getElementById(id).volume = volume;
}

let allPlaying = false;

function toggleAll() {
  const allAudios = document.querySelectorAll("audio");
  const allButtons = document.querySelectorAll(".play-btn");
  const btn = document.getElementById("toggle-all");

  if (!allPlaying) {
    allAudios.forEach((audio, index) => {
      audio.play();
      allButtons[index].textContent = "⏸";
    });
    btn.textContent = "⏸ Stop All";
    btn.classList.add("off");
    allPlaying = true;
  } else {
    allAudios.forEach((audio, index) => {
      audio.pause();
      audio.currentTime = 0;
      allButtons[index].textContent = "▶️";
    });
    btn.textContent = "🔊 Play All";
    btn.classList.remove("off");
    allPlaying = false;
  }
}

window.addEventListener("load", () => {
  requestWakeLock();

  const allAudios = document.querySelectorAll("audio");
  allAudios.forEach(audio => {
    audio.volume = 0.5;
    audio.play().catch(() => {
      document.body.addEventListener("click", () => {
        audio.play();
      }, { once: true });
    });
  });
});
