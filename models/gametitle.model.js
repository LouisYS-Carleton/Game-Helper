const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class GameTitle extends Model {
    static associate (models) {
      GameTitle.hasMany(models.Post, { onDelete: 'cascade' })
    }
  }
  GameTitle.init({ name: DataTypes.STRING }, { sequelize })

  return GameTitle
}