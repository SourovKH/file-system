class Inode {
  #dataBlocks;
  #size;
  #metaData;
  constructor(dataBlocks, size) {
    this.#dataBlocks = [...dataBlocks];
    this.#size = size;
    this.#metaData = { creationTime: new Date().toLocaleString() };
  }

  getDataBlocks() {
    return [...this.#dataBlocks];
  }

  setDataBlocks(dataBlocks, size) {
    this.#dataBlocks = [...dataBlocks];
    this.#size = size;
  }

  getSize() {
    return this.#size;
  }
}

module.exports = Inode;
