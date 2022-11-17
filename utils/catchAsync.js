module.exports = function(fn){ //USED JUST FOR async FUNCTIONS THAT CATCH ERRORS AND PASSES IT
    return function(req, res, next){
        fn(req, res, next).catch(next)
    }
}