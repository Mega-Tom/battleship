const modles = require("./modles.js")

function postLogin(req, res){
    console.log("postLogin");
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    modles.checkPassword(username, password, function(err, data) {
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
    
    modles.addUser(username, password, function(err, id){
        if(err){
            res.status(500).json({success: false, error: err});
        }else{
            req.session.user = id;
            res.json({success: true});
        }
    });
}

function getLogin(req, res){
    res.render("login", {});
}
function getSignup(req, res){
    res.render("signup", {});
}

module.exports = {
    postLogin: postLogin,
    postSignup: postSignup,
    getLogin: getLogin,
    getSignup: getSignup
}