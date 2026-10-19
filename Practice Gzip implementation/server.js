const express = require('express')
const compression = require("compression")
const app = express()
app.use(compression({ threshold: 0 }))
app.use(express.json())
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const NodeCache = require('node-cache')

const cache = new NodeCache({
    stdTTL: 10
})

const dbConfig = {
    db: null
};
const dbpath = path.join(__dirname, 'practice-cache.db')

const startServerAndDatabase = async () => {

    try {
        dbConfig.db = await open({
            filename: dbpath,
            driver: sqlite3.Database,
        })

        app.listen(3000, () => {
            console.log("server is started on port 3000")
        })
    } catch (error) {
        console.log(error)
    }
}

app.get('/students', async (req, res) => {

    try {
        if (cache.has("students")) {
            console.log("Cache HIT")
            return res.send(cache.get("students"))
        } else {
            console.log("Cache MISS")
            const query = `
            SELECT * FROM STUDENT
        `
            const studentsData = await dbConfig.db.all(query)
            cache.set("students", studentsData)
            res.send(studentsData)
        }
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).send(error)
    }

})


app.put("/update-students", async (req, res) => {
    const { name, age } = req.body
    const query = `
        UPDATE 
            student
        SET 
            age = ?
        WHERE 
            name = ?
    `
    await dbConfig.db.run(query, [age, name])
    cache.del("students")
    res.status(200).send("database updated successfully...")
})
if (require.main == module) {
    startServerAndDatabase().catch(console.error);
}


module.exports = { startServerAndDatabase, dbConfig }