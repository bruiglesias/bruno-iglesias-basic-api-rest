const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');


class User extends Model{
    static init(sequelize){
        super.init({ 
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            password: DataTypes.STRING,
            birthdate: DataTypes.STRING,
            fbAuth: DataTypes.BOOLEAN,
            accValidate: DataTypes.BOOLEAN,
            passwordResetToken: DataTypes.STRING,
            passwordResetExpires: DataTypes.DATE
		},
        {
            hooks: {
                beforeCreate: async (user, options) => {
                    user.password = await bcrypt.hash(user.password, 10);
                },
              },
            sequelize,
			tableName: 'user',
        });
    }
}

module.exports = User;