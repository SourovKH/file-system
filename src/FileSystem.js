const Inode = require("./Inode");
const lo = require("lodash");

class FileSystem {
  #memory;
  #availableBlocks;
  #blockSize;
  #inodeTable;

  constructor(memorySize, blockSize) {
    this.#blockSize = blockSize;
    this.#memory = new Array(memorySize).fill(null);
    this.#availableBlocks = Array.from(
      { length: Math.floor(memorySize / blockSize) },
      (_, i) => i
    );
    this.#inodeTable = {};
  }

  list() {
    return Object.keys(this.#inodeTable);
  }

  stats() {
    const totalSpace = this.#memory.length;
    const availableSpace = this.#availableBlocks.length * this.#blockSize;
    return {
      noOfFiles: Object.keys(this.#inodeTable).length,
      availableSpace,
      totalSpace,
      occupiedSpace: totalSpace - availableSpace,
    };
  }

  #allocateDataBlocks(noOfBlocksToAllocate) {
    if (noOfBlocksToAllocate > this.#availableBlocks.length)
      throw new Error("Not Enough Space");

    return this.#availableBlocks.splice(0, noOfBlocksToAllocate);
  }

  createFile(name) {
    if (this.#inodeTable[name]) throw new Error("File Already Exists");
    const inodeCreated = new Inode([], 0);
    this.#inodeTable[name] = inodeCreated;

    return inodeCreated;
  }

  #writeContentToMemory(contentBlock, dataBlockIndex) {
    contentBlock.forEach((data, index) => {
      const memoryIndex = dataBlockIndex * this.#blockSize + index;
      this.#memory[memoryIndex] = data;
    });
  }

  #write(content, inode) {
    const allocatedBlocks = inode.getDataBlocks();
    return lo.chunk(content, this.#blockSize).map((contentBlock, index) => {
      const dataBlockIndex = allocatedBlocks[index];
      this.#writeContentToMemory(contentBlock, dataBlockIndex);
    });
  }

  writeToFile(name, content) {
    if (this.#inodeTable[name]) this.deleteFile(name);
    const inode = this.createFile(name);
    const dataBlocksRequired = Math.ceil(content.length / this.#blockSize);
    const dataBlocksAllocated = this.#allocateDataBlocks(dataBlocksRequired);
    inode.setDataBlocks(dataBlocksAllocated, content.length);

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
        if (data !== null) content.push(data);
      }

      return content;
    });

    return content;
  }

  deleteFile(name) {
    const inode = this.#inodeTable[name];
    if (!inode) throw new Error("File Doesn't Exist");
    const dataBlocks = inode.getDataBlocks();
    this.#availableBlocks = [...this.#availableBlocks, ...dataBlocks];

    delete this.#inodeTable[name];
  }

  copyFile(from, to) {
    const content = this.readFile(from);
    this.createFile(to);
    this.writeToFile(to, content)
  }
}

module.exports = FileSystem;
