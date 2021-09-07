import './App.css';
import Button from '@material-ui/core/Button'
import axios from 'axios';
import React from 'react';


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET
const AUTH_TOKEN = GetAuthToken()
const GAME_COUNT = Get('/games/count')

async function GetAuthToken() {
  return axios.post('https://id.twitch.tv/oauth2/token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials'
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    return response.data.access_token
  }).catch((error) => {
    console.log(error)
  })
}

async function Get(endpoint, ids=null) {
  console.log(`endpoint: ${endpoint}, ids: ${ids}`)
  return AUTH_TOKEN.then(async (auth) => {
      return axios.post(endpoint, `fields *; limit 1;${ids ? 'w id = (' + ids.join() + ');' : ''}`, {
        headers: {
          'Content-Type': 'text/plain',
          'Client-ID': CLIENT_ID,
          'Authorization': `Bearer ${auth}`
        }
      }).then((response) => {
        return (response.data);
      }).catch((error) => {
        console.log(error);
    })
  })
}

export default function App() {
  const [game, setGame] = React.useState(null);
  const [error, setError] = React.useState(null);

  function RenderGame() {
    GAME_COUNT.then((count) => {
      Get('/games', [Math.floor(Math.random() * count.count) + 1]).then((game) => {
        const gameCoverURL = 'cover' in game[0] ? Get('/covers', [game[0].cover]) : null
        const gameGenres = 'genres' in game[0] ? Get('/genres', game[0].genres) : null
        const gamePlatforms = 'platforms' in game[0] ? Get('/platforms', game[0].platforms) : null
        const gameWebsites = 'websites' in game[0] ? Get('/websites', game[0].websites) : null

        Promise.allSettled([gameCoverURL, gameGenres, gamePlatforms, gameWebsites]).then((responses) => {
          const completeGame = {...game[0],
                                'cover':responses[0].value,
                                'genres':responses[1].value,
                                'platforms':responses[2].value,
                                'websites':responses[3].value}
          console.log(completeGame)
          setGame("GAME")
        })
      })
    })
  }


  return(
    <div className="App-body">
      <div className="App-game">
      {error ?? ""}
        {game ?? ""}
      </div>
      <Button onClick={RenderGame} variant="contained" color="primary" className="App-button">Pick Random Game</Button>
    </div>
  )
}