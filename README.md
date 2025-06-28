Here's a clean and professional `README.md` for your GitHub repo: [https://github.com/ovansa/sabi-fill](https://github.com/ovansa/sabi-fill), tailored for contributors, testers, and store reviewers.

---

````markdown
# 🔥 Sabi Fill

**Sabi Fill** is a lightweight browser extension that auto-fills web forms with fake test data. It’s built for developers and testers who need to quickly populate input fields without reaching for mock data generators or typing repetitive values.

![sabi-fill-banner](docs/sabi-fill-preview.png)

---

## ✨ Features

- Auto-fills form fields (text, email, password, tel, etc.)
- Simple and fast — click-and-fill
- Compatible with most web forms
- Supports Chrome, Firefox, Edge, and Opera

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ovansa/sabi-fill.git
cd sabi-fill
```
````

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

This will output the extension to the `dist/` folder.

---

## 🧪 Run in Development

### Chrome / Edge / Opera

1. Visit `chrome://extensions/` (or `edge://extensions/`)
2. Enable **Developer Mode**
3. Click **"Load Unpacked"**
4. Select the `dist/` folder

### Firefox

Install `web-ext` CLI if you haven't:

```bash
npm install --global web-ext
```

Then run:

```bash
web-ext run
```

> ⚠️ Make sure you’ve renamed `web-ext-config.js` to `web-ext-config.cjs` and used `moduleExports = {...}` syntax.

---

## 📁 Project Structure

```
sabi-fill/
├── src/                  # Source TypeScript files
│   ├── popup.ts
│   ├── content.ts
│   └── background.ts
├── dist/                 # Build output (after `vite build`)
├── popup.html            # Extension popup HTML
├── manifest.json         # Extension manifest (V3)
├── web-ext-config.cjs    # Firefox dev config
├── icon.png              # Extension icon
└── vite.config.ts        # Vite bundler config
```

---

## 🌍 Browser Compatibility

| Browser | Status       | Notes                          |
| ------- | ------------ | ------------------------------ |
| Chrome  | ✅ Supported | Load via `chrome://extensions` |
| Firefox | ✅ Supported | Use `web-ext run` for testing  |
| Edge    | ✅ Supported | Same as Chrome                 |
| Opera   | ✅ Supported | Same as Chrome                 |

---

## 📸 Screenshots

<p align="center">
  <img src="docs/sabi-fill-example.gif" width="400" alt="Sabi Fill in action" />
</p>

---

## 📦 Publishing Notes

### Chrome Web Store

- Visit [Chrome Developer Dashboard](https://chromewebstore.google.com/devconsole)
- Upload a zip of your `dist/` folder with `manifest.json` at the root

### Firefox Add-ons

- Visit [addons.mozilla.org/developers](https://addons.mozilla.org/en-US/developers/)
- Upload the same zip or use `web-ext sign` for automated submission

---

## 🙌 Credits

Made with 💻 by [Muhammed Ibrahim (ovansa)](https://github.com/ovansa)

---

## 📜 License

MIT

```

```
