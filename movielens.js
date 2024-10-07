const sqlite3 = require('sqlite3').verbose()

let movielens = new sqlite3.Database('movielens.db', (err) => {
    if (err) {
      console.error('**ERROR:', err.message)
      throw err
    } 
    else {
      console.log('**SERVER: connected to movielens database...')
    }
});

module.exports = movielens;
