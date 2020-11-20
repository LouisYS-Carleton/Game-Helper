const express = require('express')
const exphbs = require('express-handlebars')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(require('./routes/html-routes.js'))

app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT)
})