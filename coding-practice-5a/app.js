const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

const dbpath = path.join(__dirname, 'moviesData.db')
let database = null
const createDbAndServer = async () => {
  try {
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('server and database connected successfully...')
    })
  } catch (e) {
    console.log(e.message)
  }
}
createDbAndServer()

//API 1
app.get('/movies/', async (request, response) => {
  const getMoviesQuery = `
    SELECT movie_name as movieName FROM movie
  `
  const result = await database.all(getMoviesQuery)
  response.send(result)
})

//API 2
app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body

  const addMovieQuery = `
  INSERT INTO movie (director_id, movie_name, lead_actor) 
  values ('${directorId}','${movieName}','${leadActor}');
  `
  await database.exec(addMovieQuery)
  response.send('Movie Successfully Added')
})

//API 3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieByIdQuery = `
  SELECT movie_id as movieId,
      director_id as directorId,
        movie_name as movieName,
        lead_actor as leadActor

   FROM movie where movie_id = '${movieId}'
  `
  const result = await database.get(getMovieByIdQuery)
  response.send(result)
})

//API 4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const {directorId, movieName, leadActor} = request.body
  const updateMovieQuery = `UPDATE movie
SET
director_id = '${directorId}',
movie_name = '${movieName}',
lead_actor = '${leadActor}'
WHERE movie_id = '${movieId}';
  `
  await database.exec(updateMovieQuery)
  response.send('Movie Details Updated')
})

//API 5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `
  DELETE FROM movie
  where movie_id = '${movieId}';
  `
  await database.exec(deleteMovieQuery)
  response.send('Movie Removed')
})

//API 6
app.get('/directors/', async (request, response) => {
  const getDirectorQuery = `
    SELECT director_id as directorId,
    director_name as directorName
    FROM director;
  `
  const result = await database.all(getDirectorQuery)
  response.send(result)
})

//API 7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getMovieByIdQuery = `
  SELECT movie_name as movieName FROM movie
  where director_id = '${directorId}'
  `
  const result = await database.all(getMovieByIdQuery)
  response.send(result)
})
module.exports = app
