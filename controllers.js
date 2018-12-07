const modles = require("./modles.js")

async function postLogin(req, res){
    console.log("postLogin");
    var username = req.body.username;
    var password = req.body.password;
    modles.checkPassword(username, password).then(function(goodPassword) {
        if(goodPassword){
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