const express = require("express");
const app = express();
// Express
const { Krunker: Api, OrderBy, UserNotFoundError, GameNotFoundError } = require("@fasetto/krunker.io");
const Krunker = new Api();
// Krunker
const uuidv4 = require('uuid/v4');
// uuid
const rateLimit = require("express-rate-limit");
// rate limiting for express
require("dotenv").config();
// done kno it dotenv
var helmet = require('helmet')
// express helmet for security
var custom = require('./functions.js')
//Custom Functions

//* Verion 1

//? | cd apiktracer
//? nodemon run | npm run dev 

//* to github.com
    //?
    //? git init
    //? git commit -am "Commit Message"
    //? git push origin master
    //?

//* to heroku.com
    //?
    //? heroku login
    //? git add keys.json
    //? git commit -am "Commit Message"
    //? git push heroku master
    //?
  
//?  NEXT STEPS #|# bumb mans trello
    //* Get maps/mods on player search
    //* fetch matchmaker.krunker.io
    //* add the other function to ratelimit object
    //* Implement faster Seaching for Names in a Hidden file

//? 1 = no rate limiting
//? 2 = rate limiting

app.use(helmet())
app.set('trust proxy', 1);

const Publiclimiter = rateLimit({
    //* Rate limiter error 429
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 10, // start blocking after 10 requests
    handler: function(req, res) {
        var name = req.params.sname.toLowerCase();
        var uuid = uuidv4();
        res.sendStatus(429)
        custom.Database(name, uuid, "BPublic", true, req, res, 1, "Public Limiter Blocked");
        res.end()
    }
});

app.get("/user/:name", Publiclimiter, async(req, res) => {
    // Krunker Open Public API endpoint enabled with rate limiting
    // var banned = process.env.BANNED_USERS.split()
    var uuid = uuidv4();
    var ver = process.env.VERSION;

    try {
        const user = await Krunker.GetProfile(req.params.name.toLowerCase());
        res.json({'stats':user,"uuid": uuid, "error": false,"API Explaintion": ""});
        custom.Database(req.params.name.toLowerCase(), uuid, route="Public", false, req, res, type=2, err=null, v=ver);  
    } 
    catch (e) {
        if (e instanceof UserNotFoundError) {
            res.json({'stats':null,"uuid": uuid, "error": true}); 
            custom.Database(req.params.name.toLowerCase(), uuid, route="EPublic", true, req, res, type=2, err=String(e), v=ver); 
        } else {
            res.json({'stats':null,"uuid": uuid, "error": true, "Explaintion":""}); 
            custom.Database(req.params.name.toLowerCase(), uuid, route="EPublic", true, req, res, type=2, err=String(e), v=ver); 
        }             
    }
    res.end() 
});

app.get("/game/:game", Publiclimiter, async(req, res) => {
    console.dir(req.hostname)
    res.send(`https://${req.hostname}/schema`)
});

app.get("/devuser/:sname/:pass?", async(req, res) => {
    // Private API endpoint not enabled with rate limiting
    var uuid = uuidv4();
    var ver = process.env.VERSION;

    if (req.params.pass == process.env.KEY) {
        try {
            const user = await Krunker.GetProfile(req.params.sname.toLowerCase());
            res.json({'stats':user, "uuid": uuid, "error": false });
            custom.Database(req.params.sname.toLowerCase(), uuid, "Private", false, req, res, type=1, err=null, v=ver);  
        } 
        catch (e) {
            if (e instanceof UserNotFoundError) {
                res.json({'stats':null,"uuid": uuid, "error": true}); 
                custom.Database(req.params.sname.toLowerCase(), uuid, "EPRivate", true, req, res, type=1, err=String(e), v=ver); 
            } else {
                res.json({'stats':null,"uuid": uuid, "error": true}); 
                custom.Database(req.params.sname.toLowerCase(), uuid, "EPrivate", true, req, res, type=1, err=String(e), v=ver); 
            }  
                       
        }
    } else {
        res.json({'stats': null, "uuid": uuid, "error": true}); 
        custom.Database(name, uuid, "TPrivate", true, req, res, 1);  
    }
    res.end()
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port ${PORT}`));
  