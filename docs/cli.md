matchbox cli
============

## init

`matchbox init`

Start by running `matchbox init` in a new matchbox project.
It will prompt you to fill in some of the config file fields and generate it in the `cwd`.


## bootstrap

`matchbox bootstrap [packages..]`

It uses the `dirs` field from the config file to generate directory structures in the defined namespaces.

**Example**

The config file in the `cwd`:

```json
{
  "root": "client",
  "namespace": {
    "ui": "client/ui"
  },
  "dirs": {
    "ui": ["assets", "assets/images", "elements", "pages"]
  }
}
```

The initial project structure:

```
project
  └───client
    └───ui
```

```cli
matchbox bootstrap
```

It will produce the following:

```
project
  └───client
    └───ui
      ├───assets
      │ └───images
      ├───elements
      └───pages
```


## gen

`matchbox gen <generator> <target>`

It uses the `generators` field from the config file and the `generators` namespace from the file system to populate a target directory with files.

**Example**

The config file in the `cwd`:

```json
{
  "root": "client",
  "namespace": {
    "generators": "client/generators",
    "ui": "client/ui"
  },
  "generators": {
    "view": {
      "namespace": "ui",
      "dir": "elements",
      "dirs": ["themes"],
      "naming": "keep",
      "template": false
    }
  }
}
```

The initial project structure:

```
project
  └───client
    ├───generators
    │ └───view
    │   ├───themes
    │   ├───view.dust
    │   ├───view.styl
    │   └───view.js
    └───ui
```

```cli
matchbox gen view menu/context-menu
```

The cli will prompt you which files you need, and the selected ones, according to the naming scheme defined in the generator config, will be created in the target directory.

```
project
  └───client
    ├───generators
    │ └───view
    │   ├───view.dust
    │   ├───view.styl
    │   └───view.js
    └───ui
      └───menu
        └───context-menu
          ├───view.dust
          ├───view.styl
          └───view.js
```


## add-gen

`matchbox add-gen <name>`

The `add-gen` command will help you create generators.
It will prompt you to fill up the fields necessary for a generator config.

The provided name will be used as the directory name as well as the key in the config file.
