const router = require('express').Router()
const {
  getCurrentGames,
  getUpcomingGames,
  searchGames,
} = require('./helper/gamespot.js')
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

router.get('/search', async function (req, res) {
  try {
    const results = await Promise.all([
      searchGames('mario party'),
      db.Game.findAll({
        include: db.Image,
      }),
    ])
    const [searchedGames, ownedGames] = results
    markOwned(searchedGames, ownedGames)
    res.status(200).render('search', { searchedGames })
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: err })
  }
})

function formatOwnedGames(ownedGames) {
  return ownedGames.map((game) => {
    game.dataValues.Images = game.dataValues.Images.map(
      (image) => image.dataValues
    )
    return game.dataValues
  })
}

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
