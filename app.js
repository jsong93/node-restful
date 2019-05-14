// express 是一个框架
const express = require('express');
// 消息解析体 用于post请求
const bodyParser = require('body-parser');
// 数据库
const Article = require('./sqlite').Article;
// 可以下载指定url页面 并将html转化为简化版
const read = require('node-readability');
const app = express();

const url = 'http://www.jsong.wiki:1993/jsong/index.html';
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

app.get('/articles', (req, res, next) => {
  // res.send('Hello world');
  // res.send(articles);
  Article.all((err, articles) => {
    if (err) return next(err);
    // 根据请求发送相应格式的相应
    res.format({
      html: () => {
        // 为什么一定要找views 文件夹中的文件呢
        res.render('article.ejs', { articles: articles });
      },
      json: () => {
        res.send(articles);
      }
    });
    // res.send(articles);
  });
});

// app.post('/articles', (req, res, next) => {
//   const article = { title: req.body.title };
//   articles.push(article);
//   res.send(article);
// });

app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('fetching:', id);
  // 只能有一个send()
  // res.send(articles[id]);
  Article.find(id, (err, article) => {
    if (err) return next(err);
    // res.send(article);
    res.format({
      html: () => {
        // 为什么一定要找views 文件夹中的文件呢
        res.render('article.ejs', { articles: article });
      },
      json: () => {
        res.send(article);
      }
    });
  });
});

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('delete', id);
  // delete articles[id];
  Article.delete(id, err => {
    if (err) return next(err);
    res.send({ message: 'delete' });
  });
});

app.post('/articles', (req, res, next) => {
  const url = req.body.url;
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('error downloading');
    Article.create(
      { title: result.title, content: result.content },
      (err, article) => {
        if (err) return next(err);
        res.send('OK');
      }
    );
  });
});

// app.listen(port, () => {
//   console.log(`express web app no ${port}`);
// });

app.listen(app.get('port'), () => {
  console.log(`express web app no ${app.get('port')}`);
});
