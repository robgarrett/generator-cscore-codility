/* eslint-disable no-unused-vars */
/* eslint-disable multiline-comment-style */
/* eslint-disable capitalized-comments */
import Generator from "yeoman-generator";
import yosay from "yosay";
import chalk from "chalk";
import * as shift from "change-case";
import shell from "shelljs";
import path from "path";

/*
 * My Yeoman generator.
 * Influenced from: https://github.com/alexfedoseev/generator-react-sandbox-server
 */
export default class MyGenerator extends Generator {
    constructor(...args) {
        super(...args);

        // Various output statements.
        this.say = {
            arr: "----> ",
            tab: "    ",
            info(msg) {
                console.log("\n\n" + chalk.yellow(this.arr + msg) + "\n");
            },
            status(item, status) {
                console.log(`${this.tab}${chalk.green(status)} ${item}`);
            },
            cmd(cmd) {
                console.log("\n" + chalk.green("$ " + cmd));
            },
            done(status, msg) {
                console.log(`\n\n${this.tab}${chalk.green(status)} $ ${msg}\n`);
            }
        };

        // Copy from template src to destination.
        this.copy = (src, dest, show) => {
            this.fs.copy(this.templatePath(src), this.destinationPath(dest));
            this.say.status(show || dest, "✓ ");
        };

        // Render a template file to a real file.
        this.render = (src, dest, params = {}) => {
            this.fs.copyTpl(
                this.templatePath(src),
                this.destinationPath(dest),
                params
            );
            this.say.status(dest, "✓ ");
        };

        // Execute a shell command.
        this.shellExec = cmd => {
            this.say.cmd(cmd);
            shell.exec(cmd);
            this.say.info("Completed");
        };

        // Operation complete.
        this.allDone = () => {
            this.say.done("All done!", `cd ${this.appName}/`);
        };
    }

    // Called when prompting the user.
    prompting() {
        this.log(yosay(`Welcome to ${chalk.white("cscore-codility generator")}`));
        // Get the default name of the app and skip prompts option.
        const defaultAppName = shift.paramCase(this.rootGeneratorName()) || null;
        const prompts = [
            {
                type: "number",
                name: "taskNum",
                message: "Enter Codility Lesson Number:",
                default: 1
            },
            {
                type: "input",
                name: "appName",
                message: "Enter appName:",
                default: defaultAppName
            }
        ];

        /*
         *  Ask Yeoman to prompt the user.
         *  Return a promise so the run loop waits until
         *  we've finished.
         */
        return this.prompt(prompts).then(props => {
            // Props are the return prompt values.
            this.taskNum = props.taskNum;
            this.appName = shift.paramCase(props.appName);
        });
    }

    writing() {
        const taskNumStr = String(this.taskNum).padStart(2, "0");
        this.sourceRoot(path.join(__dirname, "/templates/console-app"));
        shell.mkdir(this.appName);
        this.destinationRoot(this.appName);
        // this.render("_package.json", "package.json", { appName: this.appName });
        // this.copy(".babelrc", ".babelrc", false);
        // this.copy(".vscode/", ".vscode/", false);
    }

    install() {
        // Install NPM packages.
        // this.npmInstall();
    }

    end() {
        // this.allDone();
    }
}
