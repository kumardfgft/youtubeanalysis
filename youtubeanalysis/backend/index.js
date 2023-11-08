const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
const API_KEY = 'AIzaSyCQMl1toeEIaveuicFD_O8Wh_u2wU7rmSE';

// Function to search for YouTube channels
async function searchChannels(query) {
  const { searchTerm, maxResults, countryCode, minSubscriberCount } = query;
  try {
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        q: searchTerm || 'cooking',
        type: 'channel',
        regionCode: countryCode || 'US',
        maxResults: Math.max(maxResults || 50, 10),
        part: 'snippet',
      },
    });

    const channels = [];

    for (const searchResult of searchResponse.data.items) {
      const channelId = searchResult.id.channelId;
      const channelTitle = searchResult.snippet.title;

      // Retrieve channel statistics
      const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          key: API_KEY,
          id: channelId,
          part: 'statistics,snippet',
        },
      });

      if (channelResponse.data.items) {
        const channelDetails = channelResponse.data.items[0];
        const statistics = channelResponse.data.items[0].statistics;
        const subscriberCount = parseInt(statistics.subscriberCount, 10);
        const defaultProfilePictureUrl = channelDetails.snippet.thumbnails.default.url;

        // Check if the channel has a high subscriber count
        if (subscriberCount >= minSubscriberCount) {
          channels.push({
            title: channelTitle,
            channelId: channelId,
            subscriberCount: subscriberCount,
            description: channelDetails.snippet.description,
            profileUrl:defaultProfilePictureUrl,
            statistics: statistics
          });
        }
      }
    }

    return channels;
  } catch (error) {
    console.error('Error searching for channels:', error);
    throw error;
  }
}
app.get('/high-subscriber-channels', async (req, res) => {
    try {
      const searchTerm = req.query.searchTerm;
      const maxResults = req.query.maxResults;
      const countryCode = req.query.countryCode;
      const minSubscriberCount = req.query.minSubscriberCount;
  
      const channels = await searchChannels({
        searchTerm,
        maxResults,
        countryCode,
        minSubscriberCount
      });
  
      if (channels.length > 0) {
        res.json({ channels });
      } else {
        res.json({ message: 'No high subscriber count channels found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching channels.' });
    }
  });

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
