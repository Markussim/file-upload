const express = require('express')
const upload = require('express-fileupload')
const app = express()
const port = 5000

app.use(upload())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')

})

app.post('/', (req, res) => {
    if (req.files) {
        console.log(req.files)
    }
})

app.listen(port, () => console.log(`Example app listening on port port!`))