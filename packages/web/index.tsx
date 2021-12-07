import React from 'react';
import { Hello } from '@ladify/ui';
import { add } from '@ladify/utils';
import ReactDOM from 'react-dom';

export const App = () => {
  return (
    <div>
      <Hello />
      <br />
      {add(1, 2)}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
