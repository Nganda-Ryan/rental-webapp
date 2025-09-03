'use client'

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Info, Shield } from 'lucide-react';

const LegalInformationSection = () => {
  const [expandedLegalSection, setExpandedLegalSection] = useState<string | null>(null);

  const legalContent: Record<'about' | 'terms' | 'service' | 'privacy', string> = {
    about: `Rentila is a comprehensive property management platform designed to simplify the rental process for landlords and tenants. Founded in 2020, we aim to revolutionize how rental properties are managed through innovative technology and user-friendly interfaces.`,
    terms: `These Terms and Conditions constitute a legally binding agreement made between you and Rentila, concerning your access to and use of our website and services. By using our platform, you agree to be bound by these Terms and Conditions.`,
    service: `Our Terms of Service outline the rules and regulations for the use of Rentila's services. By accessing this website, we assume you accept these terms of service in full. Do not continue to use Rentila's website if you do not accept all of the terms stated on this page.`,
    privacy: `Your privacy is important to us. It is Rentila's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you.`,
  };

  const toggleLegalSection = (section: string) => {
    setExpandedLegalSection(expandedLegalSection === section ? null : section);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Info size={20} />
        Legal & Information
      </h2>
      <div className="space-y-3">
        {Object.keys(legalContent).map((section) => (
          <div key={section}>
            <button
              onClick={() => toggleLegalSection(section)}
              className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {section === 'about' && <Info size={16} className="text-gray-500 dark:text-gray-400" />}
                {section === 'terms' && <FileText size={16} className="text-gray-500 dark:text-gray-400" />}
                {section === 'service' && <FileText size={16} className="text-gray-500 dark:text-gray-400" />}
                {section === 'privacy' && <Shield size={16} className="text-gray-500 dark:text-gray-400" />}
                <span className="text-gray-800 dark:text-gray-100">{section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}</span>
              </div>
              {expandedLegalSection === section ? (
                <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              )}
            </button>
            {expandedLegalSection === section && (
              <div className="mt-2 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{legalContent[section as keyof typeof legalContent]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalInformationSection;
