import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileWithPreview extends File {
  id: string;
  base64?: string;
}

interface FileUploadProps {
  onFilesChange: (files: { file: File; base64: string }[]) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // en octets
  maxFiles?: number;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  acceptedFileTypes = [],
  maxFileSize = 5 * 1024 * 1024, // 5Mo par défaut
  maxFiles = 10,
  label = "Télécharger des fichiers"
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Convertir le tableau des types acceptés en string pour l'attribut accept
  const acceptAttribute = acceptedFileTypes.length > 0 
    ? acceptedFileTypes.join(', ') 
    : undefined;
  
  // Formatage pour affichage des types acceptés
  const displayAcceptedTypes = acceptedFileTypes.length > 0
    ? acceptedFileTypes.map(type => type.replace('image/', '.').replace('application/', '.')).join(', ')
    : 'Tous les fichiers';

  // Formatage de la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' octets';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    else return (bytes / 1048576).toFixed(1) + ' Mo';
  };

  // Convertir un fichier en base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Traiter les fichiers (validation + conversion en base64)
  const processFiles = async (fileList: FileList) => {
    setError("");
    const filesToProcess = Array.from(fileList);
    
    // Vérification du nombre max de fichiers
    if (files.length + filesToProcess.length > maxFiles) {
      setError(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
      return;
    }
    
    const newFiles: FileWithPreview[] = [];
    const filesWithBase64: { file: File; base64: string }[] = [];
    
    for (const file of filesToProcess) {
      // Vérification du type de fichier si des types sont spécifiés
      if (acceptedFileTypes.length > 0) {
        const fileType = file.type;
        const isAccepted = acceptedFileTypes.some(type => 
          fileType.startsWith(type) || type === '*/*');
        
        if (!isAccepted) {
          setError(`Le type de fichier "${file.type}" n'est pas accepté`);
          continue;
        }
      }
      
      // Vérification de la taille du fichier
      if (file.size > maxFileSize) {
        setError(`Le fichier "${file.name}" dépasse la taille maximale de ${formatFileSize(maxFileSize)}`);
        continue;
      }

      try {
        // Conversion en base64
        const base64 = await convertToBase64(file);
        
        // Créer un ID unique pour chaque fichier
        const fileWithId: FileWithPreview = Object.assign(file, {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          base64
        });
        
        newFiles.push(fileWithId);
        filesWithBase64.push({ file, base64 });
      } catch (err) {
        console.error("Erreur lors de la conversion en base64:", err);
        setError(`Erreur lors du traitement du fichier "${file.name}"`);
      }
    }
    
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      
      // Mettre à jour la liste de fichiers dans le composant parent
      const allFilesWithBase64 = [
        ...files.map(f => ({ file: f, base64: f.base64 || '' })),
        ...filesWithBase64
      ];
      onFilesChange(allFilesWithBase64);
    }
  };

  // Gestion du changement de fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processFiles(e.target.files);
    // Réinitialiser l'input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Gestionnaires d'événements drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    processFiles(e.dataTransfer.files);
  };

  // Ouvrir le sélecteur de fichiers
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Supprimer un fichier
  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    
    // Mettre à jour la liste de fichiers dans le composant parent
    onFilesChange(updatedFiles.map(f => ({ 
      file: f, 
      base64: f.base64 || '' 
    })));
  };

  return (
    <div className="w-full">
      {/* Zone de téléchargement */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-4 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <motion.div 
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            className="w-12 h-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </motion.div>
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
        <p className="text-xs text-gray-500">Glissez-déposez ou cliquez pour sélectionner</p>
        <p className="text-xs text-gray-400 mt-1">
          {`Types acceptés: ${displayAcceptedTypes} • Max ${formatFileSize(maxFileSize)} par fichier`}
        </p>
        {files.length > 0 && (
          <div className="mt-2 text-xs font-semibold text-blue-600">
            {files.length} {files.length === 1 ? 'fichier' : 'fichiers'} sélectionné{files.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white dark:bg-slate-600 rounded-lg overflow-hidden shadow-md border dark:border-0 border-gray-200 group"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-300 mt-1">{formatFileSize(file.size)}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#EF4444' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Supprimer le fichier"
                >
                  <svg 
                    className="w-3 h-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptAttribute}
        multiple
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;