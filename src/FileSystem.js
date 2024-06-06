const Inode = require("./Inode");
const lo = require("lodash");

class FileSystem {
  #memory;
  #availableBlocks;
  #blockSize;
  #inodeTable;

  constructor(memorySize, blockSize) {
    this.#blockSize = blockSize;
    this.#memory = new Array(memorySize).fill("");
    this.#availableBlocks = Array.from(
      { length: Math.floor(memorySize / blockSize) },
      (_, i) => i
    );
    this.#inodeTable = {};
  }

  #allocateDataBlock(noOfBlocksToAllocate) {
    if (noOfBlocksToAllocate > this.#availableBlocks.length)
      throw new Error("Not Enough Space");

    return this.#availableBlocks.splice(0, noOfBlocksToAllocate);
  }

  createFile(name, content) {
    if (this.#inodeTable[name]) throw new Error("File Already Exists");
    const dataBlocksRequired = Math.ceil(content.length / this.#blockSize);
    const dataBlocksAllocated = this.#allocateDataBlock(dataBlocksRequired);
    const inodeCreated = new Inode(dataBlocksAllocated, content.length);
    this.#inodeTable[name] = inodeCreated;

    this.writeToFile(name, content);
  }

  #write(content, inode) {
    const allocatedBlocks = inode.getDataBlocks();
    return lo.chunk(content, this.#blockSize).map((contentBlock, index) => {
      const dataBlock = allocatedBlocks[index];
      contentBlock.forEach((data, index) => {
        const memoryIndex = dataBlock * this.#blockSize + index;
        this.#memory[memoryIndex] = data;
      });
    });
  }

  writeToFile(name, content) {
    const inode = this.#inodeTable[name];
    if (!inode) return this.createFile(name, contentInBuffer);
    this.#write(content, inode);
  }

  readFile(name) {
    const inode = this.#inodeTable[name];
    if (!inode) throw new Error("File Doesn't Exist");

    const dataBlocks = inode.getDataBlocks();
    const content = dataBlocks.flatMap((dataBlock) => {
      const content = [];
      const dataBlockStartMemoryIndex = dataBlock * this.#blockSize;
      for (let i = 0; i < this.#blockSize; i++) {
        const data = this.#memory[dataBlockStartMemoryIndex + i];
        if (data !== "") content.push(data);
      }

      return content;
    });

    return content;
  }
}

module.exports = FileSystem;
