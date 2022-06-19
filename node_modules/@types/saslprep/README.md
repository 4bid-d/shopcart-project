# Installation
> `npm install --save @types/saslprep`

# Summary
This package contains type definitions for saslprep (https://github.com/reklatsmasters/saslprep#readme).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/saslprep.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/saslprep/index.d.ts)
````ts
// Type definitions for saslprep 1.0
// Project: https://github.com/reklatsmasters/saslprep#readme
// Definitions by: BendingBender <https://github.com/BendingBender>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = saslPrep;

declare function saslPrep(input: string, options?: saslPrep.Options): string;

declare namespace saslPrep {
    interface Options {
        allowUnassigned?: boolean | undefined;
    }
}

````

### Additional Details
 * Last updated: Tue, 06 Jul 2021 16:34:15 GMT
 * Dependencies: none
 * Global values: none

# Credits
These definitions were written by [BendingBender](https://github.com/BendingBender).
