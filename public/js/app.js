//API Controller
const APIController = (function () {
  let currentPlaylistID = "";

  //function for receiving an access token
  const _getAccessToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    const url = "https://accounts.spotify.com/api/token";
    const clientId = "350bb843292c48ae8ecece947c2ed01d";
    const redirectUri = "http://localhost:3000/playlist-creator.html";

    let codeVerifier = window.sessionStorage.getItem("code_verifier");

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response.access_token);
    return response.access_token;
  };

  //gets top artists object
  const _getTopArtists = async (accessToken, timePeriod, limit) => {
    const result = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timePeriod}&limit=${limit}&offset=0`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await result.json();
    console.log(data);
    return data.items;
  };

  //gets an artists album object
  const _getArtistAlbums = async (accessToken, artistID, albumTypes, limit) => {
    const albumList = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=${albumTypes}&limit=${limit}&offset=0`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await albumList.json();
    return data.items;
  };

  //getting recommendations based off artists given under a max popularity
  const _getRecommendations = async (
    accessToken,
    limit,
    artistIDs,
    popularity
  ) => {
    const recommendationsList = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${artistIDs}&max_popularity=${popularity}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await recommendationsList.json();
    return data.tracks;
  };

  //gets album tracks given album id
  const _getAlbumTracks = async (accessToken, albumID, limit) => {
    const tracksList = await fetch(
      `https://api.spotify.com/v1/albums/${albumID}/tracks?&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await tracksList.json();
    return data.items;
  };

  //gets user profile info
  const _getUserProfile = async (accessToken) => {
    const userData = await fetch(`https://api.spotify.com/v1/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await userData.json();
    return data;
  };

  //gets playlist object
  const _getPlaylist = async (accessToken, playlistID) => {
    const playlistData = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await playlistData.json();
    return data;
  };

  //creates playlist
  const _createPlaylist = async (accessToken) => {
    const requestBody = JSON.stringify({
      name: "PLAYLISTIFY MIX",
      description: "",
      public: false,
    });

    const playlistData = await fetch(
      `https://api.spotify.com/v1/me/playlists`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      }
    );
    const data = await playlistData.json();

    return data;
  };

  const _setCurrentPlaylistID = async (playlistID) => {
    currentPlaylistID = playlistID;
  };

  const _getCurrentPlaylistID = () => {
    return currentPlaylistID;
  };

  const _addTracks = async (accessToken, tracks, playlistID) => {
    const requestBody = JSON.stringify({
      uris: tracks,
      position: 0,
    });

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      }
    );

    const data = await response.json();
    return data;
  };

  const _uploadCover = (accessToken, playlistID, image) => {
    console.log(typeof(image));
    const response = fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}/images`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/jpeg",
        },
        body: image,
      }
    );

    const data = response;
    return data;
  };
  //const _uploadImage = async (accessToken, image)

  return {
    getAccessToken() {
      return _getAccessToken();
    },

    getTopArtists(accessToken, timePeriod, limit) {
      return _getTopArtists(accessToken, timePeriod, limit);
    },

    getArtistAlbums(accessToken, artistID, albumTypes, limit) {
      return _getArtistAlbums(accessToken, artistID, albumTypes, limit);
    },

    getRecommendations(accessToken, limit, artistIDs, popularity) {
      return _getRecommendations(accessToken, limit, artistIDs, popularity);
    },

    getAlbumTracks(accessToken, albumID, limit) {
      return _getAlbumTracks(accessToken, albumID, limit);
    },

    getUserProfile(accessToken) {
      return _getUserProfile(accessToken);
    },

    getPlaylist(accessToken, playlistID) {
      return _getPlaylist(accessToken, playlistID);
    },

    createPlaylist(accessToken) {
      return _createPlaylist(accessToken);
    },

    setPlaylistID(playlistID) {
      return _setCurrentPlaylistID(playlistID);
    },

    getPlaylistID() {
      return _getCurrentPlaylistID();
    },

    addTracks(accessToken, tracks, playlistID) {
      return _addTracks(accessToken, tracks, playlistID);
    },

    uploadCover(accessToken, playlistID, image) {
      return _uploadCover(accessToken, playlistID, image);
    },
  };
})();

//UI Controller
const UIController = (function () {
  const DOMelements = {
    submit: ".submit",
    deselect: ".deselect",
    artistDisplay: ".artistDisplay",
    short_term: ".short_term",
    medium_term: ".medium_term",
    long_term: ".long_term",
    list: ".list",
    anotherButton: ".anotherButton",
    renameButton: ".renameButton",
    openButton: ".openButton",
  };

  return {
    inputs() {
      return {
        short_term: document.querySelector(DOMelements.short_term),
        medium_term: document.querySelector(DOMelements.medium_term),
        long_term: document.querySelector(DOMelements.long_term),
        artistDisplay: document.querySelector(DOMelements.artistDisplay),
        submit: document.querySelector(DOMelements.submit),
        deselect: document.querySelector(DOMelements.deselect),
        list: document.querySelector(DOMelements.list),
        renameButton: document.querySelector(DOMelements.renameButton),
        anotherButton: document.querySelector(DOMelements.anotherButton),
        openButton: document.querySelector(DOMelements.openButton),
      };
    },

    setClasses(e) {
      const isScrollable = e.scrollHeight > e.clientHeight;

      // GUARD: If eement is not scrollable, remove all classes
      if (!isScrollable) {
        e.classList.remove("is-bottom-overflowing", "is-top-overflowing");
        return;
      }

      // Otherwise, the eement is overflowing!
      // Now we just need to find out which direction it is overflowing to (can be both).
      // One pixe is added to the height to account for non-integer heights.
      const isScrolledToBottom =
        e.scrollHeight < e.clientHeight + e.scrollTop + 1;
      const isScrolledToTop = isScrolledToBottom ? false : e.scrollTop === 0;
      e.classList.toggle("is-bottom-overflowing", !isScrolledToBottom);
      e.classList.toggle("is-top-overflowing", !isScrolledToTop);
    },

    toggleSelection(e) {
      if (e.target !== e.currentTarget) {
        let artistAmount =
          document.getElementsByClassName("selectedIcon").length;

        let parent = e.target.parentNode;
        if (e.target.classList.contains("text")) {
          parent = parent.parentNode;
        }

        if (artistAmount >= 5 && !parent.classList.contains("selectedIcon")) {
          console.log("limit reached");
        } else {
          parent.classList.toggle("selectedIcon");
        }
        this.buttonToggle(
          document.getElementsByClassName("selectedIcon").length
        );
      }
    },

    toggleTabbedSelection(e) {
      if (e.target !== e.currentTarget) {
        let artistAmount =
          document.getElementsByClassName("selectedIcon").length;

        if (artistAmount >= 5 && !e.target.classList.contains("selectedIcon")) {
          console.log("limit reached");
        } else {
          e.target.classList.toggle("selectedIcon");
        }
        this.buttonToggle(
          document.getElementsByClassName("selectedIcon").length
        );
      }
    },

    buttonToggle(amount) {
      if (amount > 0) {
        this.inputs().submit.disabled = false;
        this.inputs().deselect.disabled = false;
      } else {
        this.inputs().submit.disabled = true;
        this.inputs().deselect.disabled = true;
      }
    },

    submit(e) {
      const artistArray = [];
      const selectedArtists = document.querySelectorAll(".selectedIcon");
      selectedArtists.forEach((artist) => artistArray.push(artist.id));

      return artistArray;
    },

    deselect() {
      const items = document.querySelectorAll(".selectedIcon");
      for (const item of items) {
        item.classList.remove("selectedIcon");
      }
      this.buttonToggle(document.getElementsByClassName("selectedIcon").length);
    },

    isHorizontalScroll(e) {
      return e.scrollWidth > e.clientWidth;
    },
  };
})();

//app controller
const APPController = (function (APICtrl, UICtrl) {
  DOMInputs = UICtrl.inputs();
  let playlistNum = 60;

  const changeDisplay = async (term) => {
    const accessToken = localStorage.getItem("accessToken");
    const topArtists = await APICtrl.getTopArtists(accessToken, term, 20);
    const display = DOMInputs.artistDisplay;
    let icons = document.querySelectorAll(".artistIcon");

    for (let i = 0; i < 20; i++) {
      if (icons[i] && !topArtists[i]) {
        icons[i].remove();
      } else if (!icons[i] && topArtists[i]) {
        const child = document.createElement("div");
        child.id = topArtists[i]["id"];
        let name = topArtists[i]["name"];

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const overlayText = document.createElement("div");
        overlayText.classList = "text";
        overlayText.innerText = name;

        //child.classList.add(name.replaceAll(" ", "_"));
        child.classList.add("artistIcon");

        const image = new Image();
        image.src = topArtists[i]["images"][2]["url"];
        image.alt = name;

        overlay.append(overlayText);
        child.append(image);
        child.append(overlay);
        child.setAttribute("tabindex", 0);

        display.appendChild(child);
      } else if (icons[i] && topArtists[i]) {
        icons[i].id = topArtists[i]["id"];

        let image = icons[i].querySelector("img");
        image.src = topArtists[i]["images"][2]["url"];

        let text = icons[i].querySelector(".overlay .text");
        text.innerText = topArtists[i]["name"];
      }
    }
  };

  const convertToB64 = async (file) => {
    let reader = new FileReader();
    let base64String = "";

    reader.onload = function () {
      base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    };

    reader.readAsDataURL(file);

    return base64String;
  };


  const pickImage = async () => {
    const response = await fetch("/images");
    const imageFiles = response;
    const randomNum = Math.floor(Math.random() * 10);

    //const photo = imageFiles[randomNum];
    console.log(imageFiles);
    //return photo;
  };

  //loads artist display on page load
  const loadArtists = async () => {
    //creating display container and topArtists object
    const accessToken = await APICtrl.getAccessToken();
    localStorage.clear();
    localStorage.setItem("accessToken", accessToken);
    const display = DOMInputs.artistDisplay;
    const topArtists = await APICtrl.getTopArtists(
      accessToken,
      "short_term",
      20
    );

    //looping to create elements containing the artists image
    for (const artist of topArtists) {
      const child = document.createElement("div");
      child.id = artist["id"];
      let name = artist["name"];

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const overlayText = document.createElement("div");
      overlayText.classList = "text";
      overlayText.innerText = name;

      //child.classList.add(name.replaceAll(" ", "_"));
      child.classList.add("artistIcon");
      child.classList.add("stacked");

      const image = new Image();
      image.src = artist["images"][2]["url"];
      image.alt = name;

      overlay.append(overlayText);
      child.append(image);
      child.append(overlay);
      child.setAttribute("tabindex", 0);

      display.appendChild(child);
    }
  };

  //returns an artists entire catalog
  //this includes LPs, EPs, and singles
  const getEntireCatalog = async (artistID) => {
    const accessToken = localStorage.getItem("accessToken");
    //gathers artists albums and singles
    const regAlbums = await APIController.getArtistAlbums(
      accessToken,
      artistID,
      "album",
      20
    );
    const singleAlbums = await APIController.getArtistAlbums(
      accessToken,
      artistID,
      "single",
      20
    );

    //array holding album and singles in arrays
    let catalog = [];
    let catalogSize = 0;

    //handling album list
    for (const album of regAlbums) {
      const albumTracks = await APIController.getAlbumTracks(
        accessToken,
        album["id"],
        40
      );
      let tempArray = [];
      for (const track of albumTracks) {
        tempArray.push(track["id"]);
      }
      catalog.push(tempArray);
      catalogSize += tempArray.length;
    }

    //handling singles list
    //selectedAlbumNum minimizes number of API calls to Spotify
    let tempArray = [];
    const selectedAlbumsNum = Math.floor(singleAlbums.length / 3);

    for (let i = 0; i < selectedAlbumsNum; i++) {
      let randomNumber = Math.floor(Math.random() * singleAlbums.length);
      const albumTracks = await APIController.getAlbumTracks(
        accessToken,
        singleAlbums[randomNumber]["id"],
        20
      );

      for (const track of albumTracks) {
        let artistFound = track["artists"].some(function (obj) {
          return Object.values(obj).includes(artistID);
        });

        if (artistFound) {
          tempArray.push(track["id"]);
        }
      }
      singleAlbums.splice(randomNumber, 1);
    }

    catalog.push(tempArray);
    catalogSize += tempArray.length;

    //returning catalog
    return [catalog, catalogSize];
  };

  //selecting random tracks helper function
  const getRandomSongs = async (catalog, limit, catalogSize) => {
    let randomTracks = [];

    if (catalogSize <= limit) {
      for (const album of catalog) {
        for (const track of album) {
          randomTracks.push(track);
        }
      }
    } else {
      //selects random song
      for (let i = 0; i < limit; i++) {
        //determines random indices
        let randomAlbumIndex = Math.floor(Math.random() * catalog.length);
        let randomTrackIndex = Math.floor(
          Math.random() * catalog[randomAlbumIndex].length
        );

        //adds selected track to be returned
        //removed from catalog
        randomTracks.push(catalog[randomAlbumIndex][randomTrackIndex]);
        catalog[randomAlbumIndex].splice(randomTrackIndex, 1);
        if (catalog[randomAlbumIndex].length == 0)
          catalog.splice(randomAlbumIndex, 1);
      }
    }
    return randomTracks;
  };

  const displayTracks = async (playlistTracks) => {
    const items = document.querySelectorAll(".listItem");
    if (items) {
      for (const item of items) {
        item.remove();
      }
    }

    //ccreates list elements and adds them to the list
    const tracks = playlistTracks["tracks"]["items"];
    for (const track of tracks) {
      const trackItem = track.track;
      let album = trackItem.album;
      let artists = trackItem.artists;

      let names = artists.map((artist) => artist.name);
      names = names.join(", ");

      let item = document.createElement("div");
      let text = document.createElement("div");
      let photo = document.createElement("div");

      item.classList.add("listItem");
      item.classList.add("stacked");
      photo.classList.add("trackPhoto");
      const image = new Image();
      image.alt = album.name;
      image.src = album.images[0].url;
      photo.appendChild(image);

      text.classList.add("trackText");

      let trackArtists = document.createElement("p");
      let trackTitle = document.createElement("h3");

      trackArtists.innerText = names;
      trackTitle.innerText = track["track"]["name"];
      text.appendChild(trackTitle);
      text.appendChild(trackArtists);
      item.appendChild(photo);
      item.appendChild(text);

      DOMInputs.list.appendChild(item);
    }
  };

  const addScroll = async () => {
    const items = document.querySelectorAll(".trackText");

    for (const item of items) {
      const h3 = item.children[0];
      const p = item.children[1];

      if (UICtrl.isHorizontalScroll(h3)) {
        if (!h3.classList.contains("h3Scroller")) {
          h3.classList.add("h3Scroller");
        }
      } else {
        if (h3.classList.contains("h3Scroller")) {
          h3.classList.remove("h3Scroller");
        }
      }

      if (UICtrl.isHorizontalScroll(p)) {
        if (!p.classList.contains("pScroller")) {
          p.classList.add("pScroller");
        }
      } else {
        if (p.classList.contains("pScroller")) {
          p.classList.remove("pScroller");
        }
      }
    }
  };

  //creates playlist track display
  const playlistDisplay = async (playlistTracks) => {
    const img_url = playlistTracks["images"][0]["url"];
    /* 
        const playlist_pic = document.querySelector('.playlistPicture');


        //handles if playlist picture already exists
        if(playlist_pic.getElementsByTagName("img").src){
            image.src = img_url;
        }else{
            const image = new Image();
            image.src = img_url;
            image.alt = "new playlist cover";
            playlist_pic.appendChild(image);
        }
*/
    await displayTracks(playlistTracks);

    //if user has already made playlist
    const section = document.querySelector(".playlistSection");
    let sectionDisplay = window.getComputedStyle(section, null);
    if (sectionDisplay.getPropertyValue("display") == "none") {
      section.style.display = "flex";
    }
    await addScroll();
    section.scrollIntoView();
  };

  DOMInputs.openButton.addEventListener("click", async (e) => {
    const accessToken = localStorage.getItem("accessToken");
    const playlistID = APICtrl.getPlaylistID();
    const playlistObj = await APICtrl.getPlaylist(accessToken, playlistID);

    window.open(playlistObj.external_urls.spotify, "_blank");
  });

  //deselect listener
  DOMInputs.deselect.addEventListener("click", async (e) => {
    UICtrl.deselect();
  });

  //icons event listener
  DOMInputs.artistDisplay.addEventListener("click", async (e) => {
    e.preventDefault();
    UICtrl.toggleSelection(e);
  });

  //icons event listener
  DOMInputs.artistDisplay.addEventListener("keypress", async (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      UICtrl.toggleTabbedSelection(e);
    }
  });

  //submit button event listener
  DOMInputs.submit.addEventListener("click", async (e) => {
    const accessToken = localStorage.getItem("accessToken");
    const image = await pickImage();
    let playlistTracks = [];
    const idList = UICtrl.submit(e);

    const idListString = idList.join("%2C");

    const recommendationSize = Math.floor(playlistNum * (2 / 3));
    const remainder = playlistNum - recommendationSize;

    //adds songs from top artists
    for (const id of idList) {
      const [catalog, size] = await getEntireCatalog(id);
      let randomSongs = await getRandomSongs(
        catalog,
        Math.ceil(remainder / idList.length),
        size
      );

      playlistTracks = playlistTracks.concat(randomSongs);
    }

    let recommendationsArr = await APICtrl.getRecommendations(
      accessToken,
      recommendationSize,
      idListString,
      90
    );

    //adding recommendation tracks
    for (const recommendation of recommendationsArr) {
      playlistTracks = playlistTracks.concat(recommendation["id"]);
    }

    const playlistData = await APICtrl.createPlaylist(accessToken);
    const playlistID = playlistData["id"];
    APICtrl.setPlaylistID(playlistID);
    const uris = playlistTracks.map((str) => "spotify:track:" + str);

    const generatedPlaylist = await APICtrl.addTracks(
      accessToken,
      uris,
      playlistID
    );

    const playlistObj = await APICtrl.getPlaylist(accessToken, playlistID);

    await playlistDisplay(playlistObj);

    //APICtrl.uploadCover(accessToken, playlistID,image);
  });

  DOMInputs.anotherButton.addEventListener("click", async (e) => {
    const section = document.querySelector(".artistSelection");
    section.scrollIntoView();
  });

  DOMInputs.short_term.addEventListener("click", async (e) => {
    UICtrl.deselect();
    changeDisplay("short_term");
    DOMInputs.short_term.disabled = true;
    DOMInputs.medium_term.disabled = false;
    DOMInputs.long_term.disabled = false;
  });
  DOMInputs.medium_term.addEventListener("click", async (e) => {
    UICtrl.deselect();
    changeDisplay("medium_term");
    DOMInputs.short_term.disabled = false;
    DOMInputs.medium_term.disabled = true;
    DOMInputs.long_term.disabled = false;
  });
  DOMInputs.long_term.addEventListener("click", async (e) => {
    UICtrl.deselect();
    changeDisplay("long_term");
    DOMInputs.short_term.disabled = false;
    DOMInputs.medium_term.disabled = false;
    DOMInputs.long_term.disabled = true;
  });

  DOMInputs.list.addEventListener("scroll", async (e) => {
    const el = e.currentTarget;
    UICtrl.setClasses(el);
  });

  window.addEventListener("resize", addScroll);
  UICtrl.setClasses(DOMInputs.list);

  return {
    init() {
      console.log("App is starting");
      loadArtists();
    },
  };
})(APIController, UIController);

APPController.init();
