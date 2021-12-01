const express = require('express')
const fse = require("fs-extra");
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

var fs = require("fs");

var appBase = '../app/src/'
app.get('/script', function (req, res) {
  let pid = req.query.pageId;
  let rpath = `${appBase}business/${pid}/index.js`;
  let contentText = fs.readFileSync(rpath)
  res.end(contentText);
})

app.post('/script', function (req, res) {
  let pid = req.query.pageId;
  let rpath = `${appBase}business/${pid}/index.js`;
  console.log(rpath)
  fse.outputFile(rpath, req.body.d, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`写入:${rpath}`);
    }
  });
  res.end("ok");
})

app.post('/saveLayout', function (req, res) {
  let pid = req.query.pageId;
  let rpath = `${appBase}pages/${pid}/layout.json`;
  fse.outputFile(rpath, JSON.stringify(req.body, null, 4), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`写入:${rpath}`);
    }
  });
  res.end("ok");
})

app.get('/getLayout', function (req, res) {
  let pid = req.query.pageId;
  let rpath = `${appBase}pages/${pid}/layout.json`;
  let contentText = fs.readFileSync(rpath)
  res.end(contentText);
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
