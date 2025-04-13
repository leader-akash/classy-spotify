const axios = require('axios');
require('dotenv').config();

const code = process.env.SPOTIFY_REFRESH_TOKEN; 
const redirect_uri = 'https://hiakash.vercel.app'; // redirect uri

(async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    console.log('Access Token:', access_token);
    console.log('New refresh token:', refresh_token);
  } catch (err) {
    console.error('Error exchanging code:', err.response?.data || err);
  }
})();
