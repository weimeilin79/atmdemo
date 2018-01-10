//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    pgdb 		= require('pg');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var config = {
  user: 'syndesis',
  database: 'sampledb',
  host: '172.17.0.4',
  password: 'buCkvfx45X4NINmd',
  port: '5432'
};


var pool = null;  

var initDb = function(callback) {
  
  if (pgdb == null) return;
	
	pool = new pgdb.Pool(config);
		//client.connect(function(err, conn) {
	  //  if (err) {
	  //    callback(err);
	  //    return;
	  //};
   

};

const results = [];
app.get('/atms', function (req, res) {
  	// try to initialize the db on every request if it's not already
  	// initialized.
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
