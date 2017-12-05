'use strict'

// self
const DatRepl = require('.')

// npm
const updateNotifier = require('update-notifier')

updateNotifier({ pkg: require('./package.json') }).notify()

const rr = new DatRepl({ key: process.argv[2] })
rr.start()
