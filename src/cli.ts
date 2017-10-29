import { TemplateEngine } from "./template-engine";
import * as yaml from "yamljs";
import * as fileHelper from "./helpers/file.helper";

async function processInput(args: string[]) {
  let template: string;
  let templateFile: string;
  let data: string;
  let dataFile: string;
  let outputFile: string;
  let output: string = "yaml";

  // Parse arguments
  args.forEach(arg => {
    let splitIndex = arg.indexOf("=");
    if (splitIndex === -1) {
      error("Invalid argument: " + arg);
    }
    let key = arg.substr(0, splitIndex);
    let value = arg.substr(splitIndex + 1);

    switch (key.toLowerCase()) {
      case "--template":
        template = value;
        break;
      case "--template-file":
        templateFile = value;
        break;
      case "--data":
        try {
          data = JSON.parse(value);
        } catch (e) {
          error("Invalid JSON from --data");
        }
        break;
      case "--data-file":
        dataFile = value;
        break;
      case "--output-file":
        outputFile = value;
        break;
      case "--output":
        output = value;
        break;
      default:
        error("Unknown option: " + key);
    }
  });

  let t = template || templateFile;
  let d = data || dataFile;

  if (t === undefined) {
    error("no template specified");
  }

  // Render
  let result: any;
  if (template) {
    result = await TemplateEngine.renderFromRaw(template, d);
  } else {
    result = await TemplateEngine.renderFromFile(templateFile, d);
  }

  // Format output
  let rawOutput: string;
  switch (output.toLowerCase()) {
    case "yaml":
    case "yml":
      rawOutput = yaml.stringify(result, 2);
      break;
    case "json":
      rawOutput = JSON.stringify(result, undefined, 2);
      break;
    default:
      error("Invalid --output")
  }

  if (outputFile) {
    let path = fileHelper.resolve(outputFile);
    await fileHelper.writeFile(outputFile, rawOutput);
  } else {
    console.info(rawOutput);
    process.exit(0);
  }
}

function help() {
  console.info("Simple Json Template cli\n" +
    "\n" +
    "This cli helps you to render Simple Json Templates from the commandline.\n" +
    "\n");
  console.info(usage());
  process.exit(0);
}

function error(msg: string): void {
  console.error(msg);
  console.error("");
  console.error(usage());
  process.exit(1);
}

function usage(): string {
  return "Usage: sjf [--template=inline-json] [--template-file=file] [--data=inline-json] [--data-file=file] [--output=yaml|json] [--output-file=file]";
}

processInput(process.argv.slice(2));