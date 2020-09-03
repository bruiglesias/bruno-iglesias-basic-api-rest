'use strict';

module.exports = {
 	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('user',
		{ 
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			birthdate:
			{
				type: Sequelize.STRING,
				allowNull: false
			},
			fbAuth:
			{
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			accValidate:
			{
				type: Sequelize.STRING,
				allowNull: false
			},
			passwordResetToken: {
				type: Sequelize.STRING,
				allowNull: true
			},
			passwordResetExpires:
			{
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				allowNull: true
			},
			createdAt:{
				type: Sequelize.DATE,
				allowNull: false
			},
			updatedAt:{
				type: Sequelize.DATE,
				allowNull: false
			},

		});
  	},

	down: (queryInterface, Sequelize) => {
    	return queryInterface.dropTable('user');
  	}
};
