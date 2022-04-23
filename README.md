# SWR Firestore

# Fork
This fork fixes a number of issues in the original repository, which is no longer maintained. See more here: https://github.com/nandorojo/swr-firestore/issues/117#issuecomment-997801890

# Introduction

This is a collection of hooks to simplify the use of firestore with SWR. All hooks are tested against a real firebase project.

## Example

_Important: Make sure to memoize options if passed in to either useDocument or useCollection._

```
import { initializeApp } from 'firebase/app';
initializeApp(options); // setup firestore
// ...

import { useDocument, useCollection, UseDocumentOptions, UseCollectionOptions } from 'swr-firestore';
type Fruit = {name: string};

// below options declared outside to not require memoization
const documentListenOptions: UseDocumentOptions = {listen: true};
const collectionListenOptions: UseCollectionOptions = {listen: true};
const collectionQueryOptions: UseCollectionOptions = {constraints: where('color', '==', 'yellow')};

function TestComponent() {
  const { data: banana } = useDocument<Fruit>('fruits/banana');
  const { data: banana } = useDocument<Fruit>('fruits/banana', documentListenOptions); // subscribe to changes
  const { data: fruits } = useCollection<Fruit>('fruits');
  const { data: fruits } = useCollection<Fruit>('fruits', collectionListenOptions); // subscribe to changes
  const { data: yellowFruits } = useCollection<Fruit>('fruits', collectionQueryOptions);
}
```

## Features

- Typescript Enabled
- Firebase 9.X
- SWR 1.X
- Minimal - no side effects, all hooks are optional and expose as much of firestore's functionality as possible. It's up to you how to configure firebase and SWR.
- Tested against real data - tests run against a real firestore project
- Retrieving a collection will automatically update SWR cache for individual documents
- Listening/Subscribing to changes

## Supported Hooks

- useCollection
- useDocument

## Testing

- Jest has been fixed at version 25.x due to https://github.com/facebook/jest/issues/7780#issuecomment-669828353 (Issue seems to be fixed now, TODO: update)
- Firebase has been fixed at version 9.1.3 due to https://github.com/firebase/firebase-js-sdk/issues/5687 (Issue seems to be fixed now, TODO: update)

In order to run the tests you need a firebase project. The test data will be created at the start of the test run.

### Run Tests

yarn test

## License

MIT
