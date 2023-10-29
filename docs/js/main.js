let videoId;
let playerReady = false;
const thumb = document.querySelector('.thumbnail');
const title = document.querySelector('.title');

const controls = document.querySelector('.controls');
const play_btn = document.querySelector('.play');
const restart_btn = document.querySelector('.restart');
// const welcome = document.querySelector('.welcome');
const errorNotice = document.querySelector('.error-notice');

play_btn.addEventListener('click', playPausePress);
restart_btn.addEventListener('click', restart);

loadVideo(idFromUrl());

// setTimeout(() => {
//   if (!playerReady) {
//     errorNotice.classList.remove('hidden');
//   }
// }, 3000);

function loadVideo(id) {
  videoId = id;

  // If no video id is provided in url
  if(videoId == null){
    // show(welcome);
    // Set default title
    var mTitle = document.createElement('title');
    mTitle.innerText = "YT Music Mode";
    document.head.appendChild(mTitle);
    return;
  }

  setThumbnail();

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

function idFromUrl() {
  var match = window.location.search.match(/id=(.*)/);
  if(match == null || match.length != 2){
    return null;
  }
  return match[1];
}

function setThumbnail() {
  var thumb = document.querySelector('.thumbnail');
  thumb.style.backgroundImage = "url('https://img.youtube.com/vi/" + videoId + "/0.jpg')"
}

function showTitle() {
  // Setting title text
  var text = player.getVideoData().title;
  title.innerText = text;

  // Setting meta title
  var mTitle = document.createElement('title');
  mTitle.innerText = text;
  document.head.appendChild(mTitle);
}

function playPausePress() {
  if(play_btn.classList.contains('pause')){
    pause();
  } else {
    play();
  }
}

function updateProgress() {
  requestAnimationFrame(updateProgress);

  var percent = (player.getCurrentTime() / duration) * 100;
  controls.style.background = "linear-gradient(to right, indianred " + percent + "%, rgba(255, 255, 255, 0.15) 0%)";
}

function play() {
  play_btn.style.backgroundImage = "url('img/pause.svg')";
  play_btn.classList.add('pause');
  player.playVideo();
}

function pause() {
  play_btn.style.backgroundImage = "url('img/play.svg')";
  play_btn.classList.remove('pause');
  player.pauseVideo();
}

function restart() {
  if(restart_btn.classList.contains('spin')){
    return;
  }
  show(play_btn);

  restart_btn.classList.add('spin');
  player.seekTo(0);
  play();

  setTimeout(function(){
    restart_btn.classList.remove('spin');
  }, 700);
}

function hide(element) {
  element.classList.add('hidden');
}

function show(element) {
  element.classList.remove('hidden');
}

function fadeIn(element) {
  element.classList.add('fade-in');
}



window.onload = function() {
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get('id');

  if(videoId == null){
    // SHOW THE FORM
    errorNotice.classList.remove('hidden');

    // Check if the form exists
    var form = document.querySelector('#youtube-form');
    if (form) {
      // Handle form submission
      form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from being submitted

        var input = document.querySelector('#youtube-link');
        var link = input.value.trim(); // Get the value of the input field and remove leading/trailing spaces

        // Check if the link is a valid YouTube link
        var regex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
        var match = link.match(regex);

        if (match) {
          var videoId = match[3]; // Extract the video ID from the matched link
          window.location.href = window.location.origin + window.location.pathname + '?id=' + videoId;
        } else {
          alert('Invalid YouTube link! Please enter a valid link.'); // Display an error message for an invalid link
        }
      });
    }
  }else{
    setTimeout(() => {
      if (playerReady) {
        // Retrieve the existing recent videos from local storage
        var recentVideos = JSON.parse(localStorage.getItem('recentVideos')) || [];

        // Remove the video ID if it already exists in the recent videos array
        recentVideos = recentVideos.filter(function(item) {
          return item.id !== videoId;
        });

        // Add the new video object at the beginning of the recent videos array
        recentVideos.unshift({ id: videoId, title: player.getVideoData().title });

        // Keep only the most recent 5 videos
        recentVideos = recentVideos.slice(0, 5);

        // Store the updated recent videos array in local storage
        localStorage.setItem('recentVideos', JSON.stringify(recentVideos));
      }
    }, 3000);
  }

  // SHOW RECENT VIDEOS
  var recentVideo = document.getElementById('recent-video');
  recentVideo.innerHTML = '';
  // Retrieve the recent videos from local storage
  var recentVideos = JSON.parse(localStorage.getItem('recentVideos'));

  if (recentVideos && recentVideos.length > 0) {
    // Display the titles and links of the recently played videos
    var recentVideosHtml = 'Recently Played:<br>';

    for (var i = 0; i < recentVideos.length; i++) {
      recentVideosHtml += '<p><a href="?id=' + recentVideos[i].id + '">' + recentVideos[i].title + '</a></p>';
    }

    recentVideo.innerHTML = recentVideosHtml;
  }
};