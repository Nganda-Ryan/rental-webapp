import FileUpload from '@/components/ImageUpload/FileUpload';
import React, { useState } from 'react';

function PhotosForm() {
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; base64: string }[]>([]);

  const handleFilesChange = (files: { file: File; base64: string }[]) => {
    setUploadedFiles(files);
    console.log('Fichiers avec base64:', files);
    
    // Exemple d'envoi vers un CDN
    files.forEach(({ file, base64 }) => {
      console.log(`Prêt à envoyer "${file.name}" au CDN avec base64`);
      // sendToCDN(base64, file.name); // Fonction hypothétique d'envoi au CDN
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Upload de fichiers</h1>
      
      <FileUpload 
        onFilesChange={handleFilesChange}
        acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']} // Types acceptés
        maxFileSize={2 * 1024 * 1024} // 2Mo max par fichier
        maxFiles={5} // 5 fichiers max
        label="Télécharger vos images et PDF" 
      />
    </div>
  );
}

export default PhotosForm;