# PostBoardNew Frontend

This project was generated using [React Webpack Starter](https://github.com/Create-Node-App/create-react-webpack-app).

## Development

### Running the Project

Start development environment running

```sh
$ yarn start
# or with npm
$ npm run start
```

Start development environment with docker running

```sh
$ yarn docker:dev
# or with npm
$ npm run docker:dev
```

`docker:dev` generate a docker image named PostBoardNew and run it in a container. Run `docker:dev:start` for only start a container without build a new docker image

While developing, you will probably rely mostly on `yarn start`; however, there are additional scripts at your disposal:

| `yarn <script>`       | Description                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `start`               | Serves your app at `localhost:3000`                                                                                     |
| `build:dev`           | Builds the application to ./build (_the build output dir could be configured in `./config/common-paths.js`_)            |
| `build:dev:watch`     | Builds the application and watch for changes                                                                            |
| `build:dev:analyze`   | Builds the application with Bundle Analyzer and Visualizer Plugins instaled                                             |
| `build:dev:dashboard` | Builds the application with Dashboard                                                                                   |
| `serve:dev:dashboard` | Builds the application with Dashboard                                                                                   |
| `test`                | Runs unit tests with Jest. See [testing](#testing)                                                                      |
| `test:watch`          | Runs `test` in watch mode to re-run tests when changed                                                                  |
| `lint`                | [Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors                    |
| `lint:fix`            | Lints the project and [fixes all correctable errors](http://eslint.org/docs/user-guide/command-line-interface.html#fix) |

### Hot Reloading

Hot reloading is enabled by default when the application is running in development mode (`yarn start`). This feature is implemented with webpack's [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) capabilities, where code updates can be injected to the application while it's running, no full reload required. Here's how it works:

For **JavaScript** modules, a code change will trigger the application to re-render from the top of the tree. **Global state is preserved (i.e. redux), but any local component state is reset**. This differs from React Hot Loader, but we've found that performing a full re-render helps avoid subtle bugs caused by RHL patching.

## Production

Generate production files running

```sh
$ yarn build
# or with npm
$ npm run build
```

Generate and serve production files running

```sh
$ yarn serve
# or with npm
$ npm run serve
```

## Project Structure

```
.
├── config                   # Webpack and Jest configuration
├── public                   # Static public assets (not imported anywhere in source code)
│   └── index.html           # Main HTML page template for app
├── src                      # Application source code
│   ├── components           # Global Reusable Components
│   ├── pages                # Components associated with routes
│   ├── routes               # Main route definitions and async split points
│   │   └── AppRoutes.jsx    # Bootstrap main application routes
│   ├── theme                # Application-wide styles and theme
|   ├── ...
|   ├── index.jsx            # Application bootstrap and rendering with store
└── static                   # Static public assets imported anywhere in source code
```

## Testing

To add a unit test, create a `.test.js` file anywhere inside of `./test`. Jest and webpack will automatically find these files.

## More info

You can learn more about the operation of this starter kit in the official [github repository](https://github.com/Create-Node-App/create-react-webpack-app).
