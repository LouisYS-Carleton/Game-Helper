const bcrypt = require('bcryptjs')

// this should set up the user table
module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes. INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        hashedPassword: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    });
    User.addHook('beforeCreate', function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    })

    User.prototype.validPassword = function(password){
        return bcrypt.compareSync(password, this.password)
    }

    return User
    
}
