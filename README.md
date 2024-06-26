# ngx-loom

![Loom Status](https://github.com/Sn00pyW00dst0ck/ng-loom/actions/workflows/loom.yml/badge.svg?event=push)
![Demo App Status](https://github.com/Sn00pyW00dst0ck/ng-loom/actions/workflows/demo.yml/badge.svg?event=push)

**ngx-loom** is an Angular 17 compatible library with the sole purpose of easily rendering directed graph structures. 

## Installation

To install, utilize the command `npm i ngx-loom`. 

## Features

**ngx-loom** currently provides the following features: 

1. Ability to render directed (or undirected) graph structures.
2. Ability to overwrite the default node and edge display styles utilizing ng-templates.
3. Ability to pan and zoom the displayed graph.
4. Ability to implement custom 'layouts', which allows replacing the default rendering engine.
5. Ability to bind to output events raised when a graph node or edge is clicked.
6. Ability to center and auto-zoom the graph utilizing exposed methods.

## Development Setup

To setup for development, run the following commands within a Linux terminal. 
```bash
git clone "https://github.com/Sn00pyW00dst0ck/ng-loom.git"
cd ng-loom
npm i
```

### Build & Run

There are five npm scripts available to build and run ngx-loom and its demo application. 

1. `build:demo:dev` - Builds the demo application with development configuration. 
2. `build:demo:prod` - Builds the demo applicaiton with production configuration.
3. `build:loom:dev` - Builds the ngx-loom project with development configuration.
4. `build:loom:prod` - Builds the ngx-loom project with production configuration.
5. `serve:demo` - Serves the demo application to localhost. 

> [!NOTE]
> In order to build the demo application, first the ngx-loom project must be built. Without completing this step, building the demo application may fail. 

### Test

There are four npm scripts available to test ngx-loom and its demo application. 

1. `test:demo` - Runs unit tests for the demo application. 
2. `test:demo:headless` - Runs unit tests for the demo application within headless mode. 
3. `test:loom` - Runs unit tests for the ngx-loom project.
4. `test:loom:headless` - Runs unit tests for the ngx-loom project within headless mode. 

### Documentation

Documentation for ngx-loom is created utilizing [Compodoc](https://compodoc.app/). There are two provided npm scripts to generate documentation, or you can view the docs at [this page](https://sn00pyw00dst0ck.github.io/ngx-loom/). 

1. `compodoc:build` - Builds the documentation to a directory `/documentation`.
2. `compodoc:serve` - Builds and serves the documentation to `localhost:5555`.

> [!NOTE]
> Documentation is not generated for the loom-demo project, only ngx-loom. Documentation is not 100% comprehensive, but will improve with time.

#
*This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6.*
