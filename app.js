const express = require("express");
const dotenv = require("dotenv")
const createError = require("http-errors")
const logger = require("morgan")
const helmet = require ("helmet")

dotenv.config();


const errorHandler = require("./src/middleware/errorhandler");
const { default: listEndpoints } = require("list_end_points");
const router = require("./src/routes");
const { connectDB } = require("./src/config/db");

const app = express();
const port =process.env.PORT;

app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use("", router);



app.use(errorHandler);
listEndpoints(app);

connectDB().then(()=>
app.listen( port,()=>{
    console.log(`app run on ${port}`)
})
)
module.exports = app;



