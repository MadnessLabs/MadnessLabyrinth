const fs = require('fs-extra');

fs.copySync(`enjin.${process.argv[2]}.ts`, `src/global/environment.ts`);