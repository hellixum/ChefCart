'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('refrees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      uuid : {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4
      },
      first_name: {
        type: DataTypes.STRING(45), 
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(45), 
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(45), 
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.STRING(45), 
        allowNull: false
      }, 
      password: {
        type: DataTypes.STRING(300), 
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refrees');
  }
};