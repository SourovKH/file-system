const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

const READ = (str) => str.trim().split(" ");

const readFile = (fs, path) => {
  const fileData = fs.readFile(path);
  const dataString = Buffer.from(fileData).toString("utf-8");
  console.log(dataString);
};

const createFile = (fs, path) => {
  fs.createFile(path);
  console.log(`File created: ${path}`);
};

const writeFile = (fs, path, content) => {
  const dataBytes = [...Buffer.from(content.join(" "), "utf-8")];
  fs.writeToFile(path, dataBytes);
  console.log(`Writing in file: ${path}`);
};

const deleteFile = (fs, path) => {
  fs.deleteFile(path);
  console.log(`1 File deleted: ${path}`);
};

const showStats = (fs) => {
  const { noOfFiles, totalSpace, availableSpace, occupiedSpace } = fs.stats();
  console.log(
    `Files: ${noOfFiles}\nTotal: ${totalSpace}\nAvailable: ${availableSpace}\nOccupied: ${occupiedSpace}`
  );
};

const copyFile = (fs, source, dest) => {
  if (!dest) throw new Error("No destination file!!");
  fs.copyFile(source, dest);
  console.log(`Successfully copied ${source} to ${dest}`);
};

const mkdir = (fs, path) => {
  if (!path) throw new Error("No path provided");
  fs.createDirectory(path);
  console.log("Directory created successfully");
};

const list = (fs, path) => {
  const { files, directories } = fs.list(path);
  console.log(
    `Files: ${files.join(" ")}\nDirectories: ${directories.join(" ")}`
  );
};

const EVAL = (fs, [command, path, ...content]) => {
  switch (command) {
    case "readFile":
      readFile(fs, path);
      break;
    case "mkdir":
      mkdir(fs, path);
      break;
    case "createFile":
      createFile(fs, path);
      break;
    case "delete":
      deleteFile(fs, path);
      break;
    case "writeFile":
      writeFile(fs, path, content);
      break;
    case "stats":
      showStats(fs);
      break;
    case "copy":
      copyFile(fs, path, ...content);
      break;
    case "list":
      list(fs, path);
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
