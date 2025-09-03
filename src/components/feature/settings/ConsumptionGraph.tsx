'use client'

import React, { useState } from 'react';
import { IConsumption } from '@/types/user';
import Overlay from '@/components/Overlay';
import { ChevronDown } from 'lucide-react';

interface ConsumptionGraphProps {
  consumptions: IConsumption[];
}

const ConsumptionGraph: React.FC<ConsumptionGraphProps> = ({ consumptions }) => {
  
  // Filtrer seulement les éléments mesurables pour le graphique
  const measurableConsumptions = consumptions.filter(c => c.item.IsMesurable === 1);

  // Créer les cartes de résumé
  const SummaryCard = ({ consumption }: { consumption: IConsumption }) => {
    const usedPercentage = ((consumption.Quantity - consumption.Remaining) / consumption.Quantity) * 100;
    const isMediumUsage = usedPercentage >= 30 && usedPercentage < 70;
    const isHighUsage = usedPercentage >= 70;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">
          {consumption.item.Title}
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {consumption.Quantity - consumption.Remaining}/{consumption.Quantity}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isHighUsage ? 'bg-red-100 text-red-800' :
            isMediumUsage ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {Math.round(usedPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isHighUsage ? 'bg-red-500' :
              isMediumUsage ? 'bg-yellow-500' :
              'bg-green-500'
            }`} 
            style={{ width: `${usedPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {measurableConsumptions.map((consumption) => (
          <SummaryCard key={consumption.Code} consumption={consumption} />
        ))}
      </div>

      {/* Fonctionnalités activées */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Fonctionnalités Activées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consumptions.filter(c => c.item.IsMesurable === 0).map((feature) => (
            <div key={feature.Code} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-700 rounded-lg border border-green-200 dark:border-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">{feature.item.Title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.item.Description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsumptionGraph;
