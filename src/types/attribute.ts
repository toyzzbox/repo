export type Attribute = {
  id: string;
  name: string;
  slug?: string;
  medias: {
    id: string;
    variants: {
      cdnUrl: string;
      key: string;
      type: string;
    }[];
  }[];
};
