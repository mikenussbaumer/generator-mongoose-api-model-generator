'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red('Mongoose API Model')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'modelName',
        message: 'Name of the API Model',
        default: 'user'
      },
      {
        type: 'input',
        name: 'modelNameUo',
        message: 'Name of the API Model for Object usage (User)',
        default: 'User'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    const modelName = this.props.modelName;

    // skip contents with _ just copy the other elements
    //this.fs.copyTpl(`${this.templatePath()}/**/!(_)*`, this.destinationPath(), this.props);

    this.fs.copyTpl(
      this.templatePath('_modelName.controller.js'),
      this.destinationPath(`api/${modelName}/${modelName}.controller.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('_modelName.events.js'),
      this.destinationPath(`api/${modelName}/${modelName}.events.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('_modelName.model.js'),
      this.destinationPath(`api/${modelName}/${modelName}.model.js`),
      this.props
    );
    
    this.fs.copyTpl(
      this.templatePath('_index.js'),
      this.destinationPath(`api/${modelName}/index.js`),
      this.props
    );
    
  }

  install() {
    this.installDependencies();
  }
};
