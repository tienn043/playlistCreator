//API Controller
const APIController = (function(){
    const accessToken = localStorage.getItem("accessToken");

    //gets top artists object
    const _getTopArtists = async (timePeriod, limit) => {
        const result = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timePeriod}&limit=${limit}&offset=0`, {
            method: 'GET',
            headers: { 'Authorization' : `Bearer ${accessToken}`}
        });
        
        const data = await result.json();
        //return [data.total, data.items];
        return data.items;
    };

    //gets an artists alum object
    const _getArtistAlbums = async (artistID, albumTypes, limit) => {
        const albumList = await fetch  (`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=${albumTypes}&limit=${limit}&offset=0`, {
            method: 'GET',
            headers: {'Authorization' :  `Bearer ${accessToken}`}
        });
        
        const data = await albumList.json();
        return [data.total, data.items];
    };

    //getting recommendations based off artists given under a max popularity
    const _getRecommendations = async (limit, artistIDs, popularity) => {
        const recommendationsList = await fetch (`https://api.spotify.com/v1/recommendations?limit=${limit}seed_artists=${artistIDs}&max_popularity=${popularity}`, {
            method: 'GET',
            headers: {'Authorization' :  `Bearer ${accessToken}`}
        });

        const data  =  await recommendationsList.json();
        return data.tracks;
    };

    return{
        getTopArtists(timePeriod, limit){
            return _getTopArtists(timePeriod, limit);
        },

        getArtistAlbums(artistID, albumTypes, limit){
            return _getArtistAlbums(artistID, albumTypes, limit);
        },

        _getRecommendations(limit, artistIDs, popularity){
            return _getRecommendations(limit, artistIDs, popularity);
        }
    }
    
})();

/*
//UI Controller
const UIController = (function(){

})();
*/

const APPController = (function(APICtrl) {
    
    //loads artist display on page load
    const loadArtists = async () => {
        //creating display container and topArtists object
        const display = document.getElementById("artistDisplay");
        const topArtists = await APICtrl.getTopArtists("short_term", 20);
        
        console.log(topArtists[0]);
        const child = document.createElement("div");
        const image = new Image();
        image.src = topArtists[0]["images"][2]["url"];
        child.append(image);

        display.appendChild(child);
        //looping to create elements containing the artists image
        /*
        for(const artist of topArtists){
            const child = document.createElement("div");
            const image = Image();
            image.src = artist[""]



            //display.appendChild(child);
        }
*/
    }

    return {
        init() {
            console.log('App is starting');
            loadArtists();
        }
    }
})(APIController);

APPController.init();