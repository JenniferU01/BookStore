// src/navigation/types.ts

export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  BookDetails: { id: number; title?: string };
  BookForm: { id?: number };
};
