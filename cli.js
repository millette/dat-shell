#!/usr/bin/env node

/*
dat-shell
Dat shell. Open a remote dat and explore with cd, ls, etc.

Copyright 2017 Robin Millette <robin@millette.info> (<http://robin.millette.info>)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the
[GNU Affero General Public License](LICENSE.md)
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

// self
const DatRepl = require('.')
const pkg = require('./package.json')

// npm
const updateNotifier = require('update-notifier')

const rr = new DatRepl({ pkg, datKey: process.argv[2] })
rr.start()
updateNotifier({ pkg }).notify()
