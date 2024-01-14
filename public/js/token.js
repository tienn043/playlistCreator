const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
const url = 'https://accounts.spotify.com/api/token';
const clientId = '350bb843292c48ae8ecece947c2ed01d';
const redirectUri = 'http://localhost:3000/playlist-creator.html';


const getToken = async code => {
    // stored in the previous step
    let codeVerifier = window.sessionStorage.getItem('code_verifier');
  
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    }
  
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log(response);

    localStorage.setItem('accessToken', response.access_token);

}

if(code){
  getToken(code);
}

