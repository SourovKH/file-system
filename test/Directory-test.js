const { describe, it } = require("node:test");
const assert = require("assert");
const Directory = require("../src/Directory");
const Inode = require("../src/Inode");

describe("Directory", () => {
  it("Should be able to add files in a directory", () => {
    const dir = new Directory();
    const inode = new Inode([], 0);
    dir.addFile("demo", inode);
    assert.deepStrictEqual(
      dir.getFile("demo").getDataBlocks(),
      inode.getDataBlocks()
    );
  });

  it("Should be able to get all files in a directory", () => {
    const dir = new Directory();
    const inode = new Inode([], 0);
    dir.addFile("demo", inode);

    assert.deepStrictEqual(
      dir.getFiles().demo.getDataBlocks(),
      inode.getDataBlocks()
    );
  });

  it("Should be able to delete a file", () => {
    const dir = new Directory();
    const inode = new Inode([], 0);
    dir.addFile("demo", inode);
    dir.deleteFile("demo");

    assert.deepStrictEqual(dir.getFiles(), {});
  });

  it("Should be able to add subdirectory in a directory", () => {
    const dir = new Directory();
    const demoDir = new Directory();
    dir.addSubDirectory("demo", demoDir);
    assert.deepStrictEqual(dir.getSubDirectory("demo").getFiles(), {});
  });

  it("Should be able to get all subdirectories in a directory", () => {
    const dir = new Directory();
    const demoDir = new Directory();
    dir.addSubDirectory("demo", demoDir);

    assert.deepStrictEqual(dir.getSubDirectories().demo.getFiles(), {});
  });

  it("Should be able to delete a file", () => {
    const dir = new Directory();
    const demoDir = new Directory();
    dir.addSubDirectory("demo", demoDir);
    dir.deleteSubDirectory("demo");

    assert.deepStrictEqual(dir.getSubDirectories(), {});
  });
});
