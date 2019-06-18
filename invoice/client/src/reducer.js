export default (state, action) => {
  switch (action.type) {
    case 'accountSignedIn':
      return {
        ...state,
        account: action.account,
      };
    default:
      return state;
  }
};
