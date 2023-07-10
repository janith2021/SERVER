const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const connect = require('./database/connection');
const dotenv = require('dotenv');
const router = require('./routes/route');

const app = express();
dotenv.config();
app.use(express.json())
app.use(cors())
app.use(morgan('tiny')); 
app.disable('x-powered-by'); //Less Hackers can get the Details of Our Stack

const port = 5000; 

app.use('/api',router)

connect().then(()=>{
    try {
        app.listen(port, () => {
          console.log(
            `Server Started and connected to http://localhost:${port}`
          );
        });

    } catch (error) {
        console.log('We could not cannot to the Server')
    }
}).catch(error => {
    console.log("Invalid Database Connection")
})


