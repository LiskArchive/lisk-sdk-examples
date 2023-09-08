import { SearchSvg } from 'assets/icons';
import React from 'react';

const ExploreInput = () => {
  return (
    <div className="post-input explore">
      <SearchSvg />
      <input name="explore" maxLength={250} type="text" placeholder="Explore" />
    </div>
  );
};

export default ExploreInput;
