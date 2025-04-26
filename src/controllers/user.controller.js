import {asyncHandler} from "../utils/asyncHandler.js"

const registrUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

export {
    registrUser
}