












//authentication

const SCOPES =  ["user-top-read, user-read-private, user-read-email, playlist-read-private, playlist-modify-private"];
const CLIENT_ID = "6b4d84dd61384eb1b019a57c430711d2";
const ENDPOINT = "https://accounts.spotify.com/authorize?";
const REDIRECT_URI = "http://localhost:5500/webapp/playlist-creator.html"


//https://accounts.spotify.com/authorize?client_id=6b4d84dd61384eb1b019a57c430711d2&response_type=token&redirect_uri=http://127.0.0.1:5500/webapp/playlist-creator.html&scope=user-top-read%20playlist-read-private%20playlist-modify-private&show_dialog+true

//handling spotify authorization
const handleLogin = () => {
    window.location = `${ENDPOINT}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=token&show_dialogue=true`;
};




