// express 是一个框架
const express = require('express');
// 消息解析体 用于post请求
const bodyParser = require('body-parser');
// 数据库
const Sqlite = require('./sqlite2').Sqlite;
// 可以下载指定url页面 并将html转化为简化版
// const read = require('node-readability');
const app = express();

// const url = 'http://www.jsong.wiki:1993/jsong/index.html';
// set PORT = 3001
// mpm start
// 但是没成功
// 但是在bush环境成功了
// cmd也成功了 powershell不行
// const port = process.env.PORT || 3000;

const articles = [{ title: 'jsong' }];

app.set('port', process.env.PORT || 3000);

// json 请求消息体
app.use(bodyParser.json());
// 支持表单请求消息体 x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/restful', (req, res, next) => {
  // res.send('Hello world');
  // res.send(articles);
  Sqlite.all((err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

// app.post('/articles', (req, res, next) => {
//   const article = { title: req.body.title };
//   articles.push(article);
//   res.send(article);
// });

app.get('/restful/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('fetching:', id);
  Sqlite.find(id, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

app.delete('/restful/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('delete', id);
  Sqlite.delete(id, err => {
    if (err) return next(err);
    res.send({ message: 'delete' });
  });
});

app.post('/restful', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  Sqlite.create({ title: title, content: content }, err => {
    if (err) return next(err);
    res.send('OK');
  });
});

// app.listen(port, () => {
//   console.log(`express web app no ${port}`);
// });

app.listen(app.get('port'), () => {
  console.log(`express web app no ${app.get('port')}`);
});
