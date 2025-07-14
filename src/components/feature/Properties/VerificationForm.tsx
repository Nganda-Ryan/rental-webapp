import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { useForm} from "react-hook-form"
import Button from "@/components/ui/Button";
import { IPropertyVerification, IPropertyVerificationDoc, IPropertyVerificationForm } from "@/types/Property";
import { requestPropertyVerification } from "@/actions/requestAction";
import toast from "react-hot-toast";
import { AVAILABLE_FILE_EXTENSION } from "@/constant";

interface VerificationFormProps {
  onClose: () => void;
  onSubmit: (data: IPropertyVerificationDoc[], note: string ) => void;
  propertyId: string;
  propertyTitle: string;
}

export const VerificationForm = ({
  onClose,
  onSubmit,
  propertyId,
  propertyTitle
}: VerificationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      propertyDeed: null,
      buildindPermit: null,
      deedOfSales: null,
      bithCertificate: null,
      certificateOfInheritance: null,
      notes: ""
    }
  });

  const handleFormSubmit = async (data: IPropertyVerificationForm) => {
    try {
      setIsSubmitting(true);
      let body: IPropertyVerificationDoc[] = [];
      if(data.bithCertificate){
        body.push({
          Title: "Birth Certificate",
          ContentUrl: data.bithCertificate?.[0],
          Type: "BIRTH_CERTIFICATE"
        });
      }
      if(data.certificateOfInheritance){
        body.push({
          Title: "Certificate of Inheritance",
          ContentUrl: data.certificateOfInheritance?.[0],
          Type: "INHERITANCE_CERTIFICATE"
        });
      }
      if(data.propertyDeed){
        body.push({
          Title: "Property Deed",
          ContentUrl: data.propertyDeed?.[0],
          Type: "LAND_TITLE"
        });
      }
      if(data.buildindPermit){
        body.push({
          Title: "Building Permit",
          ContentUrl: data.buildindPermit?.[0],
          Type: "BUILDING_PERMIT"
        });
      }
      if(data.deedOfSales){
        body.push({
          Title: "Deed of Sale",
          ContentUrl: data.deedOfSales?.[0],
          Type: "DEED_SALE"
        });
      }

      onSubmit(body, data.notes ?? "");


    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  }

  const validateAtLeastOneFile = () => {
    const { propertyDeed, buildindPermit, deedOfSales } = getValues();
    const hasAtLeastOne = propertyDeed || buildindPermit || deedOfSales;
    return !!hasAtLeastOne || "Please provide at least one document.";
  };


  return (
    <div className="rounded-lg w-full max-h-[75vh] overflow-y-auto max-w-2xl mx-auto bg-white dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Property Verification</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 sm:p-6 space-y-6">
          
          
          {/* Property Documents */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Property Documents</h3>
              <h3 className="font-medium text-xs text-gray-400 dark:text-white">Please provide at least one document <span className="text-red-600">*</span> </h3>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-400 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white">Property Deed</span>
                </div>
                <input
                  type="file"
                  accept={AVAILABLE_FILE_EXTENSION}
                  className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40
                  "
                  {...register("propertyDeed", { validate: validateAtLeastOneFile })}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-400 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white">Building Permit</span>
                </div>
                <input
                  type="file"
                  accept={AVAILABLE_FILE_EXTENSION}
                  className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40
                  "
                  {...register("buildindPermit", { validate: validateAtLeastOneFile })}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-400 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white">Deed of Sale</span>
                </div>
                <input
                  type="file"
                  accept={AVAILABLE_FILE_EXTENSION}
                  className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40
                  "
                  {...register("deedOfSales", { validate: validateAtLeastOneFile })}
                />
              </div>
              {(errors.propertyDeed || errors.buildindPermit || errors.deedOfSales) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.propertyDeed?.message ||
                    errors.buildindPermit?.message ||
                    errors.deedOfSales?.message}
                </p>
              )}
            </div>
          </div>
          
          {/* Additionnal Documents */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Additionnal Documents</h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-400 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white">Bith Certificate</span>
                </div>
                <input
                  type="file"
                  accept={AVAILABLE_FILE_EXTENSION}
                  className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40
                  "
                  {...register("bithCertificate")}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-400 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white">Certificate of inheritance</span>
                </div>
                <input
                  type="file"
                  accept={AVAILABLE_FILE_EXTENSION}
                  className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40
                  "
                  {...register("certificateOfInheritance")}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Additional Information</h3>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              rows={4}
              placeholder="Any additional information about the property..."
              {...register("notes")}
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button variant='info' disable={isSubmitting} isSubmitBtn fullWidth={false}>
              {isSubmitting ? "Submitting..." : "Submit Verification"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};