import React, { useState, useEffect, useCallback } from 'react';
import { ReactComponent as IncomeIcon } from '../../assets/income.svg';
import { ReactComponent as OutcomeIcon } from '../../assets/outcome.svg';
import { ReactComponent as TotalIcon } from '../../assets/total.svg';
import ArrowButton from '../../components/ArrowButton';
import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

import { sortByField, Request } from '../../utils/sortByField';

export interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({
    income: '0',
    outcome: '0',
    total: '0',
  } as Balance);
  const [sortBy, setSortBy] = useState({ field: 'title', order: 'desc' });
  const [transactionType, setTransactionType] = useState('all');

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get('transactions');
      setTransactions(data.transactions);
      setBalance(data.balance);
    }

    loadTransactions();
  }, []);

  const updateTransactionOrder = useCallback(() => {
    const sortedTransactions = sortByField({
      options: sortBy as Request['options'],
      transactions,
    });
    setTransactions(sortedTransactions);
  }, [sortBy, transactions]);

  const handleSortByChange = (newField: string): void => {
    const { field, order } = sortBy;
    if (newField !== field) {
      setSortBy({ order: 'desc', field: newField });
    } else {
      const newOrder = order === 'desc' ? 'asc' : 'desc';
      setSortBy({ order: newOrder, field: newField });
    }
  };

  useEffect(() => {
    updateTransactionOrder();
  }, [sortBy]);

  const handleTransactionType = (transactionFilter: string): void =>
    setTransactionType(transactionFilter);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card name="income">
            <header>
              <p>Income</p>
              <button
                type="button"
                onClick={() => handleTransactionType('income')}
              >
                <IncomeIcon />
              </button>
            </header>
            <h1 data-testid="balance-income">
              {balance.income && formatValue(Number(balance.income))}
            </h1>
          </Card>
          <Card name="outcome">
            <header>
              <p>Outcome</p>
              <button
                type="button"
                onClick={() => handleTransactionType('outcome')}
              >
                <OutcomeIcon />
              </button>
            </header>
            <h1 data-testid="balance-outcome">
              {balance.outcome && formatValue(Number(balance.outcome))}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <button
                type="button"
                onClick={() => handleTransactionType('all')}
              >
                <TotalIcon />
              </button>
            </header>
            <h1 data-testid="balance-total">
              {balance.total && formatValue(Number(balance.total))}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  <p>Title</p>
                  <ArrowButton
                    onClick={() => handleSortByChange('title')}
                    isDown={sortBy.order !== 'asc'}
                  />
                </th>
                <th>
                  <p>Value</p>
                  <ArrowButton
                    onClick={() => handleSortByChange('value')}
                    isDown={sortBy.order !== 'asc'}
                  />
                </th>
                <th>
                  <p>Category</p>
                  <ArrowButton
                    onClick={() => handleSortByChange('category')}
                    isDown={sortBy.order !== 'asc'}
                  />
                </th>
                <th>
                  <p>Date</p>
                  <ArrowButton
                    onClick={() => handleSortByChange('created_at')}
                    isDown={sortBy.order !== 'asc'}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {transactionType === 'all'
                ? transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="title">{transaction.title}</td>
                      <td className={transaction.type}>
                        {transaction.type === 'outcome' ? ' - ' : ''}
                        {formatValue(Number(transaction.value))}
                      </td>
                      <td>{transaction.category.title}</td>
                      <td>{formatDate(transaction.created_at)}</td>
                    </tr>
                  ))
                : transactions
                    .filter(transaction => transactionType === transaction.type)
                    .map(transaction => (
                      <tr key={transaction.id}>
                        <td className="title">{transaction.title}</td>
                        <td className={transaction.type}>
                          {transaction.type === 'outcome' ? ' - ' : ''}
                          {formatValue(Number(transaction.value))}
                        </td>
                        <td>{transaction.category.title}</td>
                        <td>{formatDate(transaction.created_at)}</td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
