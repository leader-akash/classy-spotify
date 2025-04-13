const express = require('express');
const cors = require('cors');
const { spotifyApi, refreshAccessToken } = require('./spotify');

const app = express();
app.use(cors());

// Get all top 10 tracks
app.get('/spotify/top-tracks', async (req, res) => { 
  await refreshAccessToken();
  try {
    const data = await spotifyApi.getMyTopTracks({ limit: 10 });
    const tracks = data.body.items.map((track, i) => ({
      index: i + 1,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      uri: track.uri,
    }));
    res.json({ topTracks: tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

//get currently playing song 
app.get('/spotify/now-playing', async (req, res) => {
  await refreshAccessToken();
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    if (data.body && data.body.is_playing) {
      res.json({
        isPlaying: true,
        song: {
          name: data.body.item.name,
          artist: data.body.item.artists.map(a => a.name).join(', '),
        },
      });
    } else {
      res.json({ isPlaying: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get current playback' });
  }
});

// function to play song
app.post('/spotify/play', express.json(), async (req, res) => {
  const { uri } = req.body;
  if (!uri) return res.status(400).json({ error: 'Track URI is required' });

  await refreshAccessToken();
  try {
    await spotifyApi.play({ uris: [uri] });
    res.json({ message: 'Track started playing' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start playback' });
  }
});

//function to pause the song
app.post('/spotify/pause', async (req, res) => {
  await refreshAccessToken();
  try {
    await spotifyApi.pause();
    res.json({ message: 'Playback paused' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to pause playback' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Spotify API running on port ${PORT}`);
});
