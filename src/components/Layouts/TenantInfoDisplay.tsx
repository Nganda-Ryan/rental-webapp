import React from 'react';
import { MapPin, Mail, Phone, User, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import { IGetTenant } from '@/types/user';
import Image from 'next/image';
import { formatDateToText } from '@/lib/utils';



interface TenantInfoDisplayProps {
  tenantInfo: IGetTenant;
}

const TenantInfoDisplay: React.FC<TenantInfoDisplayProps> = ({ tenantInfo }) => {

  const getStatusBadge = (status: string, isActive: number) => {
    if (isActive === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          <XCircle size={14} className="mr-1" />
          Inactif
        </span>
      );
    }

    switch (status.toLowerCase()) {
      case 'active':
      case 'actif':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle size={14} className="mr-1" />
            Actif
          </span>
        );
      case 'pending':
      case 'en attente':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  // Fonction pour obtenir les initiales
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  // Fonction pour formater le genre
  const formatGender = (gender: string) => {
    return gender === 'MALE' ? 'Masculin' : gender === 'FEMALE' ? 'Féminin' : gender;
  };

  // Fonction pour formater le rôle
  const formatRole = (roleCode: string) => {
    const roles: { [key: string]: string } = {
      'TENANT': 'Locataire',
      'OWNER': 'Propriétaire',
      'ADMIN': 'Administrateur',
      'MANAGER': 'Gestionnaire'
    };
    return roles[roleCode] || roleCode;
  };

  const { user } = tenantInfo;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* En-tête avec avatar et informations principales */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              {user.AvatarUrl ? (
                <Image
                    height={800}
                    width={800}
                    src={user.AvatarUrl}
                    alt={`${user.Firstname} ${user.Lastname}`}
                    className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 bg-blue-700 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {getInitials(user.Firstname, user.Lastname)}
                  </span>
                </div>
              )}
              {tenantInfo.IsActive === 1 && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>

            {/* Nom et rôle */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.Firstname} {user.Lastname}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  <Shield size={14} className="mr-1" />
                  {formatRole(tenantInfo.RoleCode)}
                </span>
              </div>
            </div>
          </div>

          {/* Badge de statut */}
          <div>
            {getStatusBadge(tenantInfo.Status, tenantInfo.IsActive)}
          </div>
        </div>
      </div>

      {/* Corps avec les détails */}
      <div className="p-6">
        {/* Informations de contact */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Informations de contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email principal */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Mail size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email principal</p>
                <a 
                  href={`mailto:${user.Email}`}
                  className="text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                >
                  {user.Email}
                </a>
              </div>
            </div>

            {/* Téléphone principal */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Phone size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Téléphone principal</p>
                <a 
                  href={`tel:${user.Phone}`}
                  className="text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {user.Phone}
                </a>
              </div>
            </div>

            {/* Email secondaire si disponible */}
            {user.OtherEmail && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mail size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email secondaire</p>
                  <a 
                    href={`mailto:${user.OtherEmail}`}
                    className="text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                  >
                    {user.OtherEmail}
                  </a>
                </div>
              </div>
            )}

            {/* Téléphone secondaire si disponible */}
            {user.OtherPhone && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Phone size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Téléphone secondaire</p>
                  <a 
                    href={`tel:${user.OtherPhone}`}
                    className="text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {user.OtherPhone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Adresse */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Adresse
          </h3>
          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <MapPin size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                {user.Address.Street}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {user.Address.City}, {user.Address.Country}
              </p>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Informations supplémentaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Genre */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Genre</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium flex items-center">
                <User size={16} className="mr-2 text-purple-500" />
                {formatGender(user.Gender)}
              </p>
            </div>

            {/* NIU */}
            {user.NIU && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">NIU</p>
                <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                  {user.NIU}
                </p>
              </div>
            )}

            {/* Date de création */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Membre depuis</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium flex items-center">
                <Calendar size={16} className="mr-2 text-indigo-500" />
                {formatDateToText(tenantInfo.CreatedAt)}
              </p>
            </div>

            {/* Code utilisateur */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Code utilisateur</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-mono">
                {user.Code}
              </p>
            </div>

            {/* Code locataire */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Code locataire</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-mono">
                {tenantInfo.Code}
              </p>
            </div>

            {/* Statut utilisateur */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut utilisateur</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                {user.Status}
              </p>
            </div>
          </div>
        </div>

        {/* Profils si disponibles */}
        {user.Profiles && user.Profiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Profils associés
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.Profiles.map((profile, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                >
                  {typeof profile === 'string' ? profile : profile.name || 'Profil'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantInfoDisplay;