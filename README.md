# SWR Firestore

This is a collection of hooks to simplify the use of firestore with SWR. All hooks are tested against a real firebase project.

## Example

```
import { initializeApp } from 'firebase/app';
initializeApp(options); // setup firestore
// ...

import { useDocument, useCollection } from 'swr-firestore';
type Fruit = {name: string};
function TestComponent() {
  const { data: banana } = useDocument<Fruit>('fruits/banana');
  const { data: fruits } = useCollection<Fruit>('fruits');
  const { data: yellowFruits } = useCollection<Fruit>('fruits', {constraints: where('color', '==', 'yellow')});
}
```

## Features

- Typescript Enabled
- Firebase 9.X
- SWR 1.X
- Minimal - no side effects, all hooks are optional and expose as much of firestore's functionality as possible. It's up to you how to configure firebase and SWR.
- Tested against real data - tests run against a real firestore project
- Retrieving a collection will automatically update SWR cache for individual documents

## Supported Hooks

- useCollection
- useDocument

## Testing

- Jest has been fixed at version 25.x due to https://github.com/facebook/jest/issues/7780#issuecomment-669828353
- Firebase has been fixed at version 9.1.3 due to https://github.com/firebase/firebase-js-sdk/issues/5687

In order to run the tests you need a firebase project with some data setup (hopefully data setup will be automatic soon)

## License

MIT
