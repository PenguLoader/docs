# Khả năng tương thích với NPM

## Sử dụng các project NodeJS

Chúng tôi thực sự khuyên bạn nên sử dụng các project NodeJS để xây dựng plugin của mình.

Với TypeScript hoặc các ngôn ngữ khác yêu cầu transpile, bạn cần có công cụ để xây dựng chúng, Webpack, Rollup hoặc Vite là lựa chọn tốt nhất.

Bạn cũng có thể sử dụng bất kỳ thư viện front-end nào để xây dựng UI tùy chỉnh, ví dụ: React, Preact,
Vue, Svelte, SolidJS, v.v. Với công cụ front-end, hot-reload/HMR của nó sẽ giúp
bạn làm việc nhanh hơn.

::: info

Lưu ý rằng không thể sử dụng các package npm được thiết kế để chỉ chạy trong NodeJS
để xây dựng plugin.

:::

::: tip

Với các công cụ hỗ trợ, sau khi gói lại assets của bạn có thể sẽ bị sai đường dẫn.
Vui lòng tham khảo [Xử lí asset](/vi/guide/asset-handling) để sửa chúng.

:::

## Các plugin tham khảo

### Webpack 📦

- [douugdev/league-a-better-client](https://github.com/douugdev/league-a-better-client) -
  Một tiện ích LCU với HMR + ⚛ Preact + SASS + TypeScript

### Vite ⚡

- [Pengu vite-theme](https://github.com/PenguLoader/PenguLoader/blob/main/plugins/vite-theme) -
  Một theme đơn giản với HMR + SASS + TypeScript
- [Pengu @default](https://github.com/PenguLoader/PenguLoader/blob/main/plugins/@default) -
  Plugin mặc định với HMR + SolidJS + SASS + TypeScript
