"use client"

import { FAQ } from '@/types/faq';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
const FaqItem = ({
  question,
  answer
}: FAQ) => {
  const [isOpen, setIsOpen] = useState(false);
  return <div className="relative">
    {/* Header */}
    <div className={`flex items-center text-blue-marin justify-between rounded pl-7 pr-4 min-h-14 poppins-font font-bold select-none cursor-pointer ${isOpen && "bg-slate-100 transition-all duration-[0.20s]"}`}  onClick={() => setIsOpen(!isOpen)}>
        <div className='flex flex-wrap flex-col xs:flex-row'>
            {question}
        </div>
        <div className="flex items-center flex-nowrap">
            <span className={`transition-all duration-[0.38s] relative w-7 h-7 cursor-pointer select-none ${isOpen && "-rotate-180"}`} onClick={() => setIsOpen(!isOpen)}>
                <Image
                    src="/images/assets/chevron.svg"
                    fill
                    alt="chevron"
                    className=""
                />
            </span>
        </div>
    </div>

    <hr className="h-px rounded bg-gray-200 border-0 mx-auto"></hr>

    {/* Contenu déroulant */}
    <div className={`rounded pl-7 pr-4 text-sm overflow-hidden transition-all duration-[0.20s] text-slate-800 ${isOpen ? "max-h-[600px] py-4" : "max-h-0 py-0"}`}>
        <div>
          {/* Description */}
          <div className="poppins-font my-3 text-sm">
              {answer}
          </div>
        </div>
    </div>
  </div>;
};
const FaqSection = () => {
  const t = useTranslations('Landing.faq');

  const faqs = [
    {
      question: t('q1'),
      answer: t('a1')
    }, {
      question: t('q2'),
      answer: t('a2')
    }, {
      question: t('q3'),
      answer: t('a3')
    }, {
      question: t('q4'),
      answer: t('a4')
    }
  ];
  return <section className="bg-white">
      <div className="max-w-screen-lg mt-10 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-marin">{t('title')}</h2>
          <p className="text-gray-500 mt-2">
            {t('subtitle')}
          </p>
        </div>
        <div className="">
          {faqs.map((faq, index) => <FaqItem key={index} question={faq.question} answer={faq.answer} />)}
        </div>
      </div>
    </section>;
};
export default FaqSection;