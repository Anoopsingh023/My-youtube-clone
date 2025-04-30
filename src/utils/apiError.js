class apiError extends Error{
    constructor(
        statuscode,
        error=[],
        message="somthing went wrong",
        stack=""
    ){
        super(message)
        this.statuscode=statuscode,
        this.error=error,
        this.message=message,
        this.data=null,
        this.success = false

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiError}