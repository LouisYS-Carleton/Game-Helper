const router = require('express').Router()
const { getCurrentGames, getUpcomingGames } = require('./helper/gamespot.js')
const db = require('../models')
const { formatOwnedGames, markOwned } = require('./helper/ownedGames.js')

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
    res.status(200).render('home', {
      currentGames,
      upcomingGames,
      ownedGames: formatOwnedGames(ownedGames),
    })
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: err })
  }
})

module.exports = router
