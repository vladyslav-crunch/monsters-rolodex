import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// The holder must be `mock`-prefixed so it is hoisted next to the jest.mock call,
// and the stub must be a plain function: react-scripts sets resetMocks, which
// wipes a jest.fn() returned from a factory between tests.
const mockGetData = { current: () => new Promise(() => {}) };

jest.mock('./utils/data.utils', () => ({
  getData: (...args) => mockGetData.current(...args),
}));

const roster = [
  { id: '1', name: 'Leanne Graham', email: 'leanne@example.com' },
  { id: '2', name: 'Ervin Howell', email: 'ervin@example.com' },
];

const countLine = () => screen.getByRole('status');

test('tracks the load status and reports the roster size once it arrives', async () => {
  mockGetData.current = () => Promise.resolve(roster);

  render(<App />);

  expect(countLine()).toHaveTextContent('loading monsters…');

  await waitFor(() =>
    expect(countLine()).toHaveTextContent('2 monsters · showing all')
  );
  expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
});

test('filters case-insensitively and echoes the query exactly as typed', async () => {
  mockGetData.current = () => Promise.resolve(roster);

  render(<App />);

  await userEvent.type(await screen.findByLabelText('Search monsters'), 'HOW');

  await waitFor(() =>
    expect(countLine()).toHaveTextContent('1 of 2 match “HOW”')
  );
  expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
  expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
});

test('replaces the grid with a no-match panel whose action clears the search', async () => {
  mockGetData.current = () => Promise.resolve(roster);

  render(<App />);

  const search = await screen.findByLabelText('Search monsters');
  await userEvent.type(search, 'zzz');

  await waitFor(() =>
    expect(countLine()).toHaveTextContent('0 of 2 match “zzz”')
  );
  expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));

  await waitFor(() =>
    expect(countLine()).toHaveTextContent('2 monsters · showing all')
  );
  expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
  expect(search).toHaveValue('');
});

test('reports a failed fetch and reloads the roster when the retry action is used', async () => {
  mockGetData.current = () => Promise.reject(new Error('offline'));

  render(<App />);

  await waitFor(() =>
    expect(countLine()).toHaveTextContent("couldn't load the roster")
  );
  expect(
    screen.getByText("We couldn't reach the monster directory")
  ).toBeInTheDocument();
  expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();

  // A retry that is still in flight reports the loading status again.
  let resolveRetry;
  mockGetData.current = () =>
    new Promise((resolve) => {
      resolveRetry = resolve;
    });
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

  expect(countLine()).toHaveTextContent('loading monsters…');

  resolveRetry(roster);

  await waitFor(() =>
    expect(countLine()).toHaveTextContent('2 monsters · showing all')
  );
  expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
});
