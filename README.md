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

## Usage
```sh
$ dat-shell <dat-key> # dat-key is optionnal
```

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
* Colors
* Improve cd handling (limit to actual directories)
* Improve ls handling (arguments, long version, etc.)
* Improve args quoting (*à la* bash)
* Make all commands async (promises)
* Improve user responses
* Make prompt configurable (*à la* bash)
* Add cp command
* Add cat command
* Add more command
* Add tail command
* Add tree command
* Unit tests, travis, coveralls
* Gemnasium batch
* Enable usage as: dat-shell KEY ls (non-interactive)
* Support plugins
* Improve help, add command descriptions
* Add custom command completion
* Add debugging options and output
* Improve error messages
* Evaluate [shelljs][] for integration
* Evaluate [cash][] for integration
* Evaluate [vorpal][] for integration

## License
AGPL-v3 © 2017 [Robin Millette][]

[Robin Millette]: <http://robin.millette.info>
[update-notifier]: <https://github.com/yeoman/update-notifier>
[dat]: <https://datproject.org/>
[shelljs]: <https://github.com/shelljs/shelljs>
[cash]: <https://github.com/dthree/cash>
[vorpal]: <https://github.com/dthree/vorpal>