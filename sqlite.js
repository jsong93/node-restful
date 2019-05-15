const sqlite3 = require('sqlite3').verbose();
const dbname = 'jsong.sqlite';
const db = new sqlite3.Database(dbname);

db.serialize(() => {
  const sql = `create table if not exists articles 
    (id integer primary key,title,content text)`;
  db.run(sql);
});

class Article {
  static all(callback) {
    db.all(' select * from articles ', callback);
  }

  static find(id, callback) {
    db.get(' select * from articles where id = ? ', id, callback);
  }

  static create(data, callback) {
    const sql = ' insert into articles (title,content) values (?,?) ';
    db.run(sql, data.title, data.content, callback);
  }

  static delete(id, callback) {
    if (!id) return callback(new Error(`do not find ${id}`));
    db.run(' delete from articles where id = ? ', id, callback);
  }
}

module.exports = db;
module.exports.Article = Article;
