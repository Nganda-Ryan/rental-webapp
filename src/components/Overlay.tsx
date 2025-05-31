"use client"
import React, { useEffect, useRef, useState, type JSX } from 'react';

type Props = {
    children: JSX.Element | string, 
    onClose: () => void
    isOpen: boolean
}
const Overlay = ({children, isOpen, onClose} : Props) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === overlayRef.current) {
            console.log('overlay clicked')
            onClose();
        }
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent): void => {
          if (e.key === 'Escape') {
            onClose();
          }
        };
        
        if (isOpen) {
          document.addEventListener('keydown', handleEscKey as unknown as EventListener);
        }
        
        return () => {
          document.removeEventListener('keydown', handleEscKey as unknown as EventListener);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className={`fixed inset-0 -top-50 -bottom-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000000]`}
            onClick={handleOverlayClick}
        >
            <span onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                {children}
            </span>
        </div>
    )
}

export default Overlay