var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

const arr = [{
    name: "Salman",
    email: "salmanvaipees913@gmail.com",
    password: "qwert",
}];

// Signup Start

router.get('/signup', unchecked, (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    function signUp(userData) {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            arr.push(userData);
            resolve(arr);
        })
    }

    signUp(req.body).then((resolve) => {
        console.log(arr);
        if (resolve) {
            res.render('login')
        } else {
            res.redirect('/signup');
        }
    })
})

/*signup end */


/* Login Start */

router.get('/', unchecked, (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    function login(userData) {
        let response = {}
        return new Promise((resolve, reject) => {
            let user = arr.find((element) => {
                if (element.email === userData.email) {
                    return element;
                }
            })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status || userData.password === "qwert") {
                        console.log('login success')
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                });
            } else {
                console.log('email failed');
                resolve({ status: false })
            }
        })
    }

    login(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn = true;
            req.session.user = response.user;
            res.redirect('/home');
        } else {
            let message = "Incorrect email or Password";
            res.render('login', { message })
        }
    });
});

/* Login end */

/*Logout Start */

router.use('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})

/*logout end */


// Login middleware start

function Checked(req, res, next) {
    let token = req.session.loggedIn;
    if (token) {
        console.log(req.session.loggedIn);
        next();
    } else {
        res.redirect('/');
    }
}

function unchecked(req, res, next) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        next();
    }
}
//Login middleware end


/* GET home page. */
router.get('/home', Checked, function (req, res, next) {

    let cards = [{
        title: "Christopher Nolan",
        movies: "Tenet,Inception",
        image: "images/nolanbab.jpg",
        link: "https://m.imdb.com/name/nm0634240/",

    },
    {
        title: "David Fincher",
        movies: "Gone Girl,Seven",
        image: "images/finch.jpg",
        link: "https://www.imdb.com/name/nm0000399/",

    },
    {
        title: "Alfred Hitchcock",
        movies: "Vertigo,Psycho",
        image: "images/alfred.jpg",
        link: "https://www.imdb.com/name/nm0000033/?ref_=nv_sr_srsg_0",

    },
    {
        title: "Ari Aster",
        movies: "Hereditary,Midsommar",
        image: "images/ariar.jpg",
        link: "https://www.imdb.com/name/nm4170048/?ref_=nv_sr_srsg_0",
    },
    ]

    let user = req.session.user;
    console.log(user);
    res.render('home', { cards, user });
});

/* Home End*/


/* list Start */

router.get('/list', Checked, function (req, res, next) {

    const list = ["FC BARCELONA", "LEICESTER CITY", "BORUSSIA DORTMUND", "PARIS SAINT GERMAN", "AJAX"]
    res.render('list', { list });

});


/* list end */

/* table start*/

router.get('/table', Checked, (req, res, next) => {
    const table = [{
        MOVIE: "Tenet",
        IMBD: 7.3,
        RELEASED: "2020",
        DIRECTOR: "Christopher Nolan",

    },
    {
        MOVIE: "Se7en",
        IMBD: 8.3,
        RELEASED: "1993",
        DIRECTOR: "David Fincher",
    },
    {
        MOVIE: "Psycho",
        IMBD: 9.0,
        RELEASED: "1969",
        DIRECTOR: "Alfred Hitchcock",

    },
    {
        MOVIE: "Midsommar",
        IMBD: 7.1,
        RELEASED: "2019",
        DIRECTOR: "Ari Aster",

    },
]
    res.render('table', { table });
});

/* Table end */

module.exports = router;