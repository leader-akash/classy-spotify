const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

console.log('refreshToken', process.env.SPOTIFY_REFRESH_TOKEN)
spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (err) {
    console.error('Could not refresh access token', err);
  }
};

module.exports = { spotifyApi, refreshAccessToken };
