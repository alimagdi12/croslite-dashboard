export interface Product {
  _id?: string;
  title: string;
  arabicTitle: string;
  price: number;
  description: string;
  details: string;
  imageUrl: {
    images: string[];
  };
  sizeFrom: number;
  sizeTo: number;
  size: {
    range: string[];
  };
  sizeInLetters?: string;
  sizeInCm?: number;
  firstColor: string;
  secondColor: string;
  rating?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
