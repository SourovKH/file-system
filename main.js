const FileSystem = require("./src/FileSystem");

const main = () => {
  const fs = new FileSystem(80, 8);
  fs.createFile("demo.txt", [...Buffer.from("This is a line", "utf-8")]);
  fs.copyFile("demo.txt", "demo2.txt");
  console.log(fs.stats());
};

main();
