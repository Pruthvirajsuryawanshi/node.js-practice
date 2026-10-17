const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}))


app.listen(3000, () => {
    console.log('Server is started on port 3000')
})


app.get('/test-cors', async (req, res) => {
    console.log('cors tested successfully...')
    res.status(200).json({
        success: true,
        message: "CORS started successfully..."
    })
})
