import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

//global middleware
app.use(cookieParser());
app.use(express.static('./public'))
app.set("view engine", "pug");
app.set("views", "./views");

//routes
app.get("/", (req, res) => { 
    //writting cookies
    const EXPIRES = 30 * 60 * 1000; //millis
    res.cookie('lang', 'en', {maxAge: EXPIRES});
    res.cookie('lastVisited', new Date().toISOString(), {maxAge: EXPIRES})
    res.cookie('name', 'Liban', {maxAge: EXPIRES})

    //reading cookies
    const theme = req.cookies.theme;

    res.status(200).render("home", {
        theme
    });

    
    
})

app.get('/page', (req, res) =>{
    res.status(200).render("page");
})

app.get('/theme/dark', (req, res) =>{
    const EXPIRES = 30 * 60 * 1000; //millis
    res.cookie('theme', 'dark-mode', {maxAge: EXPIRES});
    res.redirect("/");
})

app.get('/theme/light', (req, res) =>{
    const EXPIRES = 30 * 60 * 1000; //millis
    res.cookie('theme', 'light-mode', {maxAge: EXPIRES});
    res.redirect("/");
})


const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
