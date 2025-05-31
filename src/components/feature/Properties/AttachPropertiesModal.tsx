import React, { useState } from "react";
import { Search, Check } from "lucide-react";
import Image from "next/image";
interface Property {
  id: string;
  address: string;
  type: "normal" | "complex";
  image: string;
}
interface AttachPropertiesModalProps {
  onClose: () => void;
  onAttach: (selectedProperties: string[]) => void;
  availableProperties: Property[];
}
export const AttachPropertiesModal = ({
  onClose,
  onAttach,
  availableProperties,
}: AttachPropertiesModalProps) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  
  const filteredProperties = availableProperties.filter(
    (property) =>
      property.type === "normal" &&
      property.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleToggleProperty = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[75vh] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Attach Properties
          </h2>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleToggleProperty(property.id)}
              >
                <div className="flex-shrink-0 w-16 h-16 mr-4">
                  <Image
                    height={800}
                    width={800}
                    src={property.image}
                    alt={property.address}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium dark:text-white">
                    {property.address}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedProperties.includes(property.id) ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-500"}`}
                  >
                    {selectedProperties.includes(property.id) && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAttach(selectedProperties);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={selectedProperties.length === 0}
          >
            Attach Selected Properties
          </button>
        </div>
      </div>
    </div>
  );
};
