const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

const READ = (str) => str.trim().split(" ");

const readFile = (fs, fileName) => {
  const fileData = fs.readFile(fileName);
  const dataString = Buffer.from(fileData).toString("utf-8");
  console.log(dataString);
};

const createFile = (fs, fileName) => {
  fs.createFile(fileName);
  console.log(`File created: ${fileName}`);
};

const writeFile = (fs, fileName, content) => {
  const dataBytes = [...Buffer.from(content.join(" "), "utf-8")];
  fs.writeToFile(fileName, dataBytes);
  console.log(`Writing in file: ${fileName}`);
};

const deleteFile = (fs, fileName) => {
  fs.deleteFile(fileName);
  console.log(`1 File deleted: ${fileName}`);
};

const showStats = (fs) => {
  console.log(fs.stats());
};

const copyFile = (fs, source, dest) => {
  if (!dest) throw new Error("No destination file!!");
  fs.copyFile(source, dest);
  console.log(`Successfully copied ${source} to ${dest}`);
};

const list = (fs) => console.log(fs.list());

const EVAL = (fs, [command, fileName, ...content]) => {
  switch (command) {
    case "readFile":
      readFile(fs, fileName);
      break;
    case "createFile":
      createFile(fs, fileName);
      break;
    case "delete":
      deleteFile(fs, fileName);
      break;
    case "writeFile":
      writeFile(fs, fileName, content);
      break;
    case "stats":
      showStats(fs);
      break;
    case "copy":
      copyFile(fs, fileName, ...content);
      break;
    case "list":
      list(fs);
      break;
    default:
      throw new Error(`Invalid Command: ${command}`);
  }
};

const rep = (fs, str) => EVAL(fs, READ(str));

const repl = (fs) => {
  rl.question("fs> ", (answer) => {
    try {
      rep(fs, answer);
    } catch (e) {
      console.error(e.message);
    }
    repl(fs);
  });
};

module.exports = { repl };
