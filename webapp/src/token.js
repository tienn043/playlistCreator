//http://localhost:5500/webapp/playlist-creator.html#access_token=BQC3MRSmqGGh7F2J0l7WrkyC-GLZYlo2PllpZTn-q1uWKMpl2vODg36GlPU21OdrFcFXYH5kpFmMxMpJBTc_2x7twEk_F819u4aSrHMnvwjSkqduAylAmvLTLM_3XqignPtU7ab8H9OtAWvDJHpKa_065LOE09fHmUK4miTFDdL5lALyX0FRSbw2viSqPeEcQcl2y9GTq62HOk4hnd5cu0lc_2UbZNyc&token_type=Bearer&expires_in=3600

//creates authorization object
const authObj = () => {
    const tokenInfoString = window.location.hash.substring(1);
    const separatedParams = tokenInfoString.split("&");   
    
    const paramsList = separatedParams.reduce((accumulator, currentValue) => {
        const [key, value] = currentValue.split("=");
        accumulator[key] = value;
        return accumulator;
    }, {});

    return paramsList;
};

//const{access_token, expires_in, token_type} = authObj();
//adding authorization items to local storage
localStorage.clear();
localStorage.setItem("accessToken", authObj().access_token);
localStorage.setItem("expiresIn", authObj().axpires_in);
localStorage.setItem("token_type", authObj().token_type);
/*
function isTokenExpired(accessToken) {
    if (!accessToken) {
        return true; // If no token is provided, consider it expired
    }

    try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1])); // Decode the token payload
        const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds

        // Compare with the current time
        return expirationTime < Date.now();
    } catch (error) {
        console.error('Error decoding or parsing the access token:', error.message);
        return true; // Consider the token expired in case of an error
    }
}

// Example usage
const accessToken = localStorage.getItem("accessToken");
if (isTokenExpired(accessToken)) {
    console.log('Access token is expired.');
} else {
    console.log('Access token is still valid.');
}

*/



