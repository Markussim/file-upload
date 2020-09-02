const express = require('express')
const upload = require('express-fileupload')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html')

})
app.listen(port, () => console.log(`Example app listening on port port!`))