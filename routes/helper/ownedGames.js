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

module.exports = {
  formatOwnedGames,
  markOwned,
}
