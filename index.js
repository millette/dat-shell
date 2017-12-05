'use strict'

// npm
const Dat = require('dat-node')
const ram = require('random-access-memory')
const glob = require('glob')

// core
const repl = require('repl')

const doit = (key) => new Promise((resolve, reject) => {
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

const notFound = (str) => str ? `Command '${str}' not found.` : undefined

const writer = (str) => {
  if (typeof str === 'string') { return str + '\n' }
  if (typeof str === 'object' && str.length) { return str.join('\n') + '\n' }
  if (typeof str === 'object') { return JSON.stringify(str, null, '  ') + '\n' }
  return str + '\n'
}

class MakeRepl {
  get datKey () { return this._datKey }

  set datKey (key) {
    if (key) {
      if (this._datKey !== key) {
        if (this._datKey && this._dat && this._dat.close) {
          // close this._datKey
          this._dat.close()
        }
        // open key
        doit(key)
          .then((dat) => {
            this._dat = dat
            this._datKey = dat.key.toString('hex')
            if (this._datKey !== key) { this._datKeyProvided = key }
          })
      }
    } else if (this._datKey && this._dat && this._dat.close) {
      // close this._datKey
      this._dat.close()
      this._datKey = undefined
      this._datKeyProvided = undefined
    }
  }

  constructor (opts) {
    Object.assign(this, opts)
    if (opts.datKey) { this._datKeyProvided = opts.datKey }
    const makePrompt = () => `dat-shell ${this.cwd} $ `

    const asyncs = ['ls']

    const commands = {
      '.help': () => {},
      help: (args) => `Available commands: ${Object.keys(commands).join(', ')}`,
      ls: (args) => new Promise((resolve, reject) => {
        if (!this.datKey || !this._dat || !this._dat.archive) { return reject(new Error('Dat not ready.')) }
        glob('*', { mark: true, cwd: this.cwd, fs: this._dat.archive }, (err, files) => {
          if (err) { return reject(err) }
          Promise.all(files.filter(Boolean))
            .then(resolve)
            .catch(reject)
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
        this._replServer.setPrompt(makePrompt())
      },
      pwd: () => this.cwd,
      dat: (args) => {
        if (args && args[0]) { this.datKey = (args[0] === '--close' || args[0] === '-c') ? false : args[0] }
        return this.datKey
      },
      state: (args) => {
        const lines = [...commands.version(), '', `cwd: ${this.cwd}`]
        if (this._previousCwd) { lines.push(`previousCwd: ${this._previousCwd}`) }
        if (this._datKeyProvided) { lines.push(`datKeyProvided: ${this._datKeyProvided}`) }
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
        // FIXME make all commands async
        if (asyncs.indexOf(cmd) !== -1) {
          return commands[cmd](parts.slice(1))
            .then((X) => callback(null, X))
            .catch(callback)
        }
        if (commands[cmd]) { return callback(null, commands[cmd](parts.slice(1))) }
        callback(null, notFound(str))
      }
    }

    console.log(commands.state().join('\n'))
    console.log(commands.help())
  }

  get cwd () { return this._cwd || '/' }

  set cwd (d) {
    this._cwd = d || '/'
    if (this._cwd[0] !== '/') { this._cwd = `/${this._cwd}` }
  }

  start () {
    this._replServer = repl.start(this._options)
    return this._replServer
  }
}

module.exports = MakeRepl
