// components/common/CustomTextField.tsx
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  icon?: React.ReactNode;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  control,
  icon,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          error={!!error}
          helperText={error?.message}
          fullWidth
          InputProps={{
            ...props.InputProps,
            startAdornment: icon ? (
              <InputAdornment position="start">
                {icon}
              </InputAdornment>
            ) : null
          }}
        />
      )}
    />
  );
};
