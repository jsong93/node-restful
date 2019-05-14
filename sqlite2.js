const sqlite3 = require('sqlite3').verbose();
const dbname = 'jsongsqlite';
const db = new sqlite3.Database(dbname);

db.serialize(() => {
  const sql = `create table if not exists restful 
    (id integer primary key,title,content text)`;
  db.run(sql);
});

class Sqlite {
  static all(callback) {
    db.all(' select * from restful ', callback);
  }

  static find(id, callback) {
    db.get(' select * from restful where id = ? ', id, callback);
  }

  static create(data, callback) {
    const sql = ' insert into restful (title,content) values (?,?) ';
    db.run(sql, data.title, data.content, callback);
  }

  static delete(id, callback) {
    if (!id) return callback(new Error(`do not find ${id}`));
    db.run(' delete from restful where id = ? ', id, callback);
  }
}

module.exports = db;
module.exports.Sqlite = Sqlite;
