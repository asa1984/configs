# @asa1984/configs

## Install

```
pnpm add -D @asa1984/configs
```

## Usage

### Oxlint

```ts
// oxlint.config.ts
import { asa1984 } from "@asa1984/configs/oxlint";

export default asa1984();
```

### Oxfmt

```ts
// oxfmt.config.ts
import { asa1984 } from "@asa1984/configs/oxfmt";

export default asa1984();
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "./src/tsconfig/base.json"
}
```
