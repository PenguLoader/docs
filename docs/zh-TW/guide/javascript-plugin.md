# JavaScript 外掛

開發外掛需要具備基本的 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 知識；如果你想製作主題，也會需要了解 [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)。如果你已經熟悉網頁程式設計，這會相當容易上手。

## 建立外掛

假設你的新外掛名稱是 `your-plugin`。

首先，你需要在 Pengu Loader 根目錄內的 **plugins** 資料夾中，建立一個名為 `your-plugin` 的新資料夾。

```
root/
  |__plugins/
    |__@default/        <- 預設外掛
      |...
    |__your-plugin/     <- 你的新外掛
      |__index.js       <- 外掛進入點
```

接著，在你的外掛資料夾中建立一個名為 `index.js` 的新檔案。這個 index 是外掛的進入點，會在 League Client 準備就緒後執行。現在你可以用任何編輯器打開它，開始撰寫程式。

::: tip

建議使用現代 JavaScript 編輯器來開發外掛，例如 [Visual Studio Code](https://code.visualstudio.com/)，因為它支援 IntelliSense、linter 與程式碼自動完成。

:::

接下來，只要把這一行加入 index 並儲存。

```js
console.log('Hello, League Client!')
```

::: info

所有程式碼與文字檔都應該以 UTF-8 編碼儲存，且不要使用 BOM。否則，你的外掛可能無法如預期運作。

:::

然後啟動 League Client。當 Client 準備就緒後，試著按下 `Ctrl Shift I` 開啟 **Chrome DevTools**。前往 DevTools 的 **Console** 分頁並捲動到最上方，你會看到輸出訊息。

```
Hello, League Client!
```

## 外掛進入點

<Badge type="tip" text="since v1.1.0" />

外掛的進入點是在外掛 index 中匯出的函式，loader 會自動呼叫它。`init` 進入點應該會在 League Client 初始化自己的 scripts 之前被呼叫。

```js
export function init(context) {
  // your code here
}
```

- 請參考 [`context.rcp`](/runtime-api/rcp) 了解如何從這個 `context` 使用 RiotClientPlugin hooks。
- 請參考 [`context.socket`](/runtime-api/socket) 了解如何使用內建的 socket 觀察功能。

自 v1.1.0 起，你不再需要把載入 script 放在 `window` 的 `load` 事件中。改成放在 `load` 進入點即可；即使 window 已經載入完成，它仍然會被呼叫。

```js
export function load() {
  // your code here
}
```

## 外掛範本

為了讓你更容易開始，我們已經提供了基礎外掛，請參考：
https://github.com/PenguLoader/PenguLoader/tree/v1.0.5/plugins

## 下一步

恭喜！你已經完成初學者教學。接著可以閱讀後續頁面，讓你的外掛擁有更多能力。

- [Module System](/guide/module-system) - 進一步了解模組系統
- [CSS Theme](/guide/css-theme) - 使用 CSS 建立你的主題
- [Asset Handling](/guide/asset-handling) - 將自訂內容加入外掛
- [LCU Request](/guide/lcu-request) - 協助你使用 LCU 的指南
- [Runtime API](/runtime-api/) - 可在外掛中使用的實用內建 API
