# dat-shell
[![Build Status](https://travis-ci.org/millette/dat-shell.svg?branch=master)](https://travis-ci.org/millette/dat-shell)
[![Coverage Status](https://coveralls.io/repos/github/millette/dat-shell/badge.svg?branch=master)](https://coveralls.io/github/millette/dat-shell?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/dat-shell.svg)](https://gemnasium.com/github.com/millette/dat-shell)
> Dat shell. Open a remote dat and explore with cd, ls, etc.

dat-shell is part of the [dat][] Peer-to-Peer universe. It's useful to explore remote dats by their key without having to download them. Think of it as bash for dats, letting you ```cd```, ```ls``` and ```cp``` at will.

## Install
```sh
$ npm install --global dat-shell
```

### Requirements
You'll need node 8.9.1 (LTS) or above. I suggest using [n-install] to install the ```n``` node version manager.

You'll probably need ```git``` too since we're using my (temporary) fork of glob to support hyperdrives (dat archives), and that fork is only available on github and not (yet) on npm.

## Usage
```sh
$ dat-shell <dat-key> # dat-key is optionnal
```

For example, you can access this readme and scripts at: <dat://ae8c136e04a66451c79325681d4593bc3ce30c8005dfa5fc6001e0898ec4573a>

```sh
$ dat-shell dat://ae8c136e04a66451c79325681d4593bc3ce30c8005dfa5fc6001e0898ec4573a
# or
$ dat-shell ae8c136e04a66451c79325681d4593bc3ce30c8005dfa5fc6001e0898ec4573a
# or
$ dat-shell dat://dat-shell-millette.hashbase.io/
```

You might wonder about <dat://dat-shell-millette.hashbase.io/> but it's perfectly valid since the hostname maps to the ```ae8c...573a``` key through https discovery.

## Upgrading
The cli now uses [update-notifier][] to let the user know about updates to this program.

Users have the ability to opt-out of the update notifier by changing
the optOut property to true in ~/.config/configstore/update-notifier-dat-shell.json.
The path is available in notifier.config.path.

Users can also opt-out by setting the environment variable NO_UPDATE_NOTIFIER
with any value or by using the --no-update-notifier flag on a per run basis.

To upgrade, simply
```sh
$ npm install --global dat-shell
```

## TODO
There's lots to do, classified here in bugs and features.

> pfrazee: once you've got a good MVP, make a gif and we can tweet it up!

### Bugs
* Improve error messages
* Prevent cd into a file (doh)

### Features
* Add more command
* Add tail command
* Add tree command
* Browse versions (history)
* Add custom command completion
* Improve ls handling (arguments, long version, etc.)
* Improve args quoting (*à la* bash)
* Improve help, add long command descriptions
* Colors
* Make all commands async (promises)
* Improve user responses
* Make prompt configurable (*à la* bash)
* Unit tests, travis, coveralls
* Gemnasium batch
* Enable usage as: dat-shell KEY ls (non-interactive)
* Support plugins
* Add debugging options and output
* Evaluate [shelljs][] for integration
* Evaluate [cash][] for integration
* Evaluate [vorpal][] for integration
* Add bookmark support (compatible with beaker, hopefully)
* Make sure it works cross-platform (posix, windows)

### Ideas from #dat on freenode (IRC)
* creationix: would be cool to have the ability to run scripts in dat-shell
* creationix: pluggable vms for running scripts, scripts could list dependencies via dat urls, maybe even load native vm code from dats
* scriptjs: Would be nice if the licence for dat-shell was aligned with the dat ecosystem MIT please

## License
AGPL-v3 © 2017 [Robin Millette][]

[Robin Millette]: <http://robin.millette.info>
[update-notifier]: <https://github.com/yeoman/update-notifier>
[dat]: <https://datproject.org/>
[shelljs]: <https://github.com/shelljs/shelljs>
[cash]: <https://github.com/dthree/cash>
[vorpal]: <https://github.com/dthree/vorpal>
[n-install]: <https://github.com/mklement0/n-install>
