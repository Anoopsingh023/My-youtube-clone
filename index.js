require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const githubData = {
    "login": "Anoopsingh023",
    "id": 148649256,
    "node_id": "U_kgDOCNw1KA",
    "avatar_url": "https://avatars.githubusercontent.com/u/148649256?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Anoopsingh023",
    "html_url": "https://github.com/Anoopsingh023",
    "followers_url": "https://api.github.com/users/Anoopsingh023/followers",
    "following_url": "https://api.github.com/users/Anoopsingh023/following{/other_user}",
    "gists_url": "https://api.github.com/users/Anoopsingh023/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Anoopsingh023/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Anoopsingh023/subscriptions",
    "organizations_url": "https://api.github.com/users/Anoopsingh023/orgs",
    "repos_url": "https://api.github.com/users/Anoopsingh023/repos",
    "events_url": "https://api.github.com/users/Anoopsingh023/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Anoopsingh023/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Anoop Kumar Singh",
    "company": null,
    "blog": "https://anoopsingh023.github.io/portfolio/",
    "location": "Ghaziabad",
    "email": null,
    "hireable": null,
    "bio": "Aspiring Frontend Web Developer | HTML5 | CSS | JavaScript | React | Python | Java | DSA | UI/UX Enthusiast",
    "twitter_username": null,
    "public_repos": 8,
    "public_gists": 0,
    "followers": 0,
    "following": 2,
    "created_at": "2023-10-21T17:51:30Z",
    "updated_at": "2025-04-21T02:29:38Z"
  }

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/git', (req,res) => {
    res.json(
        // githubData.bio,
        githubData.following
    )
})

app.get('/ak', (req, res) => {
    res.send('my name is ak')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})