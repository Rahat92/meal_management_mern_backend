const dotenv = require('dotenv');
const app = require('./app')
const connectToDb = require('./utils/DatabaseConnection')

dotenv.config({
    // path:'./config/.env'
    path:`${__dirname}/config/.env`
})


connectToDb()
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}