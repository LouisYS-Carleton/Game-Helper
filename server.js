const express = require('express')
const exphbs = require('express-handlebars')
// const cookiePaser = require('cookie-parser')
// const Users = require('models/index')
const session = require('express-session')
// const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080
const db = require('./models')
// const cookieParser = require('cookie-parser')
const passport = require('passport')

// Creating express app and configuring middleware needed for authentication
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./public'))
app.use(
  session({
    key: 'userId',
    secret: 'secrett',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

// set express app to us handlebars template
app.engine(
  'exphbs',
  exphbs({ defaultLayout: 'layout' })
)
app.set('view engine', 'handlebars')

// const exphbsContent = {
//   email: '',
//   loggedin: false,
//   title: 'You are not logged in',
//   body: 'Game-helper lod in page',
// }

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT
    )
  })
})
