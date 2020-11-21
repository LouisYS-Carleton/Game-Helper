import { Sequelize } from '/index.js';
const bcrypt = require('bcryptjs')

//this should set up the user table
module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: sequelize. INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        hashedPassword: {
            type: Sequelize.STRING(64),
            allowNull: false
        }
    });
    User.addHook('beforeCreate', function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
      })
      return User
    }
    User.prototype.validPassword = function(password){
        return bcrypt.compareSync(password, this.password)
    }

    // create all defined tables
    sequelize.sync()
        .then(() => console.log('User table has been created'))
        .catch(error => console.log('Error Ocurred', error));
    
}
