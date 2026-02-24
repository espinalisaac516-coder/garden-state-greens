import productFlower from "@/assets/product-flower.jpg";
import productEdibles from "@/assets/product-edibles.jpg";
import productVapes from "@/assets/product-vapes.jpg";
import productPrerolls from "@/assets/product-prerolls.jpg";

export interface Dispensary {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  image: string;
  categories: string[];
}

export interface Product {
  id: string;
  dispensaryId: string;
  name: string;
  category: string;
  strain: "Sativa" | "Indica" | "Hybrid";
  thc: string;
  price: number;
  image: string;
  description: string;
  weight: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const dispensaries: Dispensary[] = [
  {
    id: "1",
    name: "Queen City",
    address: "420 Main St",
    city: "Plainfield, NJ",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: "25-35 min",
    deliveryFee: 3.99,
    isOpen: true,
    image: productFlower,
    categories: ["Flower", "Edibles", "Vapes", "Pre-Rolls"],
  },
  {
    id: "2",
    name: "Jersey Leaf Co.",
    address: "710 Green Ave",
    city: "Jersey City, NJ",
    rating: 4.6,
    reviewCount: 218,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    isOpen: true,
    image: productEdibles,
    categories: ["Flower", "Edibles", "Concentrates"],
  },
  {
    id: "3",
    name: "The Terpene Lab",
    address: "215 Elm St",
    city: "Hoboken, NJ",
    rating: 4.9,
    reviewCount: 512,
    deliveryTime: "20-30 min",
    deliveryFee: 4.99,
    isOpen: true,
    image: productVapes,
    categories: ["Vapes", "Flower", "Pre-Rolls", "Edibles"],
  },
  {
    id: "4",
    name: "Pine Barrens Botanicals",
    address: "88 Pine Rd",
    city: "Trenton, NJ",
    rating: 4.5,
    reviewCount: 156,
    deliveryTime: "35-50 min",
    deliveryFee: 1.99,
    isOpen: false,
    image: productPrerolls,
    categories: ["Flower", "Pre-Rolls"],
  },
];

export const products: Product[] = [
  {
    id: "p1",
    dispensaryId: "1",
    name: "Blue Dream",
    category: "Flower",
    strain: "Hybrid",
    thc: "21%",
    price: 45,
    image: productFlower,
    description: "A legendary strain with balanced full-body relaxation and cerebral invigoration.",
    weight: "3.5g",
  },
  {
    id: "p2",
    dispensaryId: "1",
    name: "Sunset Gummies",
    category: "Edibles",
    strain: "Indica",
    thc: "10mg/pc",
    price: 30,
    image: productEdibles,
    description: "Fruit-flavored gummies perfect for winding down after a long day.",
    weight: "10 pieces",
  },
  {
    id: "p3",
    dispensaryId: "1",
    name: "Live Resin Cart",
    category: "Vapes",
    strain: "Sativa",
    thc: "85%",
    price: 55,
    image: productVapes,
    description: "Full-spectrum live resin cartridge with natural terpene profile.",
    weight: "1g",
  },
  {
    id: "p4",
    dispensaryId: "1",
    name: "OG Kush Pre-Roll",
    category: "Pre-Rolls",
    strain: "Indica",
    thc: "24%",
    price: 15,
    image: productPrerolls,
    description: "Hand-rolled premium flower pre-roll. Classic OG Kush genetics.",
    weight: "1g",
  },
  {
    id: "p5",
    dispensaryId: "1",
    name: "Sour Diesel",
    category: "Flower",
    strain: "Sativa",
    thc: "26%",
    price: 50,
    image: productFlower,
    description: "Energizing and dreamy cerebral effects. Fast-acting strain.",
    weight: "3.5g",
  },
  {
    id: "p6",
    dispensaryId: "1",
    name: "Chocolate Bar 100mg",
    category: "Edibles",
    strain: "Hybrid",
    thc: "100mg total",
    price: 35,
    image: productEdibles,
    description: "Premium dark chocolate bar. Evenly dosed for consistent experience.",
    weight: "1 bar",
  },
];
