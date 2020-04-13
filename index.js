const express = require('express')
const path = require('path')
const pg = require('pg')
const PORT = process.env.PORT || 5000

exports.pool = pg.Pool ({
  host: process.env.ENV_HOST,
  databese: process.env.ENV_DATABASE,
  user: process.env.ENV_USER,
  port: 5432,
  password: process.env.ENV_PASSWORD,
});

exports.pool.connect((err, client) => {
  if (err) {
    console.log('err');
  } else {
    console.log('success');
  }
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

console.log(process.env.ENV_HOST);
console.log(process.env.ENV_DATABASE);
console.log(process.env.ENV_USER);
console.log(process.env.ENV_PASSWORD);

/*express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/
