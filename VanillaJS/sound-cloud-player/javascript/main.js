const sidebar = document.querySelector('#js-playlist');
sidebar.innerHTML = localStorage.getItem('playlist');

const resetButton = document.querySelector('#js-reset');
resetButton.addEventListener('click', () => {
  localStorage.clear();
  sidebar.innerHTML = null;
})
/* 1. 검색 */

const inputArea = document.querySelector('.js-search');
inputArea.addEventListener('keyup', e => {
  if (e.which === 13) SoundCloudAPI.getTracks(inputArea.value);
});

const searchButton = document.querySelector('.js-submit');
searchButton.addEventListener( 'click', () => {
  SoundCloudAPI.getTracks(inputArea.value);
});



/* 2. SoundCloud API  사용하기 */
const SoundCloudAPI = {
  init: () => {
    SC.initialize({
      client_id: "cd9be64eeb32d1741c17cb39e41d254d"
    });
  },

  getTracks: inputValue => {
    SC.get("/tracks", {
      q: inputValue
    }).then(function(tracks) {
      SoundCloudAPI.renderTracks(tracks);
    });
  }
};

SoundCloudAPI.init();

/* 3. 카드 보여주기 */
SoundCloudAPI.renderTracks = tracks => {
  let searchResults = document.querySelector('#js-search-results');
  searchResults.innerHTML = null;
  tracks.forEach((track) => {
    // Card
    const card = document.createElement("div");
    card.classList.add("card");

    // Image
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("image");

    const imageImg = document.createElement("img");
    imageImg.classList.add("image_img");
    imageImg.src = (track.artwork_url || 'http://lorempixel.com/100/100/abstract')
    
    // Content
    const content = document.createElement("div");
    content.classList.add("content");

    // Header
    const header = document.createElement("div");
    header.classList.add("header");

    const link = document.createElement("a");
    link.href = track.permalink_url;
    link.target = "_blank"; // new tab
    link.innerHTML = track.title;

    // Button
    const button = document.createElement("div");
    button.classList.add("ui", "bottom", "attached", "button", "js-button");
    button.addEventListener('click', (e) => {
      SoundCloudAPI.addPlaylist(track.permalink_url);
    });

    const icon = document.createElement("i");
    icon.classList.add("add", "icon");

    const buttonText = document.createElement("span");
    buttonText.innerHTML = "Add to playlist";

    // 조립!
    imageDiv.appendChild(imageImg);

    header.appendChild(link);
    content.appendChild(header);

    button.appendChild(icon);
    button.appendChild(buttonText);

    card.appendChild(imageDiv);
    card.appendChild(content);
    card.appendChild(button);

    searchResults.appendChild(card);
  });
};


/* 4. Playlist 에 추가하고 실제로 재생하기 */

SoundCloudAPI.addPlaylist = (trackURL) => {
  SC.oEmbed(trackURL, {
    auto_play: true
  }).then(function(embed){
    const playbox = document.createElement('div');
    playbox.innerHTML = embed.html
    sidebar.insertBefore(playbox, sidebar.firstChild)

    // local storage
    localStorage.setItem('playlist', sidebar.innerHTML);
    console.log(logStorage);
  });
};
