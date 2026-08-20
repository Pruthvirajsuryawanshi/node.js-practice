const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')

app.use(express.json())
let database = null
const dbpath = path.join(__dirname, 'mydatabase.db')

const startDatabaseAndServer = async () => {
  try {
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Database and server is started on port 3000')
    })
  } catch (e) {
    console.log('database error: ' + error)
  }
}

startDatabaseAndServer()
app.post("/register",async(req, res)=>{
    const {user_name, password} = req.body 
    const query =  `
    SELECT * FROM user WHERE user_name = '${user_name}'
    `
    const data = await database.get(query)
    if(data!=undefined){
        console.log("User Already Exists")
    }else{
        const hashedPassword = await bcrypt.hash(password, 10)
        const insertQuery = `
        INSERT INTO user(user_name, password) VALUES('${user_name}','${hashedPassword}')
        `
        await database.exec(insertQuery)
        console.log("User Created Successfully...")
    }
})

const logger = async(req, res, next)=>{
    const {user_name, password} = req.body

    const query =  `
    SELECT * FROM user WHERE user_name ='${user_name}'
    `
    const data = await database.get(query)
    if(data==undefined){
        console.log("User Doesn't Exist...")
        return
    }else{
        const isValid = await bcrypt.compare(password, data.password)
        if(!isValid){
            console.log("Invalid Credentials...")
            return
        }else{
            let payload = {user_name}
            const jsonWebToken = await jwt.sign(payload,"pruthvi")
            res.status(200).send(jsonWebToken)
             next()
        }   
    }  
}
const authenticate = async(req, res, next)=>{
    const autheader = req.headers["authorization"]
    if(autheader==undefined){
        console.log("autheader is not defined")
    }else{
        const key = autheader.split(" ")[1]
        const isValid = jwt.verify(key, "pruthvi",(error, payload)=>{
            if(error){
                console.log(error)
            }else{
                req.payload = {payload}
                next()
            }
        })
    }
    
}
app.post("/login",logger, async(req, res)=>{
    console.log("I am ok")
})
app.get("/user", authenticate, async(req, res)=>{
    const {payload} = req.payload
    console.log(payload.user_name)
})