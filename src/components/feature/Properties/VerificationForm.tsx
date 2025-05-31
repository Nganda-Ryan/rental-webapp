import React, { useState } from "react";
import { X, Upload, FileText, Building2 } from "lucide-react";
import { Controller, useForm} from "react-hook-form"
import Button from "@/components/ui/Button";
import { IPropertyVerification, IPropertyVerificationDoc, IPropertyVerificationForm } from "@/types/Property";
import { requestPropertyVerification } from "@/actions/requestAction";
import toast from "react-hot-toast";

interface VerificationFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
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
    trigger,
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
      let temp_body: IPropertyVerificationDoc[] = [];
      if(data.bithCertificate){
        temp_body.push({
          Title: "Birth Certificate",
          ContentUrl: data.bithCertificate?.[0],
          Type: "BIRTH_CERTIFICATE"
        });
      }
      if(data.certificateOfInheritance){
        temp_body.push({
          Title: "Certificate of Inheritance",
          ContentUrl: data.certificateOfInheritance?.[0],
          Type: "INHERITANCE_CERTIFICATE"
        });
      }
      if(data.propertyDeed){
        temp_body.push({
          Title: "Property Deed",
          ContentUrl: data.propertyDeed?.[0],
          Type: "LAND_TITLE"
        });
      }
      if(data.buildindPermit){
        temp_body.push({
          Title: "Building Permit",
          ContentUrl: data.buildindPermit?.[0],
          Type: "BUILDING_PERMIT"
        });
      }
      if(data.deedOfSales){
        temp_body.push({
          Title: "Deed of Sale",
          ContentUrl: data.deedOfSales?.[0],
          Type: "DEED_SALE"
        });
      }



      const payload: IPropertyVerification = {
        assetCode: propertyId,
        body: temp_body,
        notes: data.notes ?? "",
        title: `Verification of ${propertyTitle}`,
        userId: ""
      }
      // console.log('-->payload', payload);

      const result = await requestPropertyVerification(payload);
      console.log('-->Result error', result);
      if(result.data){
        toast.success(`Votre propriété ${payload.title} a été crée avec succès`, { position: 'bottom-right' });
        onSubmit({});
      } else {
        toast.error(`Something went wrong during the process`, { position: 'bottom-right' });
      }
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
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[75vh] overflow-y-auto">
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
          {/* Fiscal Information */}
          {/* <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Fiscal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax ID Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div> */}
          
          {/* Additional Images */}
          {/* <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Additional Property Images</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="images"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setDocuments((prev) => [...prev, ...files]);
                }}
              />
              <label
                htmlFor="images"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload size={24} className="text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Upload additional property images
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Drag and drop or click to select
                </span>
              </label>
            </div>
          </div> */}
          
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
                  accept=".pdf,.doc,.docx"
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
                  accept=".pdf,.doc,.docx"
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
                  accept=".pdf,.doc,.docx"
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
                  accept=".pdf,.doc,.docx"
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
                  accept=".pdf,.doc,.docx"
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