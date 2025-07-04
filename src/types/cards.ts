import { LucideIcon } from "lucide-react";

export type CardItemProps = {
  imageSrc?: string;
  name?: string;
  role?: string;
  cardImageSrc?: string;
  cardTitle?: string;
  cardContent?: string;
};


export interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  Icon?: LucideIcon;

}