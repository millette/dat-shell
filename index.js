'use strict'

// npm
const Dat = require('dat-node')
const ram = require('random-access-memory')
const glob = require('glob')
const miss = require('mississippi')
const stdout = require('stdout')

// core
const repl = require('repl')
const resolvePath = require('path').resolve

const openDat = (key) => new Promise((resolve, reject) => {
  let tooBad
  const doG = (dat, stats, g) => {
    const st = stats.get()
    if (!st.files) { return stats.once('update', doG.bind(null, dat, stats)) }
    clearTimeout(tooBad)
    resolve(dat)
  }

  Dat(ram, { sparse: true, key }, (err, dat) => {
    if (err) { return reject(err) }
    dat.joinNetwork()
    const stats = dat.trackStats()
    stats.once('update', doG.bind(null, dat, stats))

    dat.network.once('listening', () => {
      tooBad = setTimeout(() => {
        dat.leaveNetwork() // preferable to dat.close() in this specific case
        reject(new Error('Timeout'))
      }, 1000)
    })
  })
})

const notFound = (cmd) => Object.assign(new Error(`Command not found.`), { cmd })

const writer = (str) => {
  if (typeof str === 'string') { return str + '\n' }
  if (typeof str === 'object' && str.length !== undefined) { return str.join('\n') + '\n' }
  if (typeof str === 'object') { return JSON.stringify(str, null, '  ') + '\n' }
  return str + '\n'
}

class MakeRepl {
  constructor (opts) {
    Object.assign(this, opts)
    if (opts.datKey) { this._datKeyProvided = opts.datKey }

    const asyncs = ['ls', 'cat']

    this._commands = {
      '.help': {},
      help: (args) => {
        const lines = ['Available commands:']
        let r
        let str
        for (r in this._commands) {
          str = r
          if (this._commands[r].help) {
            str += `: ${this._commands[r].help}`
          }
          lines.push(str)
        }
        return lines
      },
      cat: (args) => new Promise((resolve, reject) => {
        if (!this.datKey || !this._dat || !this._dat.archive) { return reject(new Error('Dat not ready.')) }
        if (!args || !args[0]) { return reject(new Error('cat requires a file argument')) }
        miss.pipe(this._dat.archive.createReadStream(resolvePath(this.cwd, args[0])), stdout(), (err) => {
          if (err) { return reject(err) }
          resolve()
        })
      }),
      ls: (args) => new Promise((resolve, reject) => {
        if (!this.datKey || !this._dat || !this._dat.archive) { return reject(new Error('Dat not ready.')) }
        const cwd = (args && args[0] && resolvePath(this.cwd, args[0])) || this.cwd
        glob('*', { mark: true, cwd, fs: this._dat.archive }, (err, files) => {
          if (err) { return reject(err) }
          resolve(files.filter(Boolean))
        })
      }),
      sl: (args) => 'Choo! Choo!',
      cd: (args) => {
        if (args && args[0] === '-') {
          if (!this._previousCwd) { return 'No previous working directory.' }
          [this._previousCwd, this.cwd] = [this.cwd, this._previousCwd] // swap
        } else {
          this._previousCwd = this.cwd
          this.cwd = args && args[0]
        }
        this._replServer.setPrompt(this._makePrompt())
      },
      pwd: (args) => this.cwd,
      dat: (args) => {
        if (args && args[0]) { this.datKey = (args[0] === '--close' || args[0] === '-c') ? false : args[0] }
        return this.datKey
      },
      state: (args) => {
        const lines = [...this._commands.version(), '', `cwd: ${this.cwd}`]
        if (this._previousCwd) { lines.push(`previousCwd: ${this._previousCwd}`) }
        if (this._datKeyProvided) { lines.push(`datKeyProvided: ${this._datKeyProvided}`) }
        if (this.datKey) { lines.push(`datKey: ${this.datKey}`) }
        return lines
      },
      version: (args) => [`${this.pkg.name} v${this.pkg.version}`, `${this.pkg.description}`],
      exit: (args) => process.exit((args && parseInt(args[0], 10)) || 0)
    }

    this._commands['.help'].help = 'Internal repl commands.'
    this._commands.help.help = 'List of commands and their descriptions.'
    this._commands.ls.help = 'List files.'
    this._commands.cat.help = 'View a file (concatenate).'
    this._commands.cd.help = 'Change directory.'
    this._commands.sl.help = 'Train yourself to avoid typos.'
    this._commands.pwd.help = 'Output current working directory.'
    this._commands.dat.help = 'dat -c to close; dat <KEY> to open; dat to output current key.'
    this._commands.state.help = 'Output current state.'
    this._commands.version.help = 'Current dat-shell version.'
    this._commands.exit.help = 'Exit dat-shell (or CTRL-D).'

    const startOptions = {
      prompt: this._makePrompt(),
      ignoreUndefined: true,
      writer,
      eval: (str, context, filename, callback) => {
        str = str.trim()
        const parts = str.split(' ') // FIXME do it as bash (quotes, etc.)
        const cmd = parts[0]
        if (!str) { return callback() }
        // FIXME make all this._commands async
        if (asyncs.indexOf(cmd) !== -1) {
          return this._commands[cmd](parts.slice(1))
            .then((X) => callback(null, X))
            .catch(callback)
        }
        if (this._commands[cmd]) { return callback(null, this._commands[cmd](parts.slice(1))) }
        callback(notFound(str))
      }
    }

    console.log(this._commands.state().join('\n'))
    console.log(this._commands.help().join('\n'))
    this._replServer = repl.start(startOptions)
  }

  _makePrompt () { return `dat-shell ${this.cwd} $ ` }

  get replServer () { return this._replServer }

  get cwd () { return this._cwd || '/' }
  set cwd (d) {
    if (!this._dat) { return }
    const lastCwd = this.cwd
    this._cwd = `${resolvePath(this.cwd, d || '/')}`
    if (this._cwd.slice(-1) !== '/') { this._cwd += '/' }
    this._commands.ls()
      .then(() => this._replServer.setPrompt(this._makePrompt()))
      .catch(() => { this.cwd = lastCwd })
  }

  get datKey () { return this._datKey }
  set datKey (key) {
    if (key) {
      if (this._datKey !== key) {
        if (this._datKey && this._dat && this._dat.close) { this._dat.close() }
        openDat(key)
          .then((dat) => {
            this._dat = dat
            this._datKey = dat.key.toString('hex')
            if (this._datKey !== key) { this._datKeyProvided = key }
            this.cwd = '/'
          })
      }
    } else if (this._datKey && this._dat && this._dat.close) {
      this._dat.close()
      this._datKey = undefined
      this._datKeyProvided = undefined
    }
  }
}

module.exports = MakeRepl
