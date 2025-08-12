import { Plan } from '@/types/configType';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingCardProps {
  pricingInfo: Plan;
  currency: string;
  currentPlanId: string; // id du plan actif
  onBuyClick: (planId: string, price: number, currency: string) => void; // callback quand on clique sur acheter
}

const PricingCard: React.FC<PricingCardProps> = ({
  pricingInfo,
  currency,
  currentPlanId,
  onBuyClick,
}) => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const isCurrent = pricingInfo.id === currentPlanId;

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 ${
        isCurrent
          ? 'bg-white dark:bg-gray-700 border-blue-500'
          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-700'
      }`}
    >
      {/* Header clickable */}
      <div
        onClick={() => togglePlanExpansion(pricingInfo.id)}
        className={`p-4 cursor-pointer flex justify-between items-center ${
          isCurrent ? '' : ''
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className={`font-bold text-xl ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white'}`}>
              {pricingInfo.name}
            </h3>
            {pricingInfo.is_recommended && (
              <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full select-none">
                Recommended
              </span>
            )}
            {
                isCurrent && (
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full select-none">
                        Offre actuelle
                    </span>
                )
            }
          </div>
          <div className={`mt-1 flex items-baseline gap-1 ${isCurrent ? 'text-gray-900 dark:text-white' : ''}`}>
            <span className="font-extrabold text-lg">
              {pricingInfo.pricing[0].amount.toLocaleString()}
            </span>
            <span className="text-lg font-medium">{currency}</span>
            <span className="text-sm opacity-80">/{pricingInfo.pricing[0].price_term}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pricingInfo.id != "FREE" && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // empêche toggle quand on clique sur bouton
                onBuyClick(pricingInfo.id, pricingInfo.pricing[0].amount, currency);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1.5 rounded transition-colors duration-200 whitespace-nowrap"
              type="button"
            >
              Acheter
            </button>
          )}

          {expandedPlan === pricingInfo.id ? (
            <ChevronUp size={24} className={isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500'} />
          ) : (
            <ChevronDown size={24} className={isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500'} />
          )}
        </div>
      </div>

      {/* Contenu animé */}
      <AnimatePresence initial={false}>
        {expandedPlan === pricingInfo.id && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`overflow-hidden border-t ${
              isCurrent ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className={`p-4 ${isCurrent ? '' : ''}`}>
              <ul className="space-y-3 mb-4">
                {pricingInfo.features.map((feature) => (
                  <li className="flex items-start gap-2" key={feature.id}>
                    <Check
                      size={16}
                      className={`${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-green-500'} mt-0.5 flex-shrink-0`}
                    />
                    <span className={`text-sm ${isCurrent ? 'text-gray-900 dark:text-gray-100' : ''}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingCard;