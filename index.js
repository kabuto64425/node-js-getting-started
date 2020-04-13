const express = require('express')
const path = require('path')
const pg = require('pg')
const PORT = process.env.PORT || 5000

var pool = pg.Pool ({
  host: 'ec2-34-204-22-76.compute-1.amazonaws.com',
  databese: 'd4t9vmtvadroi7',
  user: 'jzcqnyvlmwovjp',
  port: 5432,
  password: 'b249ce1d8b423de80a9ae5fe0bb6d588d0154d183a627265b0a24ebb07a3f51f',
});

pool.connect(function(err, client, done) {
  if (err) {
    console.log(err);
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
