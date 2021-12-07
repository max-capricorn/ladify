const express = require('express');
const fse = require('fs-extra');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const fs = require('fs');

const appBase = '../app/src/';
app.get('/script', (req, res) => {
  const pid = req.query.pageId;
  const rpath = `${appBase}business/${pid}/index.js`;
  const contentText = fs.readFileSync(rpath);
  res.end(contentText);
});

app.post('/script', (req, res) => {
  const pid = req.query.pageId;
  const rpath = `${appBase}business/${pid}/index.js`;
  console.log(rpath);
  fse.outputFile(rpath, req.body.d, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`写入:${rpath}`);
    }
  });
  res.end('ok');
});

app.post('/saveLayout', (req, res) => {
  const pid = req.query.pageId;
  const rpath = `${appBase}pages/${pid}/layout.json`;
  fse.outputFile(rpath, JSON.stringify(req.body, null, 4), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`写入:${rpath}`);
    }
  });
  res.end('ok');
});

app.get('/getLayout', (req, res) => {
  const pid = req.query.pageId;
  const rpath = `${appBase}pages/${pid}/layout.json`;
  const contentText = fs.readFileSync(rpath);
  res.end(contentText);
});

// app.post('/saveFloorLayout', function (req, res) {
//   let pid = req.query.pageId;
//   let rpath = `${appBase}/pages/${pid}/floorLayout.json`;
//   fse.outputFile(rpath, JSON.stringify(req.body, null, 4), (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(`写入:${rpath}`);
//     }
//   });
//   res.end("ok");
// })

// app.get('/getFloorLayout', function (req, res) {
//   let pid = req.query.pageId;
//   let rpath = `${appBase}/pages/${pid}/floorLayout.json`;
//   let contentText = fs.readFileSync(rpath)
//   res.end(contentText);
// })

var server = app.listen(8081, () => {
  const host = server.address().address;
  const { port } = server.address();

  console.log('应用实例，访问地址为 http://%s:%s', host, port);
});
