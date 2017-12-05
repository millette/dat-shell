# dat-shell
[![Build Status](https://travis-ci.org/millette/dat-shell.svg?branch=master)](https://travis-ci.org/millette/dat-shell)
[![Coverage Status](https://coveralls.io/repos/github/millette/dat-shell/badge.svg?branch=master)](https://coveralls.io/github/millette/dat-shell?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/dat-shell.svg)](https://gemnasium.com/github.com/millette/dat-shell)
> Dat shell. Open a remote dat and explore with cd, ls, etc.

## Install
```
$ npm install --global dat-shell
```

## Usage
```sh
$ dat-shell <dat-key> # dat-key is optionnal
```

## Upgrading
The cli now uses [update-notifier][] to let the user know about updates to this program.

Users have the ability to opt-out of the update notifier by changing
the optOut property to true in ~/.config/configstore/update-notifier-dat-shell-streak.json.
The path is available in notifier.config.path.

Users can also opt-out by setting the environment variable NO_UPDATE_NOTIFIER
with any value or by using the --no-update-notifier flag on a per run basis.

## TODO
* Colors
* Improve cd handling
* Improve ls handling (arguments, long version, etc.)
* Improve args quoting (à la bash)
* Make all commands async (promises)
* Improve user responses
* Make prompt configurable (à la bash)
* Add cp command
* Unit tests, travis, coveralls
* Gemnasium batch
* Enable usage as: dat-shell KEY ls (non-interactive)
* Support plugins
* Improve help, add command descriptions

## License
AGPL-v3 © 2017 [Robin Millette](http://robin.millette.info)

[update-notifier]: <https://github.com/yeoman/update-notifier>
