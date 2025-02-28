'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // email: DataTypes.STRING,
  // password: DataTypes.STRING,
  // firstName: DataTypes.STRING,
  // lastName: DataTypes.STRING,
  // address: DataTypes.STRING,
  // gender: DataTypes.BOOLEAN,
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'PhanVan',
      lastName: 'Thanh',
      address: 'Hue',
      gender: 1,
      typeRole: 'ROLE',
      keyRole: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { email: 'admin@gmail.com' }, {});
  }
};
