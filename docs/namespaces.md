matchbox namespaces
===================

A matchbox project contains a number of pre-defined namespaces
that separates source files according to their roles.

Having a standardised directory structure has a number of advantages:

  - it helps maintaining a project by providing a consistent structure to write code
  - porting or migrating code is easier due to the familiar structure
  - plugins and third parties can use the same structure to namespace their tools
  - on-boarding a new dev on the project is easier in a well defined environment
  - separation of concerns is achieved by isolating files by role


## generators

The generators dir contains template files. These files are used when running a `matchbox gen` command.


## tasks

This directory is maintained to separate build scripts.


## ui

The ui folder is the place to put all the user interface related source files.
It's where the front-end code is kept.


## libs

Third party libraries.


## utils

Utilities that can be used throughout the project.


## polyfills

The place to put polyfills.
