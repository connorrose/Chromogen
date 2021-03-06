/* eslint-disable */
import { debounce } from '../utils/utils';
import { ledger } from '../utils/ledger';
import { recordingState } from '../utils/store';
/* eslint-enable */

const { transactions, initialRender, selectors, setTransactions } = ledger;

const DEBOUNCE_MS = 250;

// Set timeout for selector get calls
export const debouncedAddToTransactions = debounce(
  (key, value, params) =>
    params !== undefined
      ? transactions[transactions.length - 1].familyUpdates.push({ key, value, params })
      : transactions[transactions.length - 1].updates.push({ key, value }),
  DEBOUNCE_MS,
);

export const wrapGetter = (key: string, get: Function) => {
  let returnedPromise: boolean = false;

  return (utils: any) => {
    const value = get(utils);

    // Only capture selector data if currently recording
    if (utils.get(recordingState)) {
      if (transactions.length === 0) {
        // Promise-validation is expensive, so we only do it once, on initial load
        if (typeof value === 'object' && value !== null && value.constructor.name === 'Promise') {
          ledger.selectors = selectors.filter((current) => current !== key);
          returnedPromise = true;
        } else {
          initialRender.push({ key, value });
        }
      } else if (!returnedPromise) {
        // Debouncing allows TransactionObserver to push to array first
        // Length must be computed within debounce to correctly find last transaction
        debouncedAddToTransactions(key, value);
      }
    }

    return value;
  };
};

export const wrapSetter = (key: string, set: Function) => (utils: any, newValue: any) => {
  if (utils.get(recordingState) && setTransactions.length > 0) {
    // allow TransactionObserver to push to array first
    // Length must be computed after timeout to correctly find last transaction
    setTimeout(() => {
      setTransactions[setTransactions.length - 1].setter = { key, newValue };
    }, 0);
  }
  return set(utils, newValue);
};
