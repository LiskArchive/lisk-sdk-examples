// eslint-disable-next-line import/prefer-default-export
export const getTransactions = () => new Promise((resolve) => {
  // TODO this is mock data hack, to be removed when backend is ready
  setTimeout(() => {
    resolve([{
      id: '12349126192841249861',
      address: '21438701249701294l',
      date: new Date().toLocaleDateString('en-US'),
      details: 'Implementation of login page',
      amount: 50,
      paidStatus: false,
    }, {
      id: '21498124612498612',
      address: '21438701249701294l',
      date: new Date().toLocaleDateString('en-US'),
      details: 'Implementation of home page',
      amount: 140,
      paidStatus: true,
    }]);
  }, 1000);
});
