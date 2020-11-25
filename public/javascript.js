document.addEventListener('DOMContentLoaded', (event) => {
  const addButtons = document.querySelectorAll('.add-btn')
  for (const button of addButtons) {
    button.addEventListener('click', addGame)
  }

  const deleteButtons = document.querySelectorAll('.delete-btn')
  for (const button of deleteButtons) {
    button.addEventListener('click', deleteGame)
  }

  const searchButton = document.getElementById('search-form')
  searchButton.addEventListener('submit', searchGame)

  const introButton = document.getElementById('intro-btn')
  if (introButton) {
    introButton.onclick = function () {
      // eslint-disable-next-line no-undef
      const intro = introJs()

      intro.start()
    }
  }
})

function searchGame(event) {
  event.preventDefault()
  const searchTerm = document.getElementById('search-input').value.trim()
  if (searchTerm) {
    window.location.href = `/search/${searchTerm}`
  } else {
    window.location.href = '/search/'
  }
}

function deleteGame(event) {
  const id = event.target.dataset.id
  fetch(`/api/games/${id}`, {
    method: 'DELETE',
  })
    .then(function (response) {
      // window.location.reload()
      return response.json()
    })
    .then(function (game) {
      const buttonsWithId = document.querySelectorAll(`[data-id="${id}"]`)
      for (const button of buttonsWithId) {
        button.classList.add('btn-primary', 'add-btn')
        button.classList.remove('btn-danger', 'delete-btn')
        button.dataset.id = game.data.apiId
        button.textContent = 'Add'
        button.removeEventListener('click', deleteGame)
        button.addEventListener('click', addGame)
      }
      const ownedGamesRow = document.querySelector('.owned-games-row')
      if (ownedGamesRow) {
        displayOwnedGames(ownedGamesRow)
      }
    })
}

function addGame(event) {
  const gameInfo = getGameInfo(event.target)
  fetch('/api/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameInfo),
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (game) {
      event.target.classList.remove('btn-primary', 'add-btn')
      event.target.classList.add('btn-danger', 'delete-btn')
      event.target.dataset.id = game.data.id
      event.target.textContent = 'Delete'
      event.target.removeEventListener('click', addGame)
      event.target.addEventListener('click', deleteGame)
      const ownedGamesRow = document.querySelector('.owned-games-row')
      if (ownedGamesRow) {
        displayOwnedGames(ownedGamesRow)
      }
    })
}

function displayOwnedGames(ownedGamesRow) {
  ownedGamesRow.innerHTML = ''
  fetch(`/api/games`, {
    method: 'GET',
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (games) {
      for (const game of games.data) {
        ownedGamesRow.innerHTML += getGameCard(game)
      }
      addDeleteListener(ownedGamesRow)
    })
}

function addDeleteListener(ownedGamesRow) {
  const ownedGames = ownedGamesRow.children
  for (const ownedGame of ownedGames) {
    const deleteButton = ownedGame.querySelector('.delete-btn')
    deleteButton.addEventListener('click', deleteGame)
  }
}

function getGameCard(game) {
  return `
<div class="card owned-games-cards">
  <div class="card-block title">
    <h3 class="card-title text-center owned-games-game-title">${game.name}</h3>
  </div>
  <div class="card-block">
    <div class="row owned-img-btn-row">
      ${
        game.Images.length > 0
          ? `<img src="${game.Images[0].url}" alt="" class="img-owned">`
          : ''
      }
      <button class="btn btn-block btn-lg btn-danger btns-owned delete-btn" data-id="${
        game.id
      }">Delete</button>
    </div>
  </div>
</div`
}

function getGameInfo(target) {
  const apiId = target.dataset.id
  const currentCard = target.closest('.card')
  const name = currentCard.querySelector('.name').textContent.trim()
  const description = currentCard
    .querySelector('.description')
    .textContent.trim()
  const genres = currentCard.querySelector('.genres').textContent.trim()
  const platforms = currentCard.querySelector('.platforms').textContent.trim()
  const releaseDate = currentCard
    .querySelector('.release-date')
    .textContent.trim()
  const images = currentCard.querySelectorAll('.game-img')
  const imageUrls = []
  if (images) {
    for (const image of images) {
      imageUrls.push(image.src)
    }
  }
  return {
    apiId,
    name,
    description,
    genres,
    platforms,
    releaseDate,
    imageUrls,
  }
}
