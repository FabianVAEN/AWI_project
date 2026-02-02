const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('awi_db','postgres','postgres',{
    host:'localhost',
    dialect:'postgres', // Dialecto son las intricciones segun la base de datos que usemos
    port: 5435,
    logging: true
})

sequelize.authenticate()
    .then(() => console.log('Conexión exitosa'))
    .catch(err => console.log(`Error de conexión: ${err}`))

module.exports = sequelize