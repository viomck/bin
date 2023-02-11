#!/usr/bin/env zx

const HELP = `
cf-make-kv: makes a cloudflare workers KV for the current project

-n, --name,    arg 0: set the name of the KV (default: "KV")
-b, --binding, arg 1: set the binding of the KV returned in the example 
                      (default: name of KV)
-h, --help:           show this menu
-f, --force:          force to run, even if wrangler.toml isn't present
`;

function arg(name, idx, def) {
    if (argv[name.charAt[0]]) return argv[name.charAt(0)];
    else if (argv[name]) return argv[name];
    else if ((idx || idx === 0) && argv._.length > idx) return argv._[idx];
    else return def;
}

if (arg("help")) {
    echo(HELP);
    process.exit(0);
}

if (!fs.existsSync("wrangler.toml") && !arg("force")) {
    echo(chalk.red("No wrangler.toml present."));
    echo(chalk.red("If you know what you're doing, pass -f to force."));
    process.exit(1);
}

let kvName = arg("name", 0, "KV");   
let binding = arg("binding", 1, kvName);

async function createNamespace(args = "", idField = "id") {
    const out = await $`wrangler kv:namespace create ${kvName} ${args}`;
    return out.stdout.split(`${idField} = "`)[1].split('"')[0];
}

const id = await createNamespace();
const previewId = await createNamespace("--preview", "preview_id");

const config = `
kv_namespaces = [
  { binding = "${binding}", id = "${id}", preview_id = "${previewId}" }
]
`;

echo(chalk.green(config));
