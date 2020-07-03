const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')
require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_KEY
    console.log(apiToken);
    const authToken = req.get('Authorization')  
    console.log(authToken)
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request. Provide a proper authorization key' })
    } 
    // move to the next middleware
    next()
  })
function handleMovies(req, res) {
    let response = MOVIES;
    //console.log(response)
  // filter our pokemon by name if name query param is present
  if (req.query.country) {
    response = response.filter(movieCountry =>
      // case insensitive searching
      movieCountry.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (req.query.genre) {
    response = response.filter(movieGenre =>
      movieGenre.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  
  if(req.query.avg_vote) {
    response = response.filter(avgVote =>
        Number(avgVote.avg_vote) >= Number(req.query.avg_vote)
      )
  }

  res.json(response)
}

app.get('/movie', handleMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})