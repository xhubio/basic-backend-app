'use strict'

const express = require('express')

const app = (module.exports = express())
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

import { ImporterSpreadSheet } from '@xhubio/table-import-spreadsheet-all'
const importer = new ImporterSpreadSheet()

app.get('/', function(req, res) {
  res.render('index', {})
})

/*
app.get('/', function(req, res) {
  res.send(
    '<form method="post" enctype="multipart/form-data">' +
      '<input id="input-b1" name="xlsFile" type="file" class="file">' +
      '<p><input type="submit" value="Upload Decision Table" /></p>' +
      '</form>'
  )
})
*/

app.post('/', upload.single('xlsFile'), function(req, res) {
  importer.loadFromBuffer(req.file.buffer)

  res.render('index', { result: JSON.stringify(importer.tables) })
})
