# Minimart-management-Vuetify-electron

## Prerequisites

- **Node.js 16** (LTS). This repo has a `.nvmrc`; with [nvm](https://github.com/nvm-sh/nvm): `nvm install` then `nvm use`.
- Prefer Node 16 over newer majors for this stack (Vue CLI 3, Electron 4, Firebase 7) unless you are upgrading dependencies.

## Developing on Apple Silicon (M1 / M2 / M3 / …)

### 1. One-time setup (after clone or clean `node_modules`)

```bash
nvm use
npm install --ignore-scripts
npm run finish-install
```

- **`--ignore-scripts`** avoids installing the Firebase 7 **`grpc` native addon** on **darwin-arm64**, which does not work reliably with this old toolchain.
- **`finish-install`** downloads **x64** Electron and Chromedriver (the versions in this project never shipped arm64 artifacts for those steps).

### 2. Rosetta

Electron is installed as an **Intel (x64)** app. If it does not launch, install Rosetta:

```bash
softwareupdate --install-rosetta
```

(macOS may also prompt you the first time you open an x64 app.)

### 3. Day-to-day development

From the project root:

```bash
nvm use
npm run electron:serve
```

That runs the Vue app inside Electron with hot reload.

**Vue DevTools:** automatic install from the Chrome Web Store is **disabled** in `src/background.js`. The old CRX download used by `vue-cli-plugin-electron-builder` often fails now (`Invalid header: Does not start with Cr24`) and could crash dev startup. Use the regular Electron **Developer Tools** (View menu or shortcuts); add Vue DevTools manually if you still need the extension.

To work in the **browser only** (no Electron shell):

```bash
npm run serve
```

### Packaging note

`postinstall` no longer runs `electron-builder install-app-deps` (it used to trigger long, failing `grpc` rebuilds on Apple Silicon). If you need native modules rebuilt for a packaged Electron build, run `npx electron-builder install-app-deps` when you are packaging—often on Intel or under Rosetta.

---

## Project setup on Intel Mac, Linux, or Windows

Try a normal install first:

```bash
nvm use
npm install
```

If **`grpc`** or other native modules fail, use the Apple Silicon flow: `npm install --ignore-scripts` then `npm run finish-install`.

## Production / Electron builds

```bash
npm run build
npm run electron:build
```

Windows-only packaging:

```bash
npm run electron:build:windows
```

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
