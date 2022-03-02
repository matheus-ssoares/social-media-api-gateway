'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users_credentials', 'external_id', {
      type: Sequelize.STRING,
    });
  },

  down: async queryInterface => {
    return queryInterface.removeColumn('users_credentials', 'external_id');
  },
};
