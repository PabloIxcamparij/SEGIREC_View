import React from "react";
import Select from "react-select";
import type { MultiValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChangeValues: (values: string[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  className?: string;
}

export const InputSelect: React.FC<InputSelectProps> = ({
  label,
  options,
  selectedValues,
  onChangeValues,
  placeholder = "Seleccione una opción...",
  isMulti = true,
  className = "",
}) => {
  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  return (
    <div className={`w-full ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      <Select
        isMulti={isMulti}
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          const values = (selected as MultiValue<Option>).map(
            (opt: Option) => opt.value
          );
          onChangeValues(values);
        }}
        className="text-left"
        placeholder={placeholder}
      />
    </div>
  );
};
///

interface OneInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  type?: "number" | "text";
}

export const OneInputProps: React.FC<OneInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Valor",
  className = "",
  type = "text",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
      />
    </div>
  );
};


///
interface DoubleInputProps {
  label: string;
  valueMin: string | number;
  valueMax: string | number;
  onChangeMin: (value: string | number) => void;
  onChangeMax: (value: string | number) => void;
  placeholderMin?: string;
  placeholderMax?: string;
  className?: string;
}

export const DoubleInput: React.FC<DoubleInputProps> = ({
  label,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  placeholderMin = "Valor mínimo",
  placeholderMax = "Valor máximo",
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder={placeholderMin}
          value={valueMin}
          onChange={(e) => onChangeMin(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
        />
        <input
          type="number"
          placeholder={placeholderMax}
          value={valueMax}
          onChange={(e) => onChangeMax(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
        />
      </div>
    </div>
  );
};
