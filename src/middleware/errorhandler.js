const createError = require("http-errors");
const errorHandler = (err, req, res, next) =>{
    console.error(err);
    if (err.expose === true){
        res.status(err.status || 500).send(err);
    }else{
        res.status(500).send(createError.InternalServerError())
    }
};

module.exports = errorHandler;




//status code
//1. 500 - internal server error
//2. 201 - user logged in 
//2. 200 - user creation sucesss
//3. 404 - bad request 
//4. 