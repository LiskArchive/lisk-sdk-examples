export default (state, action) => {
  switch (action.type) {
    case 'accountUpdated':
      return {
        ...state,
        account: action.account,
      };
    case 'accountSignedOut':
      return {
        ...state,
        account: null,
      };
    default:
      return state;
  }
};
