const db = require('../models')
const router = require('express').Router()

router.get('/', function (req, res) {
  db.Game.findAll({
    include: db.Image,
  })
    .then(function (games) {
      res.status(200).json({ data: games })
    })
    .catch(function (err) {
      res.status(500).send({ error: err })
    })
})

router.post('/', async function (req, res) {
  try {
    const { apiId, name, releaseDate, platform, description } = req.body

    const newGame = await db.Game.create({
      apiId,
      name,
      releaseDate,
      platform,
      description,
    })

    res.redirect(307, `/api/images/${newGame.id}`)
  } catch (err) {
    res.status(401).json({ errors: err })
  }
})

router.delete('/:id', async function (req, res) {
  try {
    const game = await db.Game.findByPk(req.params.id, {
      include: db.Image,
    })
    if (!game) res.status(401).json({ error: 'Game not found.' })

    await game.destroy()
    res.status(200).json(game)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

module.exports = router
