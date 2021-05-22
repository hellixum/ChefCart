'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(45), 
        allowNull: false
      }, 
      address: {
        type: DataTypes.STRING, 
        allowNull: false
      },
      ref_email: {
        type: DataTypes.STRING(45), 
        allowNull: false, 
        references: {
          model: 'refrees', 
          key: 'email'
        }
      },
      reward: {
        type: DataTypes.INTEGER, 
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
    await queryInterface.dropTable('leads');
  }
};