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
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";



var client = null;  

var initDb = function(callback) {
  
  if (pgdb == null) return;
		client = new pg.Client('postgresql://syndesis:CR4WSliXudeGlEsL@syndesis-db:5432/syndesis?sslmode=disable');
		client.connect(function(err, conn) {
	    if (err) {
	      callback(err);
	      return;
	  };
   

  });
};

const results = [];
app.get('/atms', function (req, res) {
  	// try to initialize the db on every request if it's not already
  	// initialized.
  	if (!db) {
    	initDb(function(err){});
  	}
 

  	// SQL Query > Select Data
    const query = client.query('SELECT * FROM ATMS ASC;');
    
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
