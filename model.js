const Sequelize = require("sequelize");

const sequelize = require("./dbConfig");

const RegisteredMsisdn = sequelize.define("registeredMsisdn", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    cardNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    msisdn: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    transaction_id: {
        type: Sequelize.STRING,
        allowNull: false
    },

    staffId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    suuid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customer_type: {
        type: Sequelize.STRING,
        allowNull: true
    },
    originalPayload: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    businessName: {
        type: Sequelize.STRING,
        allowNull: true
    }

});

module.exports = RegisteredMsisdn

