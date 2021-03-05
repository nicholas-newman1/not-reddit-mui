import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import ButtonLink from '.';
import { dark } from '../../theme';

describe('<ButtonLink />', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={dark}>
          <ButtonLink to='/' />
        </ThemeProvider>
      </MemoryRouter>
    );
  });

  it('should render children', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ThemeProvider theme={dark}>
          <ButtonLink to='/'>child</ButtonLink>
        </ThemeProvider>
      </MemoryRouter>
    );
    getByText(/child/i);
  });

  it('should go to correct route', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(
      <Router history={history}>
        <ThemeProvider theme={dark}>
          <ButtonLink to='/child'>child</ButtonLink>
        </ThemeProvider>
      </Router>
    );

    fireEvent.click(getByText(/child/i));
    expect(history.push).toHaveBeenCalledWith('/child');
  });

  it('should pass along props', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <ThemeProvider theme={dark}>
          <ButtonLink onClick={fn} to='/'>
            hello
          </ButtonLink>
        </ThemeProvider>
      </MemoryRouter>
    );
    const button = getByText(/hello/i);
    fireEvent.click(button);
    expect(fn).toBeCalledTimes(1);
  });
});
