const createPlaylist = async (userID) => {
    const accessToken = "BQAuM06_pYQWs7Olo3mrM4Jol1epgQB0J2tMTsNKdLHS-LTG-rDuEuY0pZU-hXfWjpeFMOV2w3bdhx228gpGGQUIArPmmRenb83vTxcnqmIM_4dxQGtJ-76fxfST8YYYkPBrgNchRAQbIjfHV0WCN3uyH7IXHtzI-egNyGg-Uzj18z5v6q6cjONcby1K3tuzo5xHJNdpHlQNxeKHnS2uhnIBw6E2sA7sXagdddFmdENc9Ecr";
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
    return data;
};

const result = createPlaylist("asiantincan");
console.log(result);