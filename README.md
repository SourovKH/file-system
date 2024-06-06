# File-System

This is IMFS (In Memory File System).

## Create a file
```
createFile <file name>
```

## Write to a file
It will write to a file. If the file doesn't exists, it will create a new file with the given content.

if no content is given, empty file will be created
```
writeFile <file name> <content>
```

## Read a file
It will show the content of a file.

If the file doesn't exist, it will throw an error.

```
readFile <file name>
```

## Delete a file
It will delete a file.

```
delete <file name>
```

## Stats
It will show the status of memory
  - Total space
  - Occupied space
  - Available space
  - Total no of files

```
stats
```

## Copy a file

It will copy to file and create a new file with same content.
```
copy <file to copy> <destination file name>
```

## List all the file
It will show all the file names stored in memory.

```
list
```