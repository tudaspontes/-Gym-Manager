const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const methodOverride = require('method-override')

const server = express()

// setting express to read static files and the route file

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))
server.use(methodOverride('_method'))
server.use(routes)

// setting the template engine

server.set("view engine", "njk")

nunjucks.configure("views", {
    express:server,
    autoescape: false,
    noCache: true
    
})

// listening the server

server.listen(5000, function() {
    console.log("server is running")
})