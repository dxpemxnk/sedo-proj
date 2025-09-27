import { UserType } from "@/entities/user/model";

export type DocumentType = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category: { name: string };
  user_id: number;
  User: UserType;
  signed: boolean;
  date_start: string;
  date_end: string;
};

export type CreateDocumentType = {
  name: string;
  description: string;
  category_id: number;
  user_id: number;
  signed: boolean;
  date_start: string;
  date_end: string;
};

export type DocWithoutId = Omit<DocumentType, "id">;

export type DocList = DocumentType[];
// export type DocWithoutId = Omit<Doc, 'id'>;

// Re-export API
export { docApi } from "../api/DocApi";
export { categoryApi } from "../api/categoryApi";

// Re-export types
export type { CategoryType, CategoryList } from "./catTypes";
