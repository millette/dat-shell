'use strict'

/*
// npm
const Dat = require('dat-node')
const ram = require('random-access-memory')
const glob = require('glob')
*/

// core
const repl = require('repl')

const notFound = (str) => str ? `Command '${str}' not found.` : undefined

const writer = (str) => {
  if (typeof str === 'string') { return str }
  if (typeof str === 'object' && str.length) { return str.join('\n') }
  if (typeof str === 'object') { return JSON.stringify(object, null, '  ') }
  return str
}

class MakeRepl {
  constructor (opts) {
    Object.assign(this, opts)
    const makePrompt = () => `dat-shell ${this.cwd} $ `

    const commands = {
      '.help': () => {},
      help: (args) => `Available commands: ${Object.keys(commands).join(', ')}`,
      ls: (args) => `ls ${args.join(' - ')}`,
      sl: (args) => 'Choo! Choo!',
      cd: (args) => {
        if (args && args[0] === '-') {
          if (!this._previousCwd) { return 'No previous working directory.' }
          [this._previousCwd, this.cwd] = [this.cwd, this._previousCwd] // swap
        } else {
          this._previousCwd = this.cwd
          this.cwd = args && args[0]
        }
        this._replServer.setPrompt(makePrompt())
      },
      pwd: () => this.cwd,
      dat: (args) => {
        if (args && args[0]) { this.datKey = args[0] }
        return this.datKey
      },
      state: (args) => {
        const lines = [...commands.version(), '', `cwd: ${this.cwd}`]
        if (this._previousCwd) { lines.push(`previousCwd: ${this._previousCwd}`) }
        if (this.datKey) { lines.push(`datKey: ${this.datKey}`) }
        return lines
      },
      version: (args) => [`${this.pkg.name} v${this.pkg.version}`, `${this.pkg.description}`],
      exit: (args) => process.exit((args && parseInt(args[0], 10)) || 0)
    }

    this._options = {
      prompt: makePrompt(),
      ignoreUndefined: true,
      writer,
      eval: (str, context, filename, callback) => {
        str = str.slice(0, -1) // remove trailing \n
        const parts = str.split(' ') // FIXME do it as bash (quotes, etc.)
        const cmd = parts[0]
        if (commands[cmd]) { return callback(null, commands[cmd](parts.slice(1))) }
        callback(null, notFound(str))
      }
    }

    console.log(commands.state().join('\n'))
  }

  get cwd () { return this._cwd || '/' }

  set cwd (d) {
    this._cwd = d || '/'
    if (this._cwd[0] !== '/') { this._cwd = `/${this._cwd}` }
  }

  get datKey () { return this._datKey }
  set datKey (key) { this._datKey = key }

  start () {
    this._replServer = repl.start(this._options)
    return this._replServer
  }
}

module.exports = MakeRepl
