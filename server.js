const express = require('express')
const db = require('./models')
const exphbs = require('express-handlebars')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(require('./routes/html-routes.js'))
app.use('/api/games', require('./routes/api-games.routes.js'))
app.use('/api/images', require('./routes/api-images.routes.js'))
app.use('/search', require('./routes/search.routes.js'))

db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT)
  })
})
