const dotenv = require('dotenv');
const app = require('./app')
const connectToDb = require('./utils/DatabaseConnection')

dotenv.config({
    // path:'./config/.env'
    path:`${__dirname}/config/.env`
})


connectToDb()
app.listen(process.env.PORT || 5000, () => {
    console.log(`The app is running on port ${process.env.PORT} `)
})