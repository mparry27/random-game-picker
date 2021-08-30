import './App.css';
import Button from '@material-ui/core/Button'
import axios from 'axios';
import React, { useState } from 'react';

const client_credentials = { CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
                             CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
                             AUTH_TOKEN: null }

function App() {
  const [loaded, setLoaded]= useState(false);
  authorize().then(() => {
    setLoaded(true)
  })
  if(loaded) {
    return (
      <div className="App">
        <header className="App-header">
          <Button onClick={pickRandomGame} variant="contained" color="primary">Pick Random Game</Button>
        </header>
      </div>
    )
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <h1>. . .</h1>
        </header>
      </div>
    )
  }
}

async function authorize() {
  let payload = { client_id: client_credentials.CLIENT_ID, client_secret: client_credentials.CLIENT_SECRET, grant_type: 'client_credentials' }
  return  await axios.post('https://id.twitch.tv/oauth2/token', payload, { headers: { 'Content-Type': 'application/json' }})
  .then(res => {
    client_credentials.AUTH_TOKEN = res.data.access_token
  })
  .catch(error => {
    console.log(error)
  })
}

function pickRandomGame() {
  console.log(client_credentials)
}

export default App;
