const { initializeDatabaseAndServer } = require('./index.js')

const query = `
CREATE TABLE student(
    name VARCHAR(200),
    PHOTO_LOCATION VARCHAR(500) 
);
`
let db = null;
const createDatabase = async () => {
    db = await initializeDatabaseAndServer()
    try {
        await db.run(query)
        console.log("Database is created")
    } catch (e) {
        console.log(e.message)
    }
}

createDatabase()