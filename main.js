const FileSystem = require("./src/FileSystem");

const main = () => {
  const fs = new FileSystem(80, 8);
  fs.createFile("demo.txt", [...Buffer.from("This is a line", "utf-8")]);
  console.log(Buffer.from(fs.readFile("demo.txt")).toString("utf-8"));
};

main();