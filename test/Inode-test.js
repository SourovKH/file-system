const { describe, it } = require("node:test");
const assert = require("assert");
const Inode = require("../src/Inode");

describe("Inode", () => {
  it("should be able to give the data blocks allocated", () => {
    const inode = new Inode([1, 5], 10);
    assert.deepStrictEqual(inode.getDataBlocks(), [1, 5]);
  });

  it("should be able to give the size of the file", () => {
    const inode = new Inode([1, 5], 10);
    assert.deepStrictEqual(inode.getSize(), 10);
  });

  it("should be set new data blocks to the file", () => {
    const inode = new Inode([1, 5], 10);
    inode.setDataBlocks([2, 3], 11);
    assert.deepStrictEqual(inode.getDataBlocks(), [2, 3]);
    assert.deepStrictEqual(inode.getSize(), 11);
  });
});
