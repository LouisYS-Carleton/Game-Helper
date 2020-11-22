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
    console.log(upcomingGames)
    res.status(200).render('home')
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: err })
  }
})

function markOwned(currentGames, ownedGames) {
  for (const game of currentGames) {
    if (ownedGames.find((data) => game.apiId === data.apiId)) {
      game.owned = true
    } else {
      game.owned = false
    }
  }
}

module.exports = router
