const Directory = require("./Directory");
const Inode = require("./Inode");
const lo = require("lodash");

class FileSystem {
  #memory;
  #availableBlocks;
  #blockSize;
  #noOfFiles;
  #root;

  constructor(memorySize, blockSize) {
    this.#blockSize = blockSize;
    this.#memory = new Array(memorySize).fill(null);
    this.#availableBlocks = Array.from(
      { length: Math.floor(memorySize / blockSize) },
      (_, i) => i
    );
    this.#noOfFiles = 0;
    this.#root = new Directory();
  }

  #getPathParts(path) {
    return path.split("/").filter(Boolean);
  }

  #resolvePath(path) {
    const parts = this.#getPathParts(path);
    const fileName = parts.pop();
    const dirPath = parts.join("/");

    return { fileName, dirPath };
  }

  #getDirectory(path) {
    const parts = this.#getPathParts(path);
    let current = this.#root;
    for (const part of parts) {
      if (!current.getSubDirectory(part))
        throw new Error(`Directory "${part}" not found`);
      current = current.getSubDirectory(part);
    }

    return current;
  }

  createDirectory(path) {
    const parts = this.#getPathParts(path);
    let current = this.#root;
    for (const part of parts) {
      if (!current.getSubDirectory(part)) {
        const newDir = new Directory();
        current.addSubDirectory(part, newDir);
      }
      current = current.getSubDirectory(part);
    }
  }

  list(path = "/") {
    const dir = this.#getDirectory(path);

    return {
      files: Object.keys(dir.getFiles()),
      directories: Object.keys(dir.getSubDirectories()),
    };
  }

  stats() {
    const totalSpace = this.#memory.length;
    const availableSpace = this.#availableBlocks.length * this.#blockSize;
    return {
      noOfFiles: this.#noOfFiles,
      availableSpace,
      totalSpace,
      occupiedSpace: totalSpace - availableSpace,
    };
  }

  #allocateDataBlocks(noOfBlocksToAllocate) {
    if (noOfBlocksToAllocate > this.#availableBlocks.length)
      throw new Error("Out of memory!!");

    return this.#availableBlocks.splice(0, noOfBlocksToAllocate);
  }

  createFile(path) {
    const { fileName, dirPath } = this.#resolvePath(path);
    const dir = this.#getDirectory(dirPath);

    if (dir.getFile(fileName)) throw new Error("File Already Exists");
    const inodeCreated = new Inode([], 0);
    dir.addFile(fileName, inodeCreated);
    this.#noOfFiles++;

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

  writeToFile(path, content) {
    const { fileName, dirPath } = this.#resolvePath(path);
    const dir = this.#getDirectory(dirPath);

    if (dir.getFile(fileName)) this.deleteFile(path);
    const inode = this.createFile(path);
    const dataBlocksRequired = Math.ceil(content.length / this.#blockSize);
    const dataBlocksAllocated = this.#allocateDataBlocks(dataBlocksRequired);
    inode.setDataBlocks(dataBlocksAllocated, content.length);

    this.#write(content, inode);
  }

  readFile(path) {
    const { fileName, dirPath } = this.#resolvePath(path);
    const dir = this.#getDirectory(dirPath);

    const inode = dir.getFile(fileName);
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

  deleteFile(path) {
    const { fileName, dirPath } = this.#resolvePath(path);
    const dir = this.#getDirectory(dirPath);

    const inode = dir.getFile(fileName);
    if (!inode) throw new Error("File Doesn't Exist");
    const dataBlocks = inode.getDataBlocks();
    this.#availableBlocks = [...this.#availableBlocks, ...dataBlocks];

    delete dir.deleteFile(fileName);
    this.#noOfFiles--;
  }

  copyFile(from, to) {
    const content = this.readFile(from);
    this.createFile(to);
    this.writeToFile(to, content);
  }
}

module.exports = FileSystem;
