class Directory {
  #files;
  #subDirectories;

  constructor() {
    this.#files = {};
    this.#subDirectories = {};
  }

  getFiles() {
    return { ...this.#files };
  }

  getSubDirectories() {
    return { ...this.#subDirectories };
  }

  addFile(name, file) {
    this.#files[name] = file;
  }

  addSubDirectory(name, directory) {
    this.#subDirectories[name] = directory;
  }

  getFile(name) {
    return this.#files[name];
  }

  getSubDirectory(name) {
    return this.#subDirectories[name];
  }

  deleteFile(name) {
    delete this.#files[name];
  }

  deleteSubDirectory(name) {
    delete this.#subDirectories[name];
  }
}

module.exports = Directory;