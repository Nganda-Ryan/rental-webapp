import React from 'react';
const CtaSection = () => {
  return <section className="py-16 bg-blue-marin text-white ">
      <div className="container px-4 text-center max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Passez à <span className="text-red-500">l&apos;action</span> dès
          maintenant.
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Confiez nous la gestion de vos biens immobilier et facilitez vous la
          vie !
        </p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium">
          Essayez Rental dès maintenant !
        </button>
      </div>
    </section>;
};
export default CtaSection;