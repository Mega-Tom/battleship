const modles = require("./modles.js")

function postLogin(req, res){
    console.log("postLogin");
    var username = req.body.username;
    var password = req.body.password;
    modles.checkPassword(username, password, function(err, goodPassword) {
        if(err){
            console.log(err);
            res.json({correct: false});
        }else if(goodPassword){
            res.json({correct: true});
        }else{
            res.json({correct: false});
        }
    });
    
}
function postSignup(req, res){
    
}

module.exports = {
    postLogin: postLogin,
    postSignup: postSignup
}