class Directory {
  #files;
  #subDirectories;
  #isRootDir;

  constructor(isRootDir, parentDirectory) {
    this.#isRootDir = isRootDir;
    this.#files = {};
    this.#subDirectories = {
      ".": this,
      "..": parentDirectory || this,
    };
  }

  getFiles() {
    return { ...this.#files };
  }

  getSubDirectories() {
    const allSubdirectories = { ...this.#subDirectories };
    delete allSubdirectories["."];
    delete allSubdirectories[".."];

    return allSubdirectories;
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
