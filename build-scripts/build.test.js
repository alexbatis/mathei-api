const s = require('shelljs');
const resolveRefs = require("json-refs").resolveRefs;
const YAML = require("js-yaml");
const fs = require("fs");
const program = require("commander");
const path = require("path");

let apiYamlContents = "";

function buildApiYaml() {
    return new Promise((resolve, reject) => {
        program
            .version("2.0.0")
            .option("-o --output-format [output]",
                "output format. Choices are \"json\" and \"yaml\" (Default is json)",
                "json")
            .usage("[options] <yaml file ...>");

        program.outputFormat = "yaml";

        if (program.outputFormat !== "json" && program.outputFormat !== "yaml") {
            reject(program.help());
            process.exit(1);
        }

        const file = path.join(__dirname, "..", "src", "common", "swagger", "index.yaml");

        if (!fs.existsSync(file)) {
            reject("File does not exist. (" + file + ")");
            process.exit(1);
        }

        const root = YAML.safeLoad(fs.readFileSync(file).toString());
        const options = {
            filter: ["relative", "remote"],
            loaderOptions: {
                processContent: function (res, callback) {
                    callback(null, YAML.safeLoad(res.text));
                }
            }
        };

        resolveRefs(root, options).then(function (results) {
            if (program.outputFormat === "yaml") {
                apiYamlContents = YAML.safeDump(results.resolved);
                resolve(apiYamlContents);
            } else if (program.outputFormat === "json") {
                resolve();
            }
        });

    });
}

function buildApp() {
    s.rm('-rf', 'build');
    s.mkdir('build');
    s.cp('environments/test.env', 'build/.env');
    s.cp('environments/test.env', '.env');
    s.cp('-R', 'public', 'build/public');
    fs.writeFileSync('src/common/swagger/Api.yaml', apiYamlContents);
    s.mkdir('-p', 'build/src/common/swagger');
    fs.writeFileSync('build/src/common/swagger/Api.yaml', apiYamlContents);
    s.cp('-R', 'package.json', 'build/package.json');
    console.log('Build Complete');
}

buildApiYaml().then(
    (value => {
        console.log('API yaml successfully built');
        buildApp();
    }),
    (error => {
        console.error('ERROR: Could not build API yaml', error);
        buildApp();
    }),
);