const router = require('express').Router()
const { getCurrentGames, getUpcomingGames } = require('./helper/gamespot.js')
const db = require('../models')
const { formatOwnedGames, markOwned } = require('./helper/ownedGames.js')
const isAuthenticate = require('../config/middleware/isAuthenticate')

router.get('/', isAuthenticate, async function (req, res) {
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

router.get('/login', function (req, res) {
    // If the user already has an account send them to the login page
    if (req.user) {
        res.redirect('/')
    }
    res.render('login', {layout: 'intro'})
})

router.get('/signup', function(req, res) {
    res.render('signup', {layout: 'intro'})
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
  }
)


module.exports = router
