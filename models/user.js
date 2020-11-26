const bcrypt = require('bcryptjs')

// this should set up the user table
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  })
  User.addHook('beforeCreate', function (user) {
    user.hashedPassword = bcrypt.hashSync(
      user.hashedPassword,
      bcrypt.genSaltSync(10),
      null
    )
  })

  User.associate = function (models) {
    User.hasMany(models.Game, { onDelete: 'cascade' })
  }

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword)
  }

  return User
}
