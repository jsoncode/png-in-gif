import fs from 'fs'
import got from 'got'
import FormData from 'form-data'

// upload file
const form = new FormData();
form.append('files[]', fs.createReadStream('GIF6-Optmized-old.gif'));

let upload = await got.post('https://extractgif.imageonline.co/ajax_upload_file.php', {
    body: form
}).on('uploadProgress', progress => {
    console.log(progress)
});
let data = JSON.parse(upload.body)

// get file list from gif
let body = 'name[]=' + data.files[0].name
let fileList = await got.post('https://extractgif.imageonline.co/script.php', {
    body: body,
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'content-length': body.length
    }
})
let zip = fileList.body.match(/http[^'"]+?\.zip/)?.[0]
let zipName = zip.match(/[^=]+\.zip$/)?.[0]

// download file list
const stream = got.stream(zip)
let writeStream = fs.createWriteStream(zipName);
stream.pipe(writeStream);

writeStream.on('close', e => {
    console.log('zip completed')
})
