const express = require('express');
const cookieParser = require('cookie-parser');
const userService = require('./service/userService');
const { RouterConfig } = require('./SystemConfig');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    if(req.url.search('app') == -1){
        res.set('Cache-Control', 'private, max-age=86400, stale-while-revalidate=604800');
    }
    res.header("X-Powered-By", "MiFi-Server");
    next();
});

app.use('/', express.static('resources/public'));

app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store');
    if (userService.isLoggedIn(req)) {
        res.redirect(RouterConfig.home_page_uri);
    } else {
        res.sendFile(__dirname + '/resources/views/login.html');
    }
});
app.get('/home', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store');
    if (userService.isLoggedIn(req)) {
        res.sendFile(__dirname + '/resources/views/home.html');
    } else {
        res.redirect(RouterConfig.force_login_redirect_uris);
    }
});

app.use('/app', require('./controller/app'));
// app.use('/external', require('./controller/external'))


app.get('*', (req, res) => res.send('Ooi! where you are going ? Stay true to your path.'));

app.listen(port, () => {
    console.log('Server Started!\nlistening on port 0.0.0.0:'+port);
});
