var d = new Date();
// datetime
const admin = require('firebase-admin');
// Firebase (Firestore)
const uuidv4 = require('uuid/v4');

module.exports = {
    initer: function (){
        let serviceAccount = require('./keys.json');
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        let db = admin.firestore();
        return db
    },
    Database : function (name, uuid, route=null, kres=null, req=req, res=res, type=null, err=null, v=null){
        // initialize database
        var db = module.exports.initer();

        // Collection Name
        var short_uuid = uuid.substr(0, 8);
        var doct = `${name}-${short_uuid}`;

        // Collection info
        var epoch =  Math.floor(new Date() / 1000);
        var time = res.get('Date') || new Date().toString();
        var agent = req.get("User-Agent") || null;
        var ip = req.get('x-forwarded-for') ||  req.get('host') || req.socket.localAddress;
        var dev = route;
        var slink = `https://apiktracer.herokuapp.com/user/${name}`;
        var link = `https://krunker.io/social.html?p=profile&q=${name}`;

        let stats = {
            uuid: uuid, epoch: epoch,
            userresponse: kres, route: route,
            ip: ip, name: name,
            time: time, link: link,
            slink: slink, agent: agent,
            error: err, type: ["Node.js", v]
        }
        let docRef = db.collection('database').doc(doct).set(stats, {merge: true});

        if (type === 2) {
            return console.log(`${ip},${short_uuid},${name},${time},${epoch},${req.protocol},${req.method},${req.originalUrl},HTTP/${req.httpVersion},${req.rateLimit['limit']},${req.rateLimit['current']},${req.rateLimit['remaining']},${res.statusCode},${res.get('content-length')},${dev}`)
        } else if (type === 1) {
            return console.log(`${ip},${short_uuid},${name},${time},${epoch},${req.protocol},${req.method},${req.originalUrl},HTTP/${req.httpVersion},X,X,X,${res.statusCode},${res.get('content-length')},${dev}`)
        }
    }
}