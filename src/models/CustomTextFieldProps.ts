import { TextFieldProps } from '@mui/material';
import { IconType } from 'react-icons';

export type CustomTextFieldProps = TextFieldProps & {
  icon?: IconType;
};
