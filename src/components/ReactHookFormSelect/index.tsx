import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

interface Props extends FormControlProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  defaultValue?: string;
  rules?: RegisterOptions;
}

const ReactHookFormSelect: React.FC<Props> = ({
  name,
  label,
  control,
  defaultValue = '',
  rules,
  children,
  ...props
}) => {
  const labelId = `${name}-label`;
  return (
    <FormControl {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        as={
          <Select labelId={labelId} label={label}>
            {children}
          </Select>
        }
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
      />
    </FormControl>
  );
};
export default ReactHookFormSelect;
