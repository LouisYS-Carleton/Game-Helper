const axios = require('axios')
const moment = require('moment')
const API_KEY = process.env.API_KEY

// Current games
async function getCurrentGames() {
  const today = moment().format('YYYY-MM-DD')
  const lastYear = moment().subtract(1, 'years').format('YYYY-MM-DD')
  const gamespotData = await axios.get(
    `http://www.gamespot.com/api/games/?api_key=${API_KEY}` +
      `&filter=release_date:${lastYear}|${today}` +
      '&limit=10' +
      '&format=json'
  )
  return formatGamespotResults(gamespotData.data.results)
}

// Upcoming games
async function getUpcomingGames() {
  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
  const tomorrowNextYear = moment()
    .add(1, 'days')
    .add(1, 'years')
    .format('YYYY-MM-DD')
  const gamespotData = await axios.get(
    `http://www.gamespot.com/api/games/?api_key=${API_KEY}` +
      `&filter=release_date:${tomorrow}|${tomorrowNextYear}` +
      '&limit=10' +
      '&format=json'
  )
  const formattedGames = await formatGamespotResults(gamespotData.data.results)
  return formattedGames.map(markUpcoming)
}

// Search for games
async function searchGames(search) {
  const formattedSearch = search.trim()
  const gamespotData = await axios.get(
    `http://www.gamespot.com/api/games/?api_key=${API_KEY}` +
      `&filter=name:${formattedSearch}` +
      '&limit=10' +
      '&format=json'
  )
  const formattedGames = await formatGamespotResults(gamespotData.data.results)
  return formattedGames.map(markUpcoming)
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
  return addAdditionalInfo(formattedGames, imageApiUrls, releaseApiUrls)
}

function formatGame(game) {
  const genres = []
  for (const genre of game.genres) {
    genres.push(genre.name)
  }
  return {
    apiId: game.id,
    name: game.name,
    releaseDate: game.release_date,
    description: game.deck,
    genres: genres.join(', '),
  }
}

function markUpcoming(game) {
  if (moment(game.releaseDate).isAfter(moment())) {
    game.upcoming = true
  }
  return game
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
    formattedGames[i].platforms = formatReleases(releases[i].data)
    formattedGames[i].Images = formatImages(images[i].data)
  }
  return formattedGames
}

// Turning array of image promises into a single Promise.all
// To be resolved in addAdditionalInfo
function getImages(imageApiUrls) {
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
function getPlatforms(releaseApiUrls) {
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
  searchGames,
}
