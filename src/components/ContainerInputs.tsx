import React from "react";
import Select from "react-select"; // Importa SingleValue para el tipado
import type { MultiValue, SingleValue } from "react-select";

/********************************************************
 * Props para un select (simple o múltiple)
 ******************************************************** */

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

  // Define el tipo de dato para el handler de cambio
  type SelectValue = MultiValue<Option> | SingleValue<Option>;

  const handleChange = (selected: SelectValue) => {
    let values: string[] = [];

    if (isMulti) {
      // Caso 1: isMulti = true (selected es un array)
      values = (selected as MultiValue<Option>).map((opt) => opt.value);
    } else {
      // Caso 2: isMulti = false (selected es un objeto de opción o null)
      const singleSelected = selected as SingleValue<Option>;

      if (singleSelected) {
        values = [singleSelected.value];
      }
      // Si es null, 'values' queda como [] (deselección)
    }

    onChangeValues(values);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      <Select
        isMulti={isMulti}
        options={options}
        // Para selección simple, 'value' espera un único objeto o null.
        // Dado que solo queremos una opción, tomamos el primer elemento de selectedOptions.
        value={isMulti ? selectedOptions : selectedOptions[0] || null}
        onChange={handleChange} // Usamos la función de manejo corregida
        className="text-left"
        placeholder={placeholder}
      />
    </div>
  );
};

/********************************************************
 * Props para un input de texto simple
 ******************************************************** */
interface OneInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  type?: "number" | "text" | "password";
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

/********************************************************
 * Props para un input de texto doble (mínimo y máximo)
 ******************************************************** */
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

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
}) => {
  const switchBg = checked
    ? "bg-principal"
    : "bg-gray-200 border border-gray-300";
  const switchTranslate = checked ? "translate-x-full" : "translate-x-0";

  return (
    <div className="flex items-center justify-between p-3 border border-black rounded-lg shadow-sm bg-white">
      <span className="block font-medium mb-1">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`items-center relative inline-flex flex-shrink-0 h-8 w-15 transition-colors ease-in-out duration-200 rounded-full cursor-pointer botder-white focus:outline-none ${switchBg}`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-8 w-8 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${switchTranslate}`}
        />
      </button>
    </div>
  );
};

/********************************************************
 * Props para un input que es usado en las tablas de actividades
 ******************************************************** */
interface FilterInputProps {
  type: "text" | "date" | "select";
  value: string;
  placeholder?: string;
  options?: string[]; // Solo para 'select'
  onChange: (value: string) => void;
}

export function FilterInput({
  type,
  value,
  placeholder,
  options,
  onChange,
}: FilterInputProps) {
  const commonClasses = "w-full text-xs p-2 border rounded";

  if (type === "select" && options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${commonClasses} `}
      >
        <option value="">Todos</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  // Para 'text' o 'date'
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={commonClasses}
    />
  );
}
