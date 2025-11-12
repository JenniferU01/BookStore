// src/navigation/types.ts

export type RootStackParamList = {
  Tabs: undefined;
  BookDetails: { id: number };
  BookForm: { id?: number }; // id opcional para editar
};

export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};
