const models = require("./models.js")

function postLogin(req, res){
    console.log("postLogin");
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    models.checkPassword(username, password, function(err, data) {
        if(err){
            console.log(err);
            res.render("error", {error: "Error logging in"});
        }else if(data.correct){
            req.session.user = data.id;
            res.redirect("/");
        }else{
            res.render("/login", {retry: true});
        }
    });
    
}
function postSignup(req, res){
    console.log("postSignup");
    var username = req.body.username;
    var password = req.body.password;
    var password2= req.body.password2;
    
    if(password != password2){
        res.json({success: false});
        return;
    }
    
    models.addUser(username, password, function(err, id){
        if(err){
            res.status(500).res.render("signup", {retry: true});
        }else{
            req.session.user = id;
            res.redirect("/");
        }
    });
}

function getLogin(req, res){
    res.render("login", {retry: false});
}
function getSignup(req, res){
    res.render("signup", {retry: false});
}

function getRoot(req, res){
    if(req.session.user){
        models.getUserInfo(req.session.user, function(err, data){
            res.render("main", {name: data.username});
        });
        
    }else{
        res.render("login", {retry: false});
    }
}

module.exports = {
    postLogin: postLogin,
    postSignup: postSignup,
    getLogin: getLogin,
    getSignup: getSignup,
    getRoot: getRoot
}