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
    platforms: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    genres: {
      type: DataTypes.STRING,
    },
    owned: {
      type: DataTypes.BOOLEAN,
    },
  })

  Game.associate = function (models) {
    Game.hasMany(models.Image, { onDelete: 'cascade' })
  }

  return Game
}
