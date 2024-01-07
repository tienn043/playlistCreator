const ENDPOINT = "https://api.spotify.com/v1/recommendations?limit=40seed_artists=73sIBHcqh3Z3NyqHKZ7FOL%2C2h93pZq0e7k5yf4dywlkpM%2C0nnBZ8FXWjG9wZgM2cpfeb&max_popularity=90";
const accessToken = "BQAI6nj_R6L4B90R2VJFmC1eIiCNvFS6tLY001V1KOoJv386k4z7JJ3lIyMjAOhPetnWf5QuJxJb61KMXaMCKuJxudQ8AdPFRow_5AYLTmkRgQRJItyQGgma--Frf4_FMJ1wTkULvf8p-EpHnBSBfrGziA2YmK0y7GykbGsKUMWfuvs7op4QlfYbWIim9QB8RLYd4XPyBjDKSLBbtyMsoeRAKs8yrcEaSSX0dGnV3hfACw";

const getRecommendations = async () => {
    const recommendationsList = await fetch (ENDPOINT, {
        method: 'GET',
        headers: {'Authorization' :  `Bearer ${accessToken}`}
    });

    const data  =  await recommendationsList.json();
    console.log(data.tracks);
    return data.tracks;
};


const test = getRecommendations();