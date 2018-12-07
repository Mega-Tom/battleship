const express = require("express")
const url = require("url");
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4999;

const controllers = require("./controllers.js")

let app = express();

app.use(bodyParser.text())
app.use(express.static("static"))
app.set("views", "views")
app.set('view engine', 'ejs')
app.post('/login', controllers.postLogin);

app.listen(PORT, function(){console.log("Listining on port: " + PORT)})
