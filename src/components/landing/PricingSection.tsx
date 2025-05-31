import React from 'react';


type Feature = {
  text: string;
  recommended: boolean ;
};

type PricingCardProps = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  recommended?: boolean;
  ctaText?: string;
};


const PricingFeature = ({ text, recommended = false }: Feature & { recommended?: boolean }) => (
  <div className="flex items-start space-x-2 mb-3">
    <div className={`${recommended ? 'text-blue-marin' : 'text-orange-500'}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className={`${recommended ? 'text-white' : 'text-blue-marin'}`}>
      {text}
    </span>
  </div>
);


const PricingCard = ({
  name,
  price,
  period,
  features,
  recommended = false,
  ctaText = "Commencer"
}: PricingCardProps) => {
  return (
    <div 
      className={`rounded-xl p-6 md:p-4 flex flex-col h-fit
        ${recommended 
          ? 'bg-red-500 text-white border border-red-600 shadow-xl transform md:scale-105 relative z-10 shadow-red-500/50 ' 
          : 'bg-gray-50 border border-gray-100'
        }
      `}
    >
      <div className="mb-8">
        <h3 className={`text-xl font-bold mb-4 ${recommended ? 'text-white' : 'text-[#0a2540]'}`}>
          {name}
        </h3>
        <div className="flex items-end mb-6">
          <span className="text-2xl md:text-3xl font-bold">{price}</span>
          {period && (
            <span className={`ml-1 ${recommended ? 'text-white/80' : 'text-gray-500'}`}>
              {period}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <PricingFeature 
              key={index} 
              text={feature} 
              recommended={recommended}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <button 
          className={`
            w-full px-4 py-2 rounded-md font-medium transition-colors
            ${recommended 
              ? 'bg-white text-red-500 hover:bg-gray-100' 
              : 'border border-[#0a2540] text-[#0a2540] hover:bg-gray-100'
            }
          `}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};


const PricingSection = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0,00 FCFA",
      features: [
        "Limité à un bien locatif",
        "Limité à un locataire",
        "Utilisateur unique",
        "Support"
      ]
    },
    {
      name: "Cool",
      price: "10 000 FCFA",
      period: "/ mois",
      recommended: true,
      features: [
        "Limité à 5 biens locatifs",
        "Limité à 12 locataires par bien locatif",
        "Multi-utilisateur",
        "Contrat au modèle professionnel",
        "Consulter jusqu'à 10 rentalscore gratuitement",
        "Consulter jusqu'à 10 historique de location",
        "Envoi et réception d'un email de rappel pour les différentes factures mensuels",
        "Envoi et réception d'un sms de rappel pour les différentes factures mensuels",
        "Envoi de facture par mail après le règlement d'une facture(loyer,eau,électricité etc..)",
        "Support prioritaire"
      ]
    },
    {
      name: "Super cool",
      price: "20 000 FCFA",
      period: "/ mois",
      features: [
        "biens locatif illimité",
        "limité à 50 par bien locatif",
        "Multi-utilisateur",
        "Contrat au modèle professionnel accessible",
        "Consulter jusqu'à 50 rentalscore gratuitement",
        "Consulter jusqu'à 30 historique de location",
        "Envoi et réception de plusieurs emails de rappel pour les différentes factures mensuels",
        "Envoi et réception de plusieurs sms de rappel pour les différentes factures mensuels",
        "Envoi de facture par mail après le règlement d'une facture(loyer,eau,électricité etc..)",
        "Support prioritaire"
      ]
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a2540]">Nos offres</h2>
          <p className="text-gray-500 mt-2">
            Choisissez l&apos;offre qui vous convient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              recommended={plan.recommended}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;