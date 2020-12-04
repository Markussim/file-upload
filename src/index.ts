import express, { Application } from "express";
import upload, { FileArray } from "express-fileupload";
import bodyParser from "body-parser";
import fs from "fs";
import mime from "mime-types";
var AWS = require("aws-sdk");
const creds: any = require("../credentials.json");
const app: Application = express();
const port = 5000;
const clientdir: string = __dirname.substr(0, __dirname.length - 4) + "/client";
const uploaddir: string = __dirname.substr(0, __dirname.length - 4) + "/upload";

var s3 = new AWS.S3({
  accessKeyId: creds.id,
  secretAccessKey: creds.pass,
});

app.use(upload());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (_req: any, res: any) => {
  res.sendFile(clientdir + "/index.html");
});

app.get("/image/*", async (_req, _res) => {
  let urlString: String = _req.url;
  if (typeof urlString.substring(7) == "string") {
    let data = await getFile(urlString.substring(7));
    _res.type(".png").send(data.Body);
  }
});

app.post("/", (_req, _res) => {
  if (_req.files) {
    let file: FileArray = _req.files;
    let filename = file.theFile.name;
    let filedata: Buffer = file.theFile.data;
    console.log(filename);

    let fileExtention = mime.extension(file.theFile.mimetype);

    if (file.theFile.size < 100000000 && !(fileExtention == false)) {
      let fileName = file.theFile.md5 + "." + fileExtention;
      let filepath = uploaddir + "/" + fileName;

      let params = { Bucket: "markussim-production", Key: fileName, Body: filedata };

      s3.putObject(params, function (err: any, data: any) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully uploaded data to myBucket/myKey");
          _res.header("Content-Type", "application/json");
          _res.send(
            `{ \"upload\": \"successful\", \"link\": \"/image/${fileName}\"}`
          );
        }
      });
    } else {
      _res.send('{ "upload": "failed" }');
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port port!`));

function generateP() {
  var pass = "";
  var str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 1; i <= 32; i++) {
    var char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

async function getFile(fileName: any) {
  var getParams: any = {
    Bucket: "markussim-production", //replace example bucket with your s3 bucket name
    Key: fileName, // replace file location with your s3 file location
  };

  console.log(fileName);

  try {
    return await s3.getObject(getParams).promise();
  } catch (error) {
    return false;
  }
}
