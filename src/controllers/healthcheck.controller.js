import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const healthcheck = asyncHandler(async(req,res)=>{
    return res
        .status(200)
        .json(
            new apiResponse(200, { status: 'ok' }, 'Server is healthy')
        );
});


export {healthcheck}