const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
const dbpath = './database.db'

const multer = require('multer');


const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: async (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }

})

const initializeDatabaseAndServer = async () => {
    try {

        db = await open({
            filename: dbpath,
            driver: sqlite3.Database,
        })

        app.listen(3000, () => {
            console.log('Server is started on 3000')
        })
        return db
    } catch (e) {
        console.log("error:" + e)
    }
}

initializeDatabaseAndServer()

app.post('/photos', upload.single('photo'), async (req, res) => {
    const photo = req.file
    console.log(photo)

    const query = `
    INSERT INTO 
        student(name,PHOTO_LOCATION )
    VALUES(?,?);
    `
    await db.run(query, ["Pruthviraj",
        photo.path,])
    console.log('photo uploaded successfully...')
    res.send('photo uploaded successfully...')

})


app.post('/photos/multiple', upload.array('photos', 3), async (req, res) => {
    const file = req.files
    console.log(file[0])
    console.log("file uploaded successfully")
    console.log(file)
    res.status(200).send("file uploaded successfulyy")
})
app.use((err, req, res, next) => {
    console.log('error: ' + err)
    res.status(400).json({
        message: err.message,
        code: err.code
    })
})

app.get("/photo", async (req, res) => {
    const { name } = req.query
    const query = `
    SELECT * FROM student WHERE name = ?    `
    const result = await db.get(query, [name])
    console.log('photo fetched successfully...')

    const photoPath = path.resolve(__dirname, result.PHOTO_LOCATION)
    res.status(200).sendFile(photoPath)
})

module.exports = { initializeDatabaseAndServer }