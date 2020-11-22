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
    // pushing the urls to an array in order to use in Promise.all
    imageApiUrls.push(game.images_api_url)
    releaseApiUrls.push(game.releases_api_url)
    formattedGames.push(formattedGame)
  }
  return await addAdditionalInfo(formattedGames, imageApiUrls, releaseApiUrls)
}

function formatGame(game) {
  return {
    apiId: game.id,
    name: game.name,
    releaseDate: game.release_date,
    description: game.deck,
  }
}

async function addAdditionalInfo(formattedGames, imageApiUrls, releaseApiUrls) {
  // Firing off promises for all images and all releases
  const addedData = await Promise.all([
    getImages(imageApiUrls),
    getPlatforms(releaseApiUrls),
  ])
  const [images, releases] = addedData
  // Matching images and releases to their related game
  // Since images and releases ordered by game, can access data at same index
  for (let i = 0; i < formattedGames.length; i++) {
    formattedGames[i].platform = formatReleases(releases[i].data)
    formattedGames[i].Images = formatImages(images[i].data)
  }
  return formattedGames
}

// Turning array of image promises into a single Promise.all
// To be resolved in addAdditionalInfo
async function getImages(imageApiUrls) {
  const imagePromises = []
  for (const url of imageApiUrls) {
    imagePromises.push(
      axios.get(url + `&api_key=${API_KEY}&limit=3&format=json`)
    )
  }
  return Promise.all(imagePromises)
}

// Turning array of release promises into a single Promise.all
// To be resolved in addAdditionalInfo
async function getPlatforms(releaseApiUrls) {
  const releasePromises = []
  for (const url of releaseApiUrls) {
    releasePromises.push(axios.get(url + `&api_key=${API_KEY}&format=json`))
  }
  return Promise.all(releasePromises)
}

// Formating image data to take 3 images from the list
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

// Formating release data to return all the platforms of the game
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
