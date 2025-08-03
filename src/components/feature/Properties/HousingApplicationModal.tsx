"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { ApplicationSelectableItem } from "@/types/Property";


interface Props {
  onClose: () => void;
  onSubmit: (data: { selected: ApplicationSelectableItem[]; comment: string }) => void;
  items?: ApplicationSelectableItem[];
}

const defaultItems: ApplicationSelectableItem[] = [
  { Code: "DUAL", isSelect: 1 },
  { Code: "RENTALSCORE", isSelect: 1 },
  { Code: "HISTORY", isSelect: 1 },
];

export default function HousingApplicationModal({
  onClose,
  onSubmit,
  items = defaultItems,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  // Pré-sélectionner les éléments cochés (isSelect: 1)
  useEffect(() => {
    const selected = items.filter((item) => item.isSelect === 1).map((i) => i.Code);
    setSelectedItems(selected);
  }, [items]);

  const toggleItem = (code: string) => {
    setSelectedItems((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 3
        ? [...prev, code]
        : prev // ne rien faire si déjà 3 cochés
    );
  };

  const handleSubmit = () => {
    const formatted = items.map((item) => ({
      Code: item.Code,
      isSelect: selectedItems.includes(item.Code) ? 1 : 0,
    }));

    onSubmit({ selected: formatted, comment });
    onClose();
  };

  return (
    <div className="rounded-lg w-full max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-md flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-white">Sélection et commentaire</h2>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <X size={20} className="dark:text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <label key={index} className="block">
              <input
                type="checkbox"
                value={item.Code}
                checked={selectedItems.includes(item.Code)}
                onChange={() => toggleItem(item.Code)}
                className="peer hidden"
              />
              <span
                className={`
                  flex items-center justify-center p-2 text-center border border-gray-200 dark:border-gray-600 
                  rounded-lg cursor-pointer 
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  peer-checked:bg-blue-100 dark:peer-checked:bg-blue-950 peer-checked:border-blue-500
                  transition-all duration-150 ease-in-out
                  peer-checked:scale-105
                `}
              >
                {item.Code}
              </span>
            </label>
          ))}
        </div>

        <textarea
          placeholder="Écrivez un commentaire ici..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <Button onClick={onClose} variant="outline-neutral">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="info">
          Valider
        </Button>
      </div>
    </div>
  );
}
