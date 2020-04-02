/* ------------------------------- ENVIRONMENT ------------------------------ */
const ENVIRONMENT = process.env.NODE_ENV || 'dev';
const FORMATTED_ENVIRONMENT = ENVIRONMENT.toLowerCase().replace('aws_', '')
console.log(`Performing build for ${ENVIRONMENT} (${FORMATTED_ENVIRONMENT}) environment`);
const AWS_TARGET = ENVIRONMENT.toLowerCase().includes('aws');
/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
const shell = require('shelljs'),
    resolveRefs = require("json-refs").resolveRefs,
    YAML = require("js-yaml"),
    fs = require("fs"),
    program = require("commander"),
    path = require("path"),
    AWS = require('aws-sdk'),
    region = process.env.AWS_REGION || "us-east-2",
    environmentSecretName = `${FORMATTED_ENVIRONMENT}/mathei-api/.env`;
let
    secret,
    decodedBinarySecret,
    apiYamlContents = "",
    environmentConfig = "";

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

const getSecrets = async () => {
    return new Promise((resolve, reject) => {
        // Create a Secrets Manager client
        var client = new AWS.SecretsManager({
            region: region
        });

        client.getSecretValue({ SecretId: environmentSecretName }, function (err, data) {
            if (err) return reject(err)

            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
                environmentConfig = secret
                resolve(secret)
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
                environmentConfig = decodedBinarySecret
                resolve(decodedBinarySecret)
            }
        });
    })
}

function writeFiles() {
    const swaggerYamlDest = 'src/common/swagger/Api.yaml'
    const envDest = '.env'

    // Create Swagger Docs
    fs.writeFileSync(swaggerYamlDest, apiYamlContents);

    // Create .env file
    if (AWS_TARGET)
        fs.writeFileSync(envDest, environmentConfig);

    console.log(`Wrote files ${swaggerYamlDest} ${AWS_TARGET ? ',' + envDest : ''}`)
}

const complete = () => {
    console.log('Build Complete');
}

buildApiYaml()
    .then(_ => console.log('API yaml successfully built'))
    .catch(err => console.error('Failed to build API yaml', err))
    .finally(_ => {
        if (AWS_TARGET) {
            getSecrets()
                .then(_ => console.log(`Secrets retrieved for environment ${ENVIRONMENT}`))
                .catch(err => {
                    console.error(`Failed to retrieve secrets for environment ${ENVIRONMENT}`, err)
                    process.exit(1)
                })
                .finally(_ => writeFiles())
        }
        else writeFiles()
    });

