document.addEventListener('DOMContentLoaded', (event) => {
  const addButtons = document.querySelectorAll('.add-btn')
  for (const button of addButtons) {
    button.addEventListener('click', addGame)
  }

  const deleteButtons = document.querySelectorAll('.delete-btn')
  for (const button of deleteButtons) {
    button.addEventListener('click', function (event) {
      const id = this.dataset.id
      deleteGame(id)
    })
  }

  const searchButton = document.getElementById('search-form')
  searchButton.addEventListener('submit', searchGame)
})

function searchGame(event) {
  event.preventDefault()
  const searchTerm = document.getElementById('search-input').value.trim()
  if (searchTerm) {
    window.location.href = `/search/${searchTerm}`
  }
}

function deleteGame(id) {
  fetch(`/api/games/${id}`, {
    method: 'DELETE',
  }).then(function (response) {
    window.location.reload()
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
  }).then(function (response) {
    window.location.reload()
  })
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
