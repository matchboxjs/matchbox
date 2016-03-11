matchbox
========

[![npm](https://img.shields.io/npm/v/matchbox.svg)](https://www.npmjs.com/package/matchbox)
[![stability](https://img.shields.io/badge/stability-experimental-orange.svg)](https://github.com/matchboxjs/matchbox/wiki/Stability)

Strike anywhere!

## Info

Matchbox is a framework for building apps with web techonlogies.
It's aim is to help manage fron-end code.
It provides a cli tool for bootstrapping, a standardized directory structure to organise source files, and a config file that ties all this together.

Other modules built on top of it can provide solutions for views, models and everything else.

### [Docs](docs)

  - [cli](docs/cli.md)
  - [namespaces](docs/namespaces.md)
  - [the-matchbox-config-file](docs/the-matchbox-config-file.md)
  - [third-party-modules](docs/third-party-modules.md)

### CLI

```
Usage: matchbox [options] [command]

  Commands:

    init                      initialize a config file
    bootstrap [packages...]   bootstrap dirs from the project or a package
    gen <generator> <target>  use a generator to populate a target directory
    add-gen <name>            create a generator

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

Read more about the cli in the [docs](docs/cli.md).

### namespaces

Running `matchbox init`, among other things, will generate you a directory structure.
You can select which namespaces your project uses, so the ones that are not relevant won't cluter your project.

The `root` may be the same as the project root, 
but you can also use it to isolate front-end code from the rest of the code.

Read more about namespaces in the [docs](docs/namespaces.md).

```
project
  └───<root>
    ├───generators
    ├───tasks
    ├───ui
    ├───libs
    ├───utils
    └───polyfills
```

### config file

`.matchboxrc.json`

Running `matchbox init` will generate a config file in the `cwd`.
The `namespace`, `root`, and `name` fields will be populated with the values you provided during the init process.

Read more about the config file in the [docs](docs/the-matchbox-config-file.md).

```json
{
  "name": "",
  "root": "",
  "namespace": {},
  "generators": {},
  "dirs": {}
}
```

## Contribution

Feel free to send PRs to any of the matchbox repos here.
Many of the repos contain eslint configs; follow them to maintain a consistend style.

**Credits**

A big thanks for [sorribas](https://github.com/sorribas) for handing over the namespace for this project!
If you're looking for the transaction and invoice utiliy for emails, 
it is still available as the 1.0.2 release. Just `npm install matchbox@1.0.2` to get it.

From `2.0.0` this module contains the [matchbox](https://github.com/matchboxjs) project.

## Licence

MIT
