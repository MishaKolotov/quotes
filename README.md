## Quotes App

Minimal Angular + Nx demo for random quotes with offline support.

### Requirements

- Node.js **20.19.0** or higher
- npm

### Install dependencies

```bash
npm install --force
```

> Note: Nx 22 currently expects `@angular-devkit/build-angular` < 21,  
> while this project uses Angular 21.  
> Using `--force` (or `--legacy-peer-deps`) is safe here and matches
> the versions the app was developed and tested with.

### Run the application (dev)

```bash
# starts dev server on http://localhost:4200
npm start
```

### Build the application

```bash
# development build
npm run build

# production build
npm run build:prod
```

### Run tests

```bash
# unit tests (Jest)
npm test
```

### Lint

```bash
npm run lint
```
