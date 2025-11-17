import { Media } from "./media";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  parentId: string | null;

  parent?: Category | null;
  medias: Media[];
  children?: Category[];
};
