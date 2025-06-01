import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import bodyParser from "body-parser"

const app = express() 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// Import router

import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import tweetRouter from "./routes/tweet.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import playlistRouter from "./routes/playlist.route.js"
import likeRouter from "./routes/like.route.js"
import dashboardRouter from "./routes/dashboard.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboards", dashboardRouter)


export {app}