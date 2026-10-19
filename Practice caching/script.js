const { startServerAndDatabase, dbConfig } = require('./server.js')



const createTable = `
CREATE TABLE STUDENT(
    name VARCHAR(200),
    age VARCHAR(200)    
    );
    `

const insertData = `
INSERT INTO student (name, age)
VALUES
    ('Rahul', 21),
    ('Priya', 22),
    ('Amit', 20),
    ('Sneha', 23),
    ('Pruthvi', 21),
    ('Rohit', 24),
    ('Neha', 19),
    ('Vikas', 25),
    ('Pooja', 22),
    ('Akash', 20);
`
const createDatabase = async () => {
    try {
        await startServerAndDatabase();
        await dbConfig.db.exec(createTable)
        console.log("database is created")
        await dbConfig.db.exec(insertData)
        console.log("data inserted")
    } catch (e) {
        console.log(e)
    }
}

createDatabase()