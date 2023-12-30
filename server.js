const dotenv = require('dotenv');
const app = require('./app')
const connectToDb = require('./utils/DatabaseConnection')

dotenv.config({
    // path:'./config/.env'
    path:`${__dirname}/config/.env`
})


connectToDb()
console.log(process.env.NODE_ENV);
app.listen(process.env.PORT, () => {
    console.log(`The app is running on port ${process.env.PORT} `)
})