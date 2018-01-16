//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    pgdb 		= require('pg');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
		POSTGRESHOST = process.env.POSTGRES_DB_SERVICE_HOST|| '172.17.0.4',
		POSTGRESUSER = process.env.POSTGRES_DB_SERVICE_USER|| 'sampledb',
		POSTGRESDATABASE = process.env.POSTGRES_DB_SERVICE_DATABASE|| 'sampledb',
		POSTGRESPWD = process.env.POSTGRES_DB_SERVICE_PWD|| 'Erp0UpSIIB1McFwG',
		POSTGRESPORT = process.env.POSTGRES_DB_SERVICE_PORT|| 5432;
var config = {
  user: POSTGRESUSER,
  database: POSTGRESDATABASE,
  host: POSTGRESHOST,
  password: POSTGRESPWD,
  port: POSTGRESPORT
};


var pool = null;  
var initDb = function(callback) {
  
  if (pgdb == null) return;
	pool = new pgdb.Pool(config);
	

};


app.get('/', function (req, res) {
  if (!pool) {
    	initDb(function(err){});
  }
  var result = null;
 	pool.query('SELECT address ,lat ,lng FROM ATMS;', function(err, resp) {
		  if (err) throw err
		  
		  result = JSON.stringify(resp.rows);
		 	console.log(result);
  		res.render('index.html', {atmresults:result } );
	})
	
    
});


app.get('/atms', function (req, res) {
  	if (!pool) {
    	initDb(function(err){});
  	}
  	
  	pool.query('SELECT * FROM ATMS;', function(err, res) {
		  if (err) throw err
		  console.log(res.rows);
		  return res.json;
		})
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Database. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
