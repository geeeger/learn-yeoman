'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const ejs = require('ejs')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)

    this.option("typescript");

    this.option("prettier");

    this.option("pika");

    this.option("registry", {
      type: String,
      default: 'https://registry.npmjs.org/',
    });

    this.option("react");

    this.option("coverage");
  }

  initializing() {
    this.composeWith(require.resolve('../editorconfig'), this.options);
    this.composeWith(require.resolve('../eslint'), this.options);
    this.composeWith(require.resolve('../gitignore'), this.options);
    this.composeWith(require.resolve('../jest'), this.options);
    this.composeWith(require.resolve('../npmrc'), this.options);
    if (this.options.prettier) {
      this.composeWith(require.resolve('../prettier'), this.options);
    }
    this.composeWith(require.resolve('../readme'), this.options);
    if (this.options.typescript) {
      this.composeWith(require.resolve('../ts'), this.options);
    }
    if (this.options.pika) {
      this.composeWith(require.resolve('../pika'), this.options);
    }
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the impeccable ${chalk.red('generator-config')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名',
        default: 'my-project'
      },
      {
        type: 'input',
        name: 'desc',
        message: '请输入项目描述',
        default: ''
      },
      {
        type: 'input',
        name: 'homepage',
        message: '对应git仓库地址',
        default: '',
      },
      {
        type: 'input',
        name: 'author',
        message: '作者名',
        default: '',
      },
      {
        type: 'input',
        name: 'email',
        message: '邮箱地址',
        default: ''
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    let result = ejs.render(this.fs.read(this.templatePath('package.json.tmpl')), Object.assign({}, this.props, {
      registry: this.options.registry,
      typescript: this.options.typescript
    }))

    this.fs.copyTpl(
      this.templatePath('index.tmpl'),
      this.destinationPath(`src/index.${this.options.typescript ? 'ts' : 'js'}`),
      {
        typescript: this.options.typescript
      }
    );

    this.fs.extendJSON(this.destinationPath('package.json'), JSON.parse(result));
  }

  // install() {
  //   this.installDependencies();
  // }
};
