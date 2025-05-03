import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"




const generateAccessAndRefereshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registrUser = asyncHandler(async (req, res) => {

    // get data fron frontend
    // check for validation
    // check if user already exist
    // upload file -- check avatar
    // upload on cloudinary
    // create user object,  create entry in data 
    // remove password and refresh token from response
    // check for user creation
    // return response


    const {username, fullName, email,password} = req.body

    if([username, fullName, email,password].some((field)=> field?.trim==="")){
        throw new apiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new apiError(409, "user with username or email already exist")
    }

    // const avatarLocalPath = req.file?.avatar[0]?.path;
    // const coverImageLocatPath = req.file?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is required")
    }
  
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Somthing went wrong while uploading the user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res)=>{
    // get user data
    // validation
    // find user in database
    // password cheack
    // access and refresh token
    // send cookies

    const {email,username, password}= req.body

    if(!(email || username)){
        throw new apiError(400,"username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(404,"user does not exist")
    }

    const isPassordValid = await user.isPassordCorrect(password)

    if(!isPassordValid){
        throw new apiError(401,"Password is incorrect")
    }

    const {accessToken, refreshToken}= await generateAccessAndRefereshTokens(user._id)
    const loggedIn = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new apiResponse(
            200,
            {
                user: loggedIn, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // remove the fileld from document
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new apiResponse(200, {}, "User logged out"))
})




export {
    registrUser,
    loginUser,
    logoutUser
}