const express = require("express")
const url = require("url");
const session = require("express-session")
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 4999;

const controllers = require("./controllers.js")

let app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: "null",
    resave: false,
    saveUninitalized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("static"))
app.set("views", "views")
app.set('view engine', 'ejs')
app.post('/login', controllers.postLogin);
app.post('/signup', controllers.postSignup);
app.get("/login", controllers.getLogin);
app.get("/signup", controllers.getSignup);

app.listen(PORT, function(){console.log("Listining on port: " + PORT)})
