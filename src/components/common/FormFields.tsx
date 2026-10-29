import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";

/**
 * Small react-hook-form wrappers so a form field is ONE line:
 *   <FormText control={control} name="customerName" label="Name" maxLength={100} />
 */
interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
  size?: "small" | "medium";
  helperText?: string;
}

export function FormText<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  size,
  helperText,
  multiline,
  rows,
  maxLength,
  type,
}: BaseProps<T> & {
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  type?: "text" | "email" | "date" | "password";
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          {...field}
          inputRef={ref}
          value={field.value ?? ""}
          label={label}
          type={type}
          fullWidth
          size={size}
          disabled={disabled}
          multiline={multiline}
          minRows={rows}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helperText}
          onFocus={(event) => event.target.select()}
          slotProps={{
            htmlInput: { maxLength },
            inputLabel: type === "date" ? { shrink: true } : undefined,
          }}
        />
      )}
    />
  );
}

export function FormNumber<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  size,
  helperText,
  min = 0,
  max,
  step = "any",
}: BaseProps<T> & { min?: number; max?: number; step?: number | "any" }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          {...field}
          inputRef={ref}
          value={field.value ?? ""}
          onChange={(event) =>
            field.onChange(event.target.value === "" ? "" : Number(event.target.value))
          }
          label={label}
          type="number"
          fullWidth
          size={size}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helperText}
          onFocus={(event) => event.target.select()}
          slotProps={{ htmlInput: { min, max, step } }}
        />
      )}
    />
  );
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  size,
  helperText,
  options,
}: BaseProps<T> & { options: SelectOption[] }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          {...field}
          inputRef={ref}
          value={field.value ?? ""}
          select
          label={label}
          fullWidth
          size={size}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helperText}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
}: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              checked={!!field.value}
              disabled={disabled}
              onChange={(event) => field.onChange(event.target.checked)}
            />
          }
        />
      )}
    />
  );
}
