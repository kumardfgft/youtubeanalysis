import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Select, MenuItem, Button ,Card,Avatar,Paper,InputLabel,Stack} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TextIconLabel from './TextIconLabel';
const HighSubscriberChannels = () => {
  const [countryCode, setCountryCode] = useState('US');
  const [subscriberCount, setSubscriberCount] = useState('10000');
  const [searchTerm, setSearchTerm] = useState('Fitness influencer');
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:4000/high-subscriber-channels', {
        params: {
            searchTerm: searchTerm,
            maxResults: 20,
            countryCode: countryCode ,
            minSubscriberCount: subscriberCount
        }
      });

      // Handle the API response as needed
      setResponseData(response.data.channels);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const formatNumber = (value) => {
    if(value<1000){
      return value;
    }
    let newValue = value;
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }
    return `${newValue.toFixed(2)}${suffixes[suffixNum]}`;
  };

  return (
    <Container >
         <Stack alignItems="center" justifyContent="center" spacing={3}>
         <TextIconLabel
              icon={<YouTubeIcon sx={{ color: 'red', mr: 1, fontSize: 60 }} />}
              value={'Youtube Analysis'}
              sx={{ typography: 'h3', mb: 1 }}
            />
      <Stack direction="row" spacing={3}>
        <Select
         inputProps={{ 'aria-label': 'Without label' }}
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <MenuItem value="Fitness influencer">Fitness influencer</MenuItem>
          <MenuItem value="Makeup influence">Makeup influence</MenuItem>
          <MenuItem value="Beauty Blogger">Beauty Blogger</MenuItem>
          <MenuItem value="Gaming influencer">Gaming influencer</MenuItem>
          <MenuItem value="travel">Travel influencer</MenuItem>
          <MenuItem value="Food blogger">Food blogger</MenuItem>
          <MenuItem value="Tech reviewer">Tech reviewer</MenuItem>
          {/* Add more countries as needed */}
        </Select>
        <TextField
          label="Subscriber Count"
          variant="outlined"
          
          margin="normal"
          type="number"
          value={subscriberCount}
          onChange={(e) => setSubscriberCount(e.target.value)}
        />
        <Select
           inputProps={{ 'aria-label': 'Without label' }}
          variant="outlined"
          margin="normal"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <MenuItem value="US">United States</MenuItem>
          <MenuItem value="CA">Canada</MenuItem>
          <MenuItem value="IN">INDIA</MenuItem>
          {/* Add more countries as needed */}
        </Select>
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Search
        </Button>
        </Stack>
      {responseData && ( 
        <Stack spacing={2}>
              {responseData.map(responseData => (
              <Card sx={{ p: 3,backgroundColor:"#f3f6f9" }} >
                <Stack direction="row" spacing={3}>
                  <Avatar style={{ width: '56px', height: '56px' }} src={responseData.profileUrl} />
                  <Typography variant="h3">{responseData.title}</Typography>
                </Stack>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 3 }}>{responseData.description}</Typography>
                <Stack direction="row" justifyContent="space-around" spacing={3}>
                  <Paper elevation={3} >
                    <Stack sx={{ p: 2 }}>
                      <Typography variant="h4">ViewCount</Typography>
                      <Typography variant="h4">{formatNumber(parseInt(responseData.statistics.viewCount))}</Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={3}>
                    <Stack sx={{ p: 2 }}>
                      <Typography variant="h4">SubscriberCount</Typography>
                      <Typography variant="h4">{formatNumber(parseInt(responseData.statistics.subscriberCount))}</Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={3}>
                    <Stack sx={{ p: 2 }}>
                      <Typography variant="h4">VideoCount</Typography>
                      <Typography variant="h4">{responseData.statistics.videoCount}</Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Card>
              ))}
              </Stack>
            )}
            </Stack>
    </Container>
  );
};

export default HighSubscriberChannels;