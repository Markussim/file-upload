import express, { Application } from 'express'
import upload, { FileArray } from 'express-fileupload'
import bodyParser from 'body-parser'
import fs from 'fs'
import mime from 'mime-types'
const app: Application = express()
const port = 5000
const clientdir: string = __dirname.substr(0, __dirname.length - 4) + "/client"
const uploaddir: string = __dirname.substr(0, __dirname.length - 4) + "/upload"

app.use(upload())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (_req: any, res: any) => {
    res.sendFile(clientdir + '/index.html')
})

app.post('/', (_req, _res) => {
    if (_req.files) {
        let file: FileArray = _req.files
        let filename = file.theFile.name
        let filedata: Buffer = file.theFile.data
        console.log(filename)

        let fileExtention = mime.extension(file.theFile.mimetype)

        if(file.theFile.size < 25000000 && !(fileExtention == false)) {
            fs.writeFile(uploaddir + "/" + generateP() + "." + fileExtention, filedata, function (err) {
                if (err) {
                    return console.log(err)
                }
                console.log("Saved file")

                _res.header('Content-Type','application/json');

                _res.send("{ \"upload\": \"successful\", \"link\" }")
            })
        } else {
            _res.send("{ \"upload\": \"failed\" }")
        }
        
    }
})

app.listen(port, () => console.log(`Example app listening on port port!`))

function generateP() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 1; i <= 32; i++) {
        var char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
} 