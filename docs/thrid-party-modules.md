Writing and using third party matchbox modules
==============================================

## Writing a third party module

Creating a matchbox plugin starts with the same step as starting a main project.

```cli
matchbox init
```

Generate a config file and the namespaces relevant to your module.

Write files and generators that will be used by a host project.

### Third party use cases

Third party libs can choose to provide a number of solutions, like:

  - generators
  - implementations
  - tasks
  - polyfill bundles
  - namespace extensions via the `dirs` field in the config file


## Using third party matchbox libs

```cli
npm install some-matchbox-package
```

After installing a module you can use the matchbox cli to use them.


### bootstrapping packages

If a module provides namespace extensions via their `dirs` field,
you can use them by executing the bootstrap command with the package name.

```cli
matchbox bootstrap some-matchbox-package
```

The cli will look for this package and its config file in the `node_modules` folder
and use it to generate the directory structures defined in it.


### third party generators

Packages can provide generators and you can use them just like your own generators.
The only difference is that you need to reference the package name and the generator from it when running the `gen` command.

```cli
matchbox gen some-matchbox-package/some-generator some-target
```

This will look for `some-matchbox-package` in your `node_modules` and access `some-generator` from its config file
and use it to generate files in `some-target`.

It works like the same as the main generators defined in you config file, just using a thrid party source.
