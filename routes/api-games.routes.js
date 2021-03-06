const db = require('../models')
const router = require('express').Router()
const isAuthenticate = require('../config/middleware/isAuthenticate')

router.get('/', isAuthenticate, function (req, res) {
  db.Game.findAll({
    include: db.Image,
    where: {
      UserId: req.user.id,
    },
  })
    .then(function (games) {
      res.status(200).json({ data: games })
    })
    .catch(function (err) {
      res.status(500).send({ error: err })
    })
})

router.post('/', isAuthenticate, async function (req, res) {
  try {
    const {
      apiId,
      name,
      releaseDate,
      platforms,
      description,
      genres,
    } = req.body

    const newGame = await db.Game.create({
      apiId,
      name,
      releaseDate,
      platforms,
      description,
      genres,
      UserId: req.user.id,
    })

    res.redirect(307, `/api/images/${newGame.id}`)
  } catch (err) {
    res.status(401).json({ errors: err })
  }
})

router.delete('/:id', isAuthenticate, async function (req, res) {
  try {
    const game = await db.Game.findByPk(req.params.id, {
      include: db.Image,
      where: {
        UserId: req.user.id,
      },
    })
    if (!game) res.status(401).json({ error: 'Game not found.' })

    await game.destroy()
    res.status(200).json({ data: game })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

module.exports = router
