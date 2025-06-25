export type RootStackParamList = {
  Home: undefined;
  Product: undefined;
  Filter: undefined;
};
export type ResultData = {
  [key: string]: string;
};

export type ProductType = {
  deviceType: string;
  model: string;
  brand: string;
  serialNumber: string;
  manufactureCountry: string;
  createdAt: Date;
};
