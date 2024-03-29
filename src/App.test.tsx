/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Mock Web3 library
jest.mock('web3', () => {
  return jest.fn().mockImplementation(() => {
    return {
      eth: {
        getBlockNumber: jest.fn().mockResolvedValue(12345),
      },
    };
  });
});

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('fetches last block number on mount', async () => {
    const { findByText } = render(<App />);
    await findByText('Last Block Number: 12345');
  });

  it('fetches USDT balance when address is provided', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<App />);
    const addressInput = getByPlaceholderText('Enter address');
    const getBalanceButton = getByText('Get USDT Balance');

    fireEvent.change(addressInput, { target: { value: '0xdAC17F958D2ee523a2206206994597C13D831ec7' } });
    fireEvent.click(getBalanceButton);

    await findByText('USDT Balance: 100');
  });

  it('does not fetch USDT balance when address is not provided', async () => {
    const { getByText, findByText } = render(<App />);
    const getBalanceButton = getByText('Get USDT Balance');

    fireEvent.click(getBalanceButton);

    await findByText('USDT Balance:');
  });
});
