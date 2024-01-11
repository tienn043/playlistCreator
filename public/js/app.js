console.log(sessionStorage.getItem("accessToken"));
console.log("test");

//API Controller
const APIController = (function(){
    const accessToken = sessionStorage.getItem('accessToken');
    
    //gets top artists object
    const _getTopArtists = async (timePeriod, limit) => {
        const result = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timePeriod}&limit=${limit}&offset=0`, {
            method: 'GET',
            headers: { 'Authorization' : `Bearer ${accessToken}`}
        });
        console.log(accessToken);
        const data = await result.json();
        console.log(data);
        return data.items;
    };

    //gets an artists album object
    const _getArtistAlbums = async (artistID, albumTypes, limit) => {
        const albumList = await fetch  (`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=${albumTypes}&limit=${limit}&offset=0`, {
            method: 'GET',
            headers: {'Authorization' :  `Bearer ${accessToken}`}
        });
        
        const data = await albumList.json();
        return data.items;
    };

    //getting recommendations based off artists given under a max popularity
    const _getRecommendations = async (limit, artistIDs, popularity) => {

        const recommendationsList = await fetch (`https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${artistIDs}&max_popularity=${popularity}`, {
            method: 'GET',
            headers: {'Authorization' :  `Bearer ${accessToken}`}
        });

        const data  =  await recommendationsList.json();
        return data.tracks;
    };

    //gets album tracks given album id
    const _getAlbumTracks = async (albumID, limit) => {
        const tracksList = await fetch (`https://api.spotify.com/v1/albums/${albumID}/tracks?&limit=${limit}`, {
            method: 'GET',
            headers: {'Authorization' :  `Bearer ${accessToken}`}
        });

        const data = await tracksList.json();
        return data.items;
    };

    const _getUserProfile = async () =>{
        const userData = await fetch (`https://api.spotify.com/v1/me`, {
            method: 'GET',
            headers: {'Authorization' : `Bearer ${accessToken}`}
        });

        const data = await userData.json();
        return data;
    };

    const _createPlaylist = async (userID) => {
        const requestBody = JSON.stringify({
            "name": "New Playlist",
            "description": "A blend of your favorite artists' songs and recommendations",
            "public": false
        });

        const playlistData = await fetch (`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',
            headers: {Accept : 'application/json',
                'Authorization' : `Bearer ${accessToken}`,
            'Content-Type': 'application/json'},
            body: requestBody
        });
        const data = await playlistData.json();

        console.log("HI IM RIGHT HERE");
        return data;
    };



    return{
        getAccessToken(){
            return accessToken;
        },

        getTopArtists(timePeriod, limit){
            return _getTopArtists(timePeriod, limit);
        },

        getArtistAlbums(artistID, albumTypes, limit){
            return _getArtistAlbums(artistID, albumTypes, limit);
        },

        getRecommendations(limit, artistIDs, popularity){
            return _getRecommendations(limit, artistIDs, popularity);
        },

        getAlbumTracks(albumID, limit){
            return _getAlbumTracks(albumID, limit);
        },

        getUserProfile(){
            return _getUserProfile();
        },

        createPlaylist(){
            return _createPlaylist();
        }

    }
})();


//UI Controller
const UIController = (function(){
    const DOMelements = {
        submitArtists : '#submitArtists',
        artistDisplay : '#artistDisplay'
    }

    return {
        inputs(){
            return{
                artistDisplay : document.getElementById('artistDisplay'),
                submitArtists : document.getElementById('submitArtists')
            }
        },

        toggleSelection(e){
            if(e.target !== e.currentTarget){
                let artistAmount = document.getElementsByClassName("selectedIcon").length;
                const parent = e.target.parentNode;

                if(artistAmount >= 5 && !parent.classList.contains('selectedIcon')){
                    console.log("limit reached");
                }
                else{
                    parent.classList.toggle('selectedIcon');
                }
                this.buttonToggle(document.getElementsByClassName("selectedIcon").length);
            }
        },

        buttonToggle(amount){
            if(amount > 0)
                this.inputs().submitArtists.disabled = false;
            else
                this.inputs().submitArtists.disabled = true;
            
        },

        submit(e){
            const artistArray = [];
            const selectedArtists = document.querySelectorAll('.selectedIcon');
            selectedArtists.forEach((artist) => artistArray.push(artist.id));

            return artistArray;
        }
    
        
    }
    
})();

//app controller
const APPController = (function(APICtrl, UICtrl) {
    DOMInputs = UICtrl.inputs();
    let playlistNum = 60;


    //loads artist display on page load
    const loadArtists = async () => {
        //creating display container and topArtists object
        const display = DOMInputs.artistDisplay;
        const topArtists = await APICtrl.getTopArtists("short_term", 20);

        
        //looping to create elements containing the artists image        
        for(const artist of topArtists){
            const child = document.createElement('div');
            child.id = artist['id'];
            let name = artist['name'];
            
            child.classList.add(name.replaceAll(" ", "_"));
            child.classList.add('artistIcon');
            
            const image = new Image();
            image.src = artist['images'][2]['url'];

            child.append(image);

            display.appendChild(child);
        }


    }

    //returns an artists entire catalog
    //this includes LPs, EPs, and singles
    const getEntireCatalog = async(artistID) => {
        //gathers artists albums and singles
        const regAlbums = await APIController.getArtistAlbums(artistID, 'album', 20);
        const singleAlbums = await APIController.getArtistAlbums(artistID, 'single', 20);

        //array holding album and singles in arrays
        let catalog = [];
        let catalogSize = 0;

        //handling album list
        for(const album of regAlbums){
            const albumTracks = await APIController.getAlbumTracks(album['id'], 40);
            let tempArray = [];
            for(const track of albumTracks){
                tempArray.push(track['id']);
            }
            catalog.push(tempArray);
            catalogSize += tempArray.length;
        };

        //handling singles list
        //selectedAlbumNum minimizes number of API calls to Spotify
        let tempArray = [];
        const selectedAlbumsNum = Math.floor(singleAlbums.length/3);
        
        for(let i = 0; i < selectedAlbumsNum; i++){
            let randomNumber = Math.floor(Math.random() * (singleAlbums.length));
            const albumTracks = await APIController.getAlbumTracks(singleAlbums[randomNumber]['id'], 20);
            
            for(const track of albumTracks){
                tempArray.push(track['id']);
            }
            singleAlbums.splice(randomNumber, 1);
        }

        catalog.push(tempArray);
        catalogSize += tempArray.length;

        //returning catalog
        return [catalog, catalogSize];
    }

    //selecting random tracks helper function
    const getRandomSongs = async (catalog, limit, catalogSize) => {
        let randomTracks = [];

        if(catalogSize <= limit){
            for(const album of catalog){
                for(const track of album){
                    randomTracks.push(track);
                }
            }
        }else{
            //selects random song
            for (let i = 0; i < limit; i++){
                //determines random indices
                let randomAlbumIndex = Math.floor(Math.random() * catalog.length);
                let randomTrackIndex = Math.floor(Math.random() * catalog[randomAlbumIndex].length);
                
                //adds selected track to be returned
                //removed from catalog
                randomTracks.push(catalog[randomAlbumIndex][randomTrackIndex]);
                catalog[randomAlbumIndex].splice(randomTrackIndex, 1);
                if(catalog[randomAlbumIndex].length == 0)
                catalog.splice(randomAlbumIndex, 1);
            }
        }
        return randomTracks;
    }

    //icons event listener
    DOMInputs.artistDisplay.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.toggleSelection(e);
    });

    //submit button event listener 
    DOMInputs.submitArtists.addEventListener('click', async (e) => {
      
        let playlistTracks = [];
        const idList = UICtrl.submit(e);
        const idListString = idList.join('%2C');

        const recommendationSize = Math.floor(playlistNum*(2/3));
        const remainder = playlistNum - recommendationSize;

        let recommendationsArr = await APICtrl.getRecommendations(recommendationSize, idListString, 90);

        //adds songs from top artists
        for(const id of idList) {
            const [catalog, size] = await getEntireCatalog(id);
            let randomSongs = await getRandomSongs(catalog, Math.ceil(remainder/idList.length), size);

            playlistTracks = playlistTracks.concat(randomSongs);
        }

        //adding recommendation tracks
        for(const recommendation of recommendationsArr){
            playlistTracks = playlistTracks.concat(recommendation['id']);
        }

        const userID = await APICtrl.getUserProfile();
        const playlistData = await APICtrl.createPlaylist(userID['id']);
        console.log(playlistData);
    });



    return {
        init() {

            console.log('App is starting');
            loadArtists();

            
        }
    }
})(APIController, UIController);

APPController.init();
