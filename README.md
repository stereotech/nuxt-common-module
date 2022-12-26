# npm-common-module
The module combines components and plugins that are common to @Stereotech projects.

## Installation
 - Get a personal token on github. Settings -> Developer settings -> Personal access tokens. Check "read: packages"
 - In your project, create a file in the root: .npmrc:
    - @stereotech:registry=https://npm.pkg.github.com
 - In console run:
    - npm login --scope=@OWNER --registry=https://npm.pkg.github.com
    - Enter the github login, specify the token as the password
    - npm install @stereotech/nuxt-common-module@1.1.28

## Usage
 - Import before Component section
 - Component({ components: {component1Name, component2Name, ... }})

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History
TODO: Write history

## Credits
TODO: Write credits

## License
TODO: Write license
