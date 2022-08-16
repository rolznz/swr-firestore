export function log(...data: unknown[]) {
  if (process.env.REACT_APP_SWR_FIRESTORE_DEBUG === 'true') {
    console.log('swr-firestore', ...data);
  }
}
