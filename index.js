require("dotenv").config()

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')//THIS REQUIRED TO CHANGE POST ACTION OF A FORM TO PATCH OR ANYTHING ELSE
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const { isLoggedIn } = require('./middleware')
const { MongoClient } = require("mongodb")
const Cors = require("cors")

const userRoutes = require('./routes/users')
const itemRoutes = require('./routes/items')
const clientRoutes = require('./routes/clients')
const supplierRoutes = require('./routes/suppliers')
const orderRoutes = require('./routes/orders')
const ledgerRoutes = require('./routes/ledgers')
const expenseRoutes = require('./routes/expenses')
const reportRoutes = require('./routes/reports')
const showRoutes = require('./routes/show')

const mdbUri = process.env.DB_URL
const client = new MongoClient(mdbUri)

let itemCollection
let clientCollection
let supplierCollection

mongoose
  .connect(mdbUri)
  .then(async () => {
    console.log("Connected to MongoDB")
    try {
      await client.connect().then(() => console.log("Connected to MongoDB 2"))
      clientCollection = client.db("maxFood").collection("clients")
      supplierCollection = client.db("maxFood").collection("suppliers")
      itemCollection = client.db("maxFood").collection("items")
      app.listen(process.env.PORT || 3000, () => {
        console.log("Listening on PORT 3000")
      })
    } catch (e) {
      console.log(e)
    }
  })
  .catch((err) => {
    console.log(err)
  })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))//this is used to not be conflicted with other things
app.use(express.static(path.join(__dirname, 'public')))//PUBLIC IS THE DIRECTORY WHERE
//YOU STORE YOUR JS CODE CSS AND HTML
// AND USING PATH YOU CAN ACCESS IT FROM ANYWHERE
app.use(Cors())


const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//BROWSER USES MILLISECONDS SO WE HAVE TO CONVERT IT LIKE THIS
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(flash())
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())// THIS NEEDS TO BE AFTER SESSION
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//THIS IS FOR HOW TO STORE IT IN SESSION AND HOW NOT TO STORE IT IN SESSION
passport.deserializeUser(User.deserializeUser());//THIS ARE ADDED IN AUTOMATICALLY IN USER MODEL 

app.use((req, res, next) => {//should be above other middle ware
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');//HAVE ACCESS TO EVERY TEMPLATES
    res.locals.error = req.flash('error');
    next();
})

app.engine('ejs', ejsMate)//THIS ENABLES YOU TO USE BOILERPLATE
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/',showRoutes)
app.use('/', userRoutes, isLoggedIn)
app.use('/', itemRoutes)
app.use('/', clientRoutes)
app.use('/',supplierRoutes)
app.use('/',orderRoutes)
app.use('/',ledgerRoutes)
app.use('/',expenseRoutes)
app.use('/',reportRoutes)

app.post('/clients/axios',async function (req, res){
  if (req.body.val == "" || req.body.val.length < 3) {
      res.send([])
    } else {
      
        const result = await clientCollection.aggregate([
          { $match: { $expr : { 
            $eq: [ '$_id' , { $toObjectId: req.body.val } ] 
          } 
        } 
      }
        ]).toArray()
        
        res.send(result)
    }
})

app.post("/axiosautocomplete", async (req, res) => {
  if (req.body.val == "" || req.body.val.length < 3) {
    res.send([])
  } else {
    let result = await itemCollection
      .aggregate([
        {
          "$search": {
            "index": "itemSearch",
            "autocomplete": {
              "query": `${req.body.val}`,
              "path": "itemName",
              tokenOrder: "sequential",
            
            }
          }
        },
        { "$limit": 10 },
      ])
      .toArray()
    res.send(result)
  }
})

app.post("/axiosautocomplete1", async (req, res) => {
  if (req.body.val == "" || req.body.val.length < 3) {
    res.send([])
  } else {
    let result = await clientCollection
      .aggregate([
        {
          $search: {
            index: "clientSearch",
            autocomplete: {
              query: req.body.val,
              path: "name",
              tokenOrder: "sequential",
             
            },
          },
        },
        { $limit: 10 },
      ])
      .toArray()
    res.send(result)
  }
})

app.post("/axiosautocomplete2", async (req, res) => {
  if (req.body.val == "" || req.body.val.length < 3) {
    res.send([])
  } else {
    let result = await supplierCollection
      .aggregate([
        {
          $search: {
            index: "supplierSearch",
            autocomplete: {
              query: req.body.val,
              path: "name",
              tokenOrder: "sequential",
             
            },
          },
        },
        { $limit: 10 },
      ])
      .toArray()
    res.send(result)
  }
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!!', 404))
})

app.use(function (err, req, res, next) {
    const { status = 500 } = err
    if (!err.message) { err.message = 'Something went wrong' }
    res.status(status).render('404', { err })
})
