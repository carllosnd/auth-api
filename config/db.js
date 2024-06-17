import {Sequelize} from "sequelize"

// Replace username and password with your actual credentials
const username = 'root';
const password = 'hv12345';

const db = new Sequelize('hs_db', username, password, {
    host: '34.101.249.52', // Replace with your actual instance connection name
    dialect: 'mysql',
});

export default db