# PluginFS

This API allows plugins to access **their own directory** and perform some basic file operations.

::: warning

**Top-level** plugin is not allowed since they don't own a directory.

This API currently does not support calls in **remote** script.

:::

::: tip

All paths passed into this API are relative to the root directory of your plugin.

:::

## PluginFS.read(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Read a file in text mode.

### Params

- `path` - The path of the file you want to access with respect to the plugin root directory.

### Return value

A `Promise` of the content string on success.

A `Promise` of `undefined` on failure.

### Example

```javascript
PluginFS.read("./index.js").then( content => {
    console.log(content)
})

const content = await PluginFs.read("./README.md")
```

## PluginFS.write(path,content,enableAppendMode?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Write to a file in text mode.

### Params

- `path` - The path of the file you want to access with respect to the plugin root directory.
- `content` - The content string you want to write into.
- `enableAppendMode` - Append to file if set to `true` or overwrite file if `false`. This is `false` by default.

### Return value

A `Promise` of a boolean result indicating success or failure.

### Example

```javascript
// Create test.txt and write "Hello" into it
PluginFS.write("./test.txt","Hello").then( result => {
    if(result){
        // success
    }else{
        // fail
    }
})

// Appending " World!" to it 
const result = await PluginFs.write("./test.txt"," World!",true)
```

::: tip

This API can create a file but can't create a file under a non-existing directory.

:::

## PluginFS.mkdir(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Create directories recursively.

### Params

`path` - The directory path you want to create with respect to the plugin root directory.

### Return Value

A `Promise` of a boolean result indicating success or failure.

### Example

```javascript
const bMkdir0 = await PluginFS.mkdir("utils")
const bMkdir1 = await PluginFS.mkdir("/a/b")
const bMkdir2 = await PluginFS.mkdir("/a\\c")
// false because it already exists
const bMkdir3 = await PluginFS.mkdir("a\\b/")
```

## PluginFS.stat(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Get the status of a file.

### Params

- `path` - The file path with respect to the plugin root directory.

### Return value

A `Promise` of `FileStat` or `undefined` depending on success or failure.

```typescript
interface FileStat{
  fileName: string
  // 0 if isDir is true
  length: number
  isDir: boolean
}
```

### Example

```javascript
const stat1 = await PluginFS.stat("a/b")
if(stat1){
    console.log("it's a directory")
}
const stat2 = await PluginFS.stat("a/random.js")
```

## PluginFS.ls(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

List files and directories under given path. 

### Params

- `path` - The directory path with respect to the plugin root directory.

### Return value

A `Promise` of `Array` of file name strings on success.

A `Promise` of `undefined` on failure.

## PluginFS.rm(path,recursively?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

::: danger

You should know what you are doing when using this.

:::

Remove file/directories.

Just like `rm` command in Unix-like systems.

### Params

- `path` - The file/directory path with respect to the plugin root directory.
- `recursively` - Delete all files/directories under the give path recursively. This is `false` by default.

### Return value

A `Promise` of a `number` showing how many files and directories is deleted.

When deleting with `recursively` set to `true`, the number value is sum of deleted `directories` and `files`.

### Example

You can only delete a non-empty directory with `recursively` set to `true`

```javascript
// 1
const bRm1 = await PluginFS.rm("./empty-dir")
// 1
const bRm2 = await PluginFS.rm("./random-file-under-plugin-root")

// bRm3 == 0 because it's not empty
const bRm3 = await PluginFS.rm("./non-empty-dir")
// bRm4 >= 1 with recursively set to true
const bRm4 = await PluginFS.rm("./non-empty-dir",true)
```
