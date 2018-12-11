const modles = require("./modles.js")

function postLogin(req, res){
    console.log("postLogin");
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    modles.checkPassword(username, password, function(err, goodPassword) {
        try{
            if(err){
                console.log(err);
                res.json({correct: false});
            }else if(goodPassword){
                res.json({correct: true});
            }else{
                res.json({correct: false});
            }
        }catch(x){
            console.log(x);
            res.json({correct: false});
        }
    });
    
}
function postSignup(req, res){
    console.log("postSignup");
    var username = req.body.username;
    var password = req.body.password;
    var password2= req.body.password2;
    
    if(password != password2){
        res.json({sucsess: false});
    }
    
    modles.addUser(username, password, function(err, id){
        if(err){
            res.status(500).json({sucsess: false, error: err});
        }else{
            req.session.user = id;
            res.json({sucsess: true});
        }
    });
}

module.exports = {
    postLogin: postLogin,
    postSignup: postSignup
}