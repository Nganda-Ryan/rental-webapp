import { ButtonProps } from '@/types/button';
import { Button as HButton } from '@headlessui/react';
import React from 'react';
import { VARIANTS } from '@/types/button';
import Spinner from './Spinner';

const Button = ({ children, variant = 'neutral', disable = false, onClick, isSubmitBtn = false, fullWidth = true, loading = false }: ButtonProps) => {

    const widthClass = fullWidth ? 'w-full' : 'w-auto';
    const classes = `${widthClass} w-fit  inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded transition ${VARIANTS[variant] || ''} ${disable ? 'opacity-50 cursor-not-allowed' : ''}`;
    const type = isSubmitBtn ? 'submit' : 'button';

    return (
        <HButton disabled={disable} type={type} onClick={onClick} className={classes}>
            {children} {loading && <Spinner size='sm' />}
        </HButton>
    );
};

export default Button;
