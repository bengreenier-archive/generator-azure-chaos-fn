'use strict';

const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const closestAzure = require('closest-azure');
const extend = require('deep-extend');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the stellar ' + chalk.red('generator-azure-chaos-fn') + ' generator!'
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'Enter your function name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'appLocation',
        message: 'Enter an Azure region',
        default: 'use closest',
        store: true
      }
    ];

    return this.prompt(prompts)
      .then(props => {
        if (props.appLocation === 'use closest') {
          return closestAzure().then(regionStr => {
            props.appLocation = regionStr;

            return props;
          });
        }
        return Promise.resolve(props);
      })
      .then(props => {
        this.props = extend(
          {
            fnStartName: 'start',
            fnStopName: 'stop'
          },
          props
        );
      });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.appName) {
      this.log(
        'Your fn must be inside a folder named ' +
          this.props.appName +
          '\n' +
          `I'll automatically create this folder.`
      );
      mkdirp(this.props.appName);
      this.destinationRoot(this.destinationPath(this.props.appName));
    }
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    extend(pkg, {
      main: 'handler.js',
      devDependencies: {
        'serverless-azure-functions': '*'
      }
    });

    pkg.keywords = pkg.keywords || [];
    pkg.keywords.push('yeoman-generator');

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copyTpl(
      this.templatePath('serverless.yaml'),
      this.destinationPath('serverless.yaml'),
      this.props
    );

    this.fs.copy(this.templatePath('chaos.js'), this.destinationPath('chaos.js'));
    this.fs.copy(this.templatePath('handler.js'), this.destinationPath('handler.js'));
    this.fs.copy(
      this.templatePath('function.json'),
      this.destinationPath('function.json')
    );
  }

  install() {
    this.npmInstall(['azure-chaos-fn'], { save: true });
  }
};
