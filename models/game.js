module.exports = function (sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    apiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  })

  Game.associate = function (models) {
    Game.hasMany(models.Image, { onDelete: 'cascade' })
  }

  return Game
}
