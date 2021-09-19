/** class to make custom error */
class ExpressError extends Error{
    constructor(status, message){
        super()
        this.status = status
        this.message = message
    }
}

module.exports = ExpressError