//dependencias
const express = require('express'); //biblioteca que construye un servidor
const app = express();
const http = require('http');

//Import routes
const fpRoute = require('./routes/urRoute');

//Route Middlewares
app.use(express.json({limit: '50mb'}));
app.use('/',fpRoute);

//serving static-files for test-purpose / can be served directly by nginx
app.use('/public', express.static('./public'));

app.use('/public/static/scripts', express.static('/public/static/scripts/', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));


const PORT = 4500;
app.listen(PORT,() => console.log('server up and running at port',PORT));
