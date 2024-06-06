const { repl } = require("./repl");
const FileSystem = require("./src/FileSystem");

const main = () => {
  const fs = new FileSystem(80, 8);
  repl(fs);
};

main();
