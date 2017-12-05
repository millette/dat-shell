'use strict'

// self
const DatRepl = require('.')

const rr = new DatRepl({ key: process.argv[2] })
rr.start()
