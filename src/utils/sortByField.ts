/* eslint-disable @typescript-eslint/camelcase */
import sortBy from 'lodash/sortBy';
import { Transaction } from '../pages/Dashboard';

export interface Request {
  options: {
    field: 'title' | 'category' | 'created_at' | 'value';
    order: 'asc' | 'desc';
  };
  transactions: Transaction[];
}

export function sortByField({ options, transactions }: Request): Transaction[] {
  const { field, order } = options;
  const sortFuncs = {
    category(transaction: Transaction) {
      return transaction.category.title;
    },
    title(transaction: Transaction) {
      return transaction.title;
    },
    value(transaction: Transaction) {
      return transaction.type === 'outcome'
        ? -transaction.value
        : transaction.value;
    },
    created_at(transaction: Transaction) {
      return transaction.created_at;
    },
  };
  const sortedTransactions = sortBy(transactions, sortFuncs[field]);
  return order === 'desc' ? sortedTransactions.reverse() : sortedTransactions;
}
