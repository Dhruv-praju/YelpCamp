/** Helper function that catches errors in async fucntion and passes to Error handler middleware */
function catchAsync(fn){        // it will take an async function which may throw err
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))  // go to next error handler if error is thrown
    }
}

module.exports = catchAsync