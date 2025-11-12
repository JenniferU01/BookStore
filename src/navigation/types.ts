// src/navigation/types.ts

export type RootStackParamList = {
  Tabs: undefined;
  BookDetails: { id: number; title?: string };
  BookForm: { id?: number } | undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};
