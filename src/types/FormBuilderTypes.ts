import { ControllerFieldState, ControllerRenderProps, FieldValues, RegisterOptions, UseFormStateReturn } from "react-hook-form";

export interface FieldDefinition {
  type: FieldType;
  api: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  errorMessage?: string;
  options?: FieldOption[];
  rows?: number;
  checked?: boolean;
  defaultValue?: any;
  validation?: RegisterOptions;
  width?: 'full' | 'half'; // Contrôle de la largeur du champ
  hidden?: boolean | ((values: FieldValues) => boolean); // Pour les champs conditionnels
  className?: string; // Style personnalisé pour le champ
  multiple?: boolean; // Pour les champs de type select
  autoResize?: boolean; // Pour les champs de type textarea
  render?: (
    field: ControllerRenderProps, 
    fieldState: ControllerFieldState, 
    formState: UseFormStateReturn<FieldValues>
  ) => React.ReactElement<any>; // Modifié pour retourner ReactElement au lieu de ReactNode
}


export interface FormBuilderProps {
  fields: FieldDefinition[];
  onSubmit: (data: FieldValues) => void;
  onCancel?: () => void;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  className?: string;
  fieldClassName?: string;
  gridClassName?: string;
}

export interface FormBuilderRef {
  reset: () => void;
  setValue: (name: string, value: any) => void;
  trigger: (name?: string | string[]) => Promise<boolean>;
  getValues: (name?: string | string[]) => any;
  watch: (name?: string | string[]) => any;
}

export interface FieldOption {
  label: string;
  value: string;
}
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'checkbox' | 'select' | 'switch' | 'textarea';