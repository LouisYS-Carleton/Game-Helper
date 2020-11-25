const router = require('express').Router()
const { searchGames } = require('./helper/gamespot.js')
const db = require('../models')
const { markOwned } = require('./helper/ownedGames.js')

router.get('/', async function (req, res) {
  try {
    res.status(200).render('search', { searchTerm: ' ', searchedGames: [] })
  } catch (err) {
    res.status(401).json({ error: err })
  }
})

router.get('/:game', async function (req, res) {
  try {
    const searchTerm = req.params.game
    const results = await Promise.all([
      searchGames(searchTerm),
      db.Game.findAll({
        include: db.Image,
      }),
    ])
    const [searchedGames, ownedGames] = results
    markOwned(searchedGames, ownedGames)
    res.status(200).render('search', { searchTerm, searchedGames })
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: err })
  }
})

module.exports = router
