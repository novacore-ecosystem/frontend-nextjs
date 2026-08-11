import MuiCheckbox from "@mui/material/Checkbox";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import MuiSwitch from "@mui/material/Switch";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  sx?: NovaSx;
}

export function Checkbox({ checked, defaultChecked, onChange, label, disabled, name, id, className, sx }: CheckboxProps) {
  const control = (
    <MuiCheckbox
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      disabled={disabled}
      name={name}
      id={id}
    />
  );
  if (!label) return control;
  return <MuiFormControlLabel control={control} label={label} className={className} sx={sx as any} />;
}

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  sx?: NovaSx;
}

export function Switch({ checked, defaultChecked, onChange, label, disabled, name, id, className, sx }: SwitchProps) {
  const control = (
    <MuiSwitch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      disabled={disabled}
      name={name}
      id={id}
    />
  );
  if (!label) return control;
  return <MuiFormControlLabel control={control} label={label} className={className} sx={sx as any} />;
}

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  row?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function RadioGroup({ options, value, onChange, name, row, className, sx }: RadioGroupProps) {
  return (
    <MuiRadioGroup value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} name={name} row={row} className={className} sx={sx as any}>
      {options.map((option) => (
        <MuiFormControlLabel key={option.value} value={option.value} control={<MuiRadio />} label={option.label} disabled={option.disabled} />
      ))}
    </MuiRadioGroup>
  );
}
