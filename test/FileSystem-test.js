const { describe, it } = require("node:test");
const assert = require("assert");
const FileSystem = require("../src/FileSystem");

describe("FileSystem", () => {
  it("Should be able to create a file with the given content", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo.txt", content);

    assert.deepStrictEqual(fs.readFile("demo.txt"), content);
  });

  it("Should throw error when a file is being created with already used name", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo.txt", content);

    assert.throws(() => fs.createFile("demo.txt", content), {
      message: "File Already Exists",
    });
  });

  it("Should throw error when there is not enough space to store the content", () => {
    const fs = new FileSystem(8, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];

    assert.throws(() => fs.createFile("demo.txt", content), {
      message: "Not Enough Space",
    });
  });

  it("Should throw error when trying to read a file not being created or present", () => {
    const fs = new FileSystem(80, 8);
    assert.throws(() => fs.readFile("demo.txt"), {
      message: "File Doesn't Exist",
    });
  });

  it("Should throw error when tring to delete file which doesnt exist", () => {
    const fs = new FileSystem(80, 8);
    assert.throws(() => fs.deleteFile("demo.txt"), {
      message: "File Doesn't Exist",
    });
  });

  it("Should be able to delete a file", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo.txt", content);
    fs.deleteFile("demo.txt");

    assert.throws(() => fs.readFile("demo.txt"), {
      message: "File Doesn't Exist",
    });
  });

  it("Should throw error when the file to copy doesnt exist", () => {
    const fs = new FileSystem(80, 8);

    assert.throws(() => fs.copyFile("demo1.txt", "demo2.txt"), {
      message: "File Doesn't Exist",
    });
  });

  it("Should throw error when there is not enough space to copy file", () => {
    const fs = new FileSystem(16, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo1.txt", content);

    assert.throws(() => fs.copyFile("demo1.txt", "demo2.txt"), {
      message: "Not Enough Space",
    });
  });

  it("Should throw error when the name of the copy is already used", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo1.txt", content);

    assert.throws(() => fs.copyFile("demo1.txt", "demo1.txt"), {
      message: "File Already Exists",
    });
  });

  it("Should make a new copy of the file with the same content", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo1.txt", content);
    fs.copyFile("demo1.txt", "demo2.txt");

    assert.deepStrictEqual(fs.readFile("demo2.txt"), content);
  });

  it("Should be able to provide stats about space consumption", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo1.txt", content);
    fs.copyFile("demo1.txt", "demo2.txt");

    assert.deepStrictEqual(fs.stats(), {
      availableSpace: 48,
      noOfFiles: 2,
      occupiedSpace: 32,
      totalSpace: 80,
    });
  });

  it("Should list the files present", () => {
    const fs = new FileSystem(80, 8);
    const content = [...Buffer.from("This is a line", "utf-8")];
    fs.createFile("demo1.txt", content);
    fs.copyFile("demo1.txt", "demo2.txt");

    assert.deepStrictEqual(fs.list(), ["demo1.txt", "demo2.txt"]);
  });
});
