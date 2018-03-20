'use strict'

const express = require('express')
const XLSX = require('xlsx')

const app = (module.exports = express())
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

import { ExporterDecisionTable } from '@xhubio/table-export-spreadsheet-decision'
import { createModelFromBuffer } from '@xhubio/table-model-decision'
import { ImporterSpreadSheet } from '@xhubio/table-import-spreadsheet-all'

const exportFileName = 'decision_table.xlsx'
const importer = new ImporterSpreadSheet()

app.get('/', function(req, res) {
  res.render('index', {})
})

app.get('/download', function(req, res) {
  const tableModel = createModelFromBuffer(importer.tables)

  const exporter = new ExporterDecisionTable()
  exporter.addWorksheet(tableModel)

  //XLSX.stream.to_csv(tableModel).pipe(res)

  const writePromise = exporter.write(exportFileName)
  res.download(writePromise)
})

app.post('/', upload.single('xlsFile'), function(req, res) {
  importer.loadFromBuffer(req.file.buffer)
  res.render('index', { result: JSON.stringify(importer.tables) })
})
