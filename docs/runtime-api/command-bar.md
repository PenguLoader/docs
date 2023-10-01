# CommandBar

Since v1.1.0, we bring to you a new Command Bar 
that can provide access to app-level commands
and can be used with any navigation pattern.

Let's press `Ctrl + K` to open the Command Bar.

![](https://i.ibb.co/DWmwtSK/image.png)

### Keyboard shortcuts:

- Use arrow `Down` and `Up` to nagivate the selection.
- Press `Enter` or just click on an action to execute it.
- Press `ESC` to close the Command Bar.

<br>

To add your custom actions, please use the APIs below.

## CommandBar.addAction

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function addAction(action: Action): void
```

Add a new action item to the Command Bar. It will automatically update even when showing.

#### Params

- `action`: An object that describes action information with these properties

```ts
interface Action {
  id?: string       // (optional) an unique idetifier for the action
  name: string      // action's name
  legend?: string   // (optional) action's note/legend or shortcut key
  tags?: string[]   // (optional) tags or keywords to search
  icon?: string     // (optional) <svg> HTML tag in string
  group?: string    // (optional) group name
  hidden?: boolean  // (optional) hide the action, except for search results
  perform?: (id?: string) => any  // called when the action is executed 
}
```

## CommandBar.show

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function show(): void
```

Show the Command Bar programmatically if it was hidden.

## CommandBar.update

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function update(): void
```

Manually trigger the Command Bar to update its items.
Only use this function if your added actions are not updating.