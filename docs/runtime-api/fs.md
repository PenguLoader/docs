# PluginFS  <br><Badge type="danger" text="experimental" />

This namespace helps you to gain access to  **plugin's own directory** and perform some basic file system operations.

::: tip

**Top-level** plugins don't have this namespace since they don't own a directory.

:::

::: warning

All paths passed into this API are **relative to the root** directory of your plugin.

:::

::: danger

APIs under this namespace will return a **Promise of undefined** if [illegal paths](https://github.com/PenguLoader/PenguLoader/blob/dev/plugins/src/preload/api/PluginFS.ts#L52) detected.

:::

## context.fs.read(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.1" />

Read a file in text mode.

### Params

- `path` - The path of the file you want to access with respect to the plugin root directory.

### Return value

A `Promise` of content `string` on success.

A `Promise` of `undefined` on failure.

### Example

```javascript
context.fs.read("./index.js").then( content => {
    console.log(content)
})

const content = await context.fs.read("./README.md")
```

## context.fs.write(path,content,enableAppendMode?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.1" />

Write a file in text mode.

### Params

- `path` - The path of the file you want to access with respect to the plugin root directory.
- `content` - The content `string` you want to write into the file.
- `enableAppendMode` - Append to file if set to `true` or overwrite file if `false`. This is `false` by default.

### Return value

A `Promise` of `boolean` indicating success or failure.

### Example

```javascript
// Create test.txt and write "Hello" into it
context.fs.write("./test.txt","Hello").then( result => {
    if(result){
        // success
    }else{
        // fail
    }
})

// Appending " World!" to it 
const result = await context.fs.write("./test.txt"," World!",true)
```

::: tip

This API can create a file but can't create a file under a non-existing directory.

:::

## context.fs.mkdir(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.1" />

Create directories recursively.

### Params

`path` - The directory path you want to create with respect to the plugin root directory.

### Return Value

A `Promise` of `boolean` indicating success or failure.

### Example

```javascript
const bMkdir0 = await context.fs.mkdir("utils")
const bMkdir1 = await context.fs.mkdir("/a/b")
const bMkdir2 = await context.fs.mkdir("/a\\c")
// false because it already exists
const bMkdir3 = await context.fs.mkdir("a\\b/")
```

## context.fs.stat(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.1" />

Get status of a file.

### Params

- `path` - The file path with respect to the plugin root directory.

### Return value

A `Promise` of `FileStat` on success.
A `Promise` of `undefined` on failure.


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
const stat1 = await context.fs.stat("a/b")
if(stat1){
    console.log("it's a directory")
}
const stat2 = await context.fs.stat("a/random.js")
```

## context.fs.ls(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.1" />

List files and directories under given path. 

### Params

- `path` - The directory path with respect to the plugin root directory.

### Return value

A `Promise` of `string[]` of file name strings on success.

A `Promise` of `undefined` on failure.

## context.fs.rm(path,recursively?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.1" />

::: danger

You should know what you are doing when using this.

:::

Remove file/directories.

Just like `rm` command in Unix-like systems.

### Params

- `path` - The file/directory path with respect to the plugin root directory.
- `recursively` - Delete all files/directories under the give path recursively. This is `false` by default.

### Return value

A `Promise` of `number` showing how many files and directories is deleted.

### Example

You can only delete a non-empty directory with `recursively` set to `true`

```javascript
// 1
const bRm1 = await context.fs.rm("./empty-dir")
// 1
const bRm2 = await context.fs.rm("./random-file-under-plugin-root")

// bRm3 == 0 because it's not empty
const bRm3 = await context.fs.rm("./non-empty-dir")
// bRm4 >= 1 with recursively set to true
const bRm4 = await context.fs.rm("./non-empty-dir",true)
```
