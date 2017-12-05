'use strict'

// self
const DatRepl = require('.')
const pkg = require('./package.json')

// npm
const updateNotifier = require('update-notifier')

const rr = new DatRepl({ pkg, datKey: process.argv[2] })
rr.start()
updateNotifier({ pkg }).notify()
