"use client"
import { FeatureCardType } from '@/types/FeatureCardType';
import Image from 'next/image';
import React, { useState } from 'react';


const FeaturesSection = () => {
  const features: FeatureCardType[] = [
    {
      number: 1,
      title: "Automatiser la gestion",
      description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
      image: "/images/feature/feature1.jpg"
    },
    {
      number: 2,
      title: "Gestion des contrats & facturation",
      description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
      image: "/images/feature/feature2.jpg"
    },
    {
      number: 3,
      title: "Evaluation & Historique en temps reel",
      description: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
      image: "/images/feature/feature3.avif"
    }
  ]
  return <section className="py-20 bg-white">
    <div className="px-4 mx-auto max-w-screen-xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-blue-marin mb-4">
          Vos biens immobilier sont en sécurité
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
          consectetur.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.number}
            number={feature.number}
            title={feature.title}
            description={feature.description}
            image={feature.image}
          />
        ))}
      </div>
    </div>
  </section>;
};

const FeatureCard = ({ number, title, description, image }: FeatureCardType) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 shadow-xl">
      <div className="relative h-1/2 w-full overflow-hidden rounded-lg mb-3">
        {/* Skeleton animé */}
        {isImageLoading && (
            <div role="status" className="h-full w-full rounded-sm shadow-sm animate-pulse">
                <div className="h-full flex items-center justify-center bg-gray-300 rounded-sm dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                    </svg>
                </div>
            </div>
        )}

        {/* Image */}
        <Image
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          width={800}
          height={600}
          onLoad={() => setIsImageLoading(false)}
          priority
        />
      </div>
      <div className="flex justify-start items-center">
        <h3 className="text-xl font-bold text-blue-marin mb-3">
          {title}
        </h3>
      </div>
      <p className="text-gray-500">
        {description}
      </p>
    </div>
  )
}
export default FeaturesSection;