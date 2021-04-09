import { FormControlProps, MenuItem } from '@material-ui/core';
import { fireEvent, render } from '@testing-library/react';
import { RegisterOptions, useForm } from 'react-hook-form';
import ReactHookFormSelect from '.';

interface Props extends FormControlProps {
  name: string;
  label: string;
  defaultValue?: string;
  rules?: RegisterOptions;
}

const Wrapper: React.FC<Props> = (props) => {
  const { control } = useForm();
  return <ReactHookFormSelect {...props} control={control} />;
};

describe('<ReactHookFormSelect />', () => {
  it('should render without exploding', () => {
    render(<Wrapper name='category' label='Category' />);
  });

  it('should render given label', () => {
    const { getByText } = render(<Wrapper name='category' label='Category' />);
    getByText(/category/i);
  });

  it('should render child menu items', () => {
    const { getByRole, getByText } = render(
      <Wrapper name='category' label='Category'>
        <MenuItem value='meditation'>Meditation</MenuItem>
        <MenuItem value='running'>running</MenuItem>
        <MenuItem value='reading'>reading</MenuItem>
      </Wrapper>
    );

    const button = getByRole('button');
    fireEvent.mouseDown(button);

    getByText(/meditation/i);
    getByText(/running/i);
    getByText(/reading/i);
  });

  it('should have no selection by default', () => {
    const { getByRole } = render(<Wrapper name='category' label='Category' />);
    const button = getByRole('button');
    expect(button.textContent).toMatch('');
  });

  it('should select correct option', () => {
    const { getByRole, getByText } = render(
      <Wrapper name='category' label='Category'>
        <MenuItem value='meditation'>Meditation</MenuItem>
        <MenuItem value='running'>running</MenuItem>
        <MenuItem value='reading'>reading</MenuItem>
      </Wrapper>
    );
    const button = getByRole('button');
    fireEvent.mouseDown(button);
    fireEvent.click(getByText(/running/i));
    expect(button.textContent).toMatch(/running/i);
  });

  it('should select given defaultValue', () => {
    const { getByText } = render(
      <Wrapper name='category' label='Category' defaultValue='running'>
        <MenuItem value='meditation'>Meditation</MenuItem>
        <MenuItem value='running'>running</MenuItem>
        <MenuItem value='reading'>reading</MenuItem>
      </Wrapper>
    );
    getByText(/running/i);
  });
});
