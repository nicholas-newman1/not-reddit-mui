import React from 'react';
import spinner from './spinner.gif';

interface Props {
  className?: string;
}

const Spinner: React.FC<Props> = ({ className = '' }) => {
  return (
    <div data-testid='loader' className={className}>
      <img src={spinner} alt='loading' />
    </div>
  );
};

export default Spinner;
