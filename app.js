const express = require('express')
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const Mydata = require("./models/mydataSchema");
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

// Auto refresh
liveReloadServer.watch(path.join(__dirname, 'public'));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.get('/', (req, res) => {
    Mydata.find().then((result) => {
        res.render("home", {mystitle: "Home Page", arr: result});
    }).catch((err) => {
      console.log(err);
    })
})

app.get('/sendRes', (req, res) => {
    res.sendFile("./views/sendRes.html", {root: __dirname})
})

app.post("/", (req, res) => {
    console.log(req.body);

    const data = new Mydata(req.body);

    data.save().then(() => {
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    })
});

mongoose.connect('mongodb+srv://Mohammed-div:Mknmkn97@cluster0.ivqpiii.mongodb.net/all-data?retryWrites=true&w=majority').then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch((err) => {
    console.log(err);
});