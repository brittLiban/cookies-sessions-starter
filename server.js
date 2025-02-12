import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session'

const app = express();

//global middleware
app.use(cookieParser());
app.use(express.static('./public'))
app.set("view engine", "pug");
app.set("views", "./views");

app.use(session({
    //password-ish
    secret: "Blue123445",
    //saving the cookie and data before using it
    saveUninitialized: true,
    // false - session data is only saved on request when something actually changes, true - saves session back to session store on every request
    resave: false,
    cookie: {
        httpOnly: true, 
        maxAge: 30 * 60 * 1000
    }
}))

//routes

app.get('/login', (req, res) =>{
    //set some session data
    // once you access this page, these values will be available on all the other routes as well 
    req.session.user = {
        name: "Liban Joe",
        email: "liban@gmail.com"

    }

    req.session.analytics = {
        pageViews: {
            dark: 0,
            light: 0,
            home: 0
        },
        totalViews: 0
    }

    res.status(200).redirect("/");
})
app.get("/", (req, res) => { 
    //writting cookies
    const EXPIRES = 30 * 60 * 1000; //millis
    res.cookie('lang', 'en', {maxAge: EXPIRES});
    res.cookie('lastVisited', new Date().toISOString(), {maxAge: EXPIRES})
    res.cookie('name', 'Liban', {maxAge: EXPIRES})

    //writting session data

    req.session.analytics.pageViews.home++;
    req.session.analytics.totalViews++;

    //reading cookies
    const theme = req.cookies.theme;

    res.status(200).render("home", {
        theme,
        analytics: req.session.analytics
    });

    
    
})

app.get('/page', (req, res) =>{
    res.status(200).render("page");
    
})

app.get('/theme/dark', (req, res) =>{
    const EXPIRES = 30 * 60 * 1000; //millis
    res.cookie('theme', 'dark-mode', {maxAge: EXPIRES});
    req.session.analytics.pageViews.dark++;
    req.session.analytics.totalViews++;
    res.redirect("/");
    
})

app.get('/theme/light', (req, res) =>{
    const EXPIRES = 30 * 60 * 1000; //millis
    res.cookie('theme', 'light-mode', {maxAge: EXPIRES});
    req.session.analytics.pageViews.light++;
    req.session.analytics.totalViews++;
    res.redirect("/");
    
})


const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
