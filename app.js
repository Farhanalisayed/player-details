const express = require('express')
const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
let db

let thePath = path.join(__dirname, 'cricketTeam.db')
const initializetheDBandServer = async () => {
  try {
    db = await open({
      filename: thePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Doing the Job')
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
    process.exit(1)
  }
}

app.get('/players', async (request, response) => {
  getPlayersQuery = `SELECT *
                      FROM cricket_team
                      ORDER BY player_id`
  let playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

app.post('/players', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  postPlayersQuery = `INSERT INTO
                      cricket_team (player_name, jersey_number, role)
                      VALUES(${playerName}, ${jerseyNumber}, ${role});`
  await db.run(postPlayersQuery)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getAPlayerQue = `SELECT * 
                      FROM cricket_team
                      WHERE player_id=${playerId}
                      `
  const thePlayer = await db.get(getAPlayerQue)
  response.send(thePlayer)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDets = request.body
  const {playerName, jerseyNumber, role} = playerDets

  const updatePlayerQue = ` UPDATE cricket_team
                            SET
                            player_name=${playerName},
                            jersey_number=${jerseyNumber},
                            role= ${role}
                            WHERE player_id=${playerId};`
  await db.run(updatePlayerQue)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQue = `DELETE FROM
                          cricket_team
                          WHERE player_id = ${playerId}`
  await db.run(deletePlayerQue)
  response.send('Player Removed')
})

module.exports = app
initializetheDBandServer()
