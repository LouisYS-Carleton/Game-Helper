const axios = require('axios')
const moment = require('moment')
const API_KEY = process.env.API_KEY
const currentDate = moment().format('YYYY-MM-DD')

// Current games
async function getCurrentGames() {
  const lastYear = moment().subtract(1, 'years').format('YYYY-MM-DD')
  const gamespotData = await axios.get(
    `http://www.gamespot.com/api/games/?api_key=${API_KEY}` +
      `&filter=release_date:${lastYear}|${currentDate}` +
      '&limit=10' +
      '&format=json'
  )
  return await formatGamespotResults(gamespotData.data.results)
}

// Upcoming games
async function getUpcomingGames() {
  const nextYear = moment().add(1, 'years').format('YYYY-MM-DD')
  const gamespotData = await axios.get(
    `http://www.gamespot.com/api/games/?api_key=${API_KEY}` +
      `&filter=release_date:${currentDate}|${nextYear}` +
      '&limit=10' +
      '&format=json'
  )
  const formattedGames = await formatGamespotResults(gamespotData.data.results)
  return formattedGames.map((game) => {
    game.upcoming = true
    return game
  })
}

// Helper functions for handling and formatting game data
async function formatGamespotResults(results) {
  const formattedGames = []
  const imageApiUrls = []
  const releaseApiUrls = []
  for (const game of results) {
    const formattedGame = formatGame(game)
    const results = await Promise.all([
      getImages(game.images_api_url),
      getPlatforms(game.releases_api_url),
    ])
    formattedGame.platform = formatReleases(results[1].data)
    formattedGame.Images = formatImages(results[0].data)
    formattedGames.push(formattedGame)
  }
  return formattedGames
}

function formatGame(game) {
  return {
    apiId: game.id,
    name: game.name,
    releaseDate: game.release_date,
    description: game.deck,
  }
}

async function getImages(imageApiUrl) {
  const images = await axios.get(
    imageApiUrl + `&api_key=${API_KEY}&format=json`
  )
  return images
}

async function getPlatforms(releaseApiUrl) {
  const releases = await axios.get(
    releaseApiUrl + `&api_key=${API_KEY}&format=json`
  )
  return releases
}

function formatImages(images) {
  if (images.number_of_page_results > 0) {
    const imageList = []
    for (let i = 0; i < 3; i++) {
      if (images.results[i] && images.results[i].original) {
        imageList.push({ url: images.results[i].original })
      }
    }
    return imageList
  } else {
    return []
  }
}

function formatReleases(releases) {
  const platforms = []
  if (releases.number_of_page_results > 0) {
    for (const release of releases.results) {
      if (!platforms.includes(release.platform)) {
        platforms.push(release.platform)
      }
    }
    return platforms.join(', ')
  } else {
    return []
  }
}

module.exports = {
  getCurrentGames,
  getUpcomingGames,
}
