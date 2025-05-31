export interface PropertiesGeneralInfoFormRef {
    reset: () => void;
    setValue: (name: string, value: any) => void;
    trigger: () => Promise<boolean>;
    getValues: () => Record<string, any>;
}

export interface ComplementaryInfoFormRef {
    reset: () => void;
    setValue: (name: string, value: any) => void;
    trigger: () => Promise<boolean>;
    getValues: () => Record<string, any>;
}