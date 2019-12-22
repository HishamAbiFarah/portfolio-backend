// custom middleware, have to use next() or request will hang
// this middleware will be injected into the request pipeline with json() , (req,res)
// next() will make sure all other middleware functions will be executed..

function log (req,res,next){
   // console.log('logging..');
    next();
}

module.exports = log;