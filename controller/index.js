const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const parser = express.json();


app.use((req,res,next)=> ignoreParsing(req) ? next() : parser(req, res, next))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    // if (req.url.search('/app/') == -1) {
    //     res.set('Cache-Control', 'private, max-age=86400, stale-while-revalidate=604800');
    // }
    res.header("X-Powered-By", "MiFi-Server");
    next();
});

app.use('/', express.static('resources/public'));

app.use('/', require('./pages'));
app.use('/app', require('./app'));
app.use('/admin', require('./admin'));
// app.use('/external', require('./controller/external'))

app.get('/image/format/*',(req,res)=>{
    res.sendFile(path.resolve('resources/public/image/format/app.svg'));
});
app.get('*', (req, res) => res.send('Ooi! where you are going ? Stay true to your path.'));

module.exports = server ={
    start: () => {
        let server = app.listen(port, () => {
            console.log(' [SLOG]   Server Started!\n [INFO]   Listening on 0.0.0.0:' + port);
        });
        server.timeout = 5000;
    },
    stop: () => {
        app.close(()=>{
            console.log(' [SLOG] Server closed' + Date.now());
        });
    }
}



// ================= middleware =============== //

function ignoreParsing(req){
    if(req.originalUrl == '/app/u/file' && req.method == 'POST') return true;
    return false;
}