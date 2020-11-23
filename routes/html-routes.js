const router = require('express').Router()
const { getCurrentGames, getUpcomingGames } = require('./helper/gamespot.js')
const db = require('../models')

router.get('/', async function (req, res) {
  try {
    const results = await Promise.all([
      getCurrentGames(),
      getUpcomingGames(),
      db.Game.findAll({
        include: db.Image,
      }),
    ])
    const [currentGames, upcomingGames, ownedGames] = results
    markOwned(currentGames, ownedGames)
    res.status(200).render('home', { currentGames, upcomingGames, ownedGames })
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: err })
  }
})

function markOwned(currentGames, ownedGames) {
  for (const game of currentGames) {
    const foundGame = ownedGames.find((data) => game.apiId === data.apiId)
    if (foundGame) {
      game.owned = true
      game.id = foundGame.id
    } else {
      game.owned = false
    }
  }
}

module.exports = router
