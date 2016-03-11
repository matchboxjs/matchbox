.matchboxrc.json
================

The matchbox config is used to communicate with the cli and to provide a bridge across packages.

## Fields

### name

The `matchbox init` command prompts you to define it, but by default its the name of the project dir in the `cwd`.


### root

The `matchbox init` command prompts you to define it, but by default its the project dir (`cwd`).

Defining the root dir can help isolate front-end related code from the rest of the project,
or when writing a third party package you can use it to separate the source files into a `src` or `lib` dir.
It is also used to prefix namespace mappings.


### namespace

The `matchbox init` command prompts you to select and define these.

You can choose which of them you need in your project, and map them to your liking.

The following namespaces are available:

  - generators
  - tasks
  - ui
  - libs
  - utils
  - polyfills

Read more about namespaces in the namespace docs!


### generators

The `matchbox gen` command uses this field to access config for the generator to run.

A generator config looks like this:

```json
{
  "name": "test",
  "root": "client",
  "namespace": {
    "ui": "client/ui"
  },
  "generators": {
    "view": {
      "namespace": "ui",
      "dir": "elements",
      "naming": "keep",
      "template": false
    }
  }
}
```

#### generator/namespace

**Required**

Defines which namespace to use for the target.

#### generator/dir

**optional**

Defines a target dir in the namespace.

#### generator/naming

**Optional**

**Values:** `keep`, `rename`, `append`

The selected files will be named according to this naming scheme.

##### `keep`

The files will maintain the names defined in the source.

```cli
matchbox gen some-generator some-target
```

Source file: `something.js`

Target file: `something.js`

##### `rename`

The files will be renamed to the basename of the target.

```cli
matchbox gen some-generator some-target
```

Source file: `something.js`

Target file: `some-target.js`

##### `append`

The source names will be appended to the target's basename.

```cli
matchbox gen some-generator some-target
```

Source file: `something.js`

Target file: `some-target.something.js`


#### generator/template

Generators can use a script to process files that will be copied.
The `matchbox add-gen` command, if required, will generate a script next to the generator dir.
If this value is true, tha script will be executed on every file.

Here's how this script looks like:

```js
/**
 *
 * @param {String} content        the contents of the target file
 * @param {Object} options        contains information about the currently processed file
 * @param {String} options.src    the base name of the current file (like `page.js`)
 * @param {String} options.dest   the base name of the target file (like `myPage.js`)
 * @param {String} options.name   the name of the target (like `myPage`)
 * @param {String} options.dir    the relative path of the target dir (like `ui/pages/home/`)
 * @param {String} options.file   the absolute path of the target file (like `/a-project/ui/pages/home/myPage.js`)
 * @param {String} options.target the target argument as provided on the cli (like `home/myPage`)
 * @param {Object} options.host   the complete contents of the rc file in the cwd
 *
 * @return {String}
 * */
module.exports = function(content, options) {
  return content
}
```


### dirs

The `matchbox bootstrap` command uses this field to generate directories in the defined namespaces.
This object can contain arrays with namespaces used as keys.

An example would look like this:

```json
{
  "name": "matchbox-ui",
  "root": "client",
  "namespace": {
    "ui": "ui"
  },
  "dirs": {
    "ui": [
      "assets",
      "assets/images"
      "elements",
      "pages"
    ]
  }
}

Running the `matchbox bootstrap` command will generate the directories listed under each namespace.
```
