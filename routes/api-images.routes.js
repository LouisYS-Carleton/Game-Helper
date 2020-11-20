const db = require('../models')
const router = require('express').Router()

router.post('/:gameId', async function (req, res) {
  try {
    const gameId = req.params.gameId
    const { imageUrls } = req.body
    for (const imageUrl of imageUrls) {
      await db.Image.create({
        url: imageUrl,
        GameId: gameId,
      })
    }
    const newGame = await db.Game.findByPk(gameId, {
      include: db.Image,
    })
    res.status(201).json({ data: newGame })
  } catch (err) {
    res.status(401).json({ error: err })
  }
})

module.exports = router
