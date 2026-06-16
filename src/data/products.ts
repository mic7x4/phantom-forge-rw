import pPc from "@/assets/p-pc1.jpg";
import pLaptop from "@/assets/p-laptop1.jpg";
import pMonitor from "@/assets/p-monitor1.jpg";
import pKeyboard from "@/assets/p-keyboard1.jpg";
import pMouse from "@/assets/p-mouse1.jpg";
import pHeadset from "@/assets/p-headset1.jpg";
import pChair from "@/assets/p-chair1.jpg";
import pConsole from "@/assets/p-console1.jpg";
import pController from "@/assets/p-controller1.jpg";
import pStream from "@/assets/p-stream1.jpg";
import pMobile from "@/assets/p-mobile1.jpg";
import pGpu from "@/assets/p-gpu1.jpg";

import cPc from "@/assets/cat-pc.jpg";
import cLaptop from "@/assets/cat-laptop.jpg";
import cConsole from "@/assets/cat-console.jpg";
import cAccessories from "@/assets/cat-accessories.jpg";
import cComponents from "@/assets/cat-components.jpg";

export type Category = {
  slug: string;
  name: string;
  image: string;
  blurb: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number; // RWF
  oldPrice?: number;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  badge?: "BEST SELLER" | "NEW" | "HOT" | "-15%";
  description: string;
  specs: { label: string; value: string }[];
  bestSeller?: boolean;
  newArrival?: boolean;
};

export const categories: Category[] = [
  { slug: "gaming-pcs", name: "Gaming PCs", image: cPc, blurb: "Custom-built rigs ready to dominate." },
  { slug: "laptops", name: "Gaming Laptops", image: cLaptop, blurb: "Portable powerhouses for every battle." },
  { slug: "consoles", name: "Consoles", image: cConsole, blurb: "PlayStation, Xbox & Nintendo." },
  { slug: "accessories", name: "Accessories", image: cAccessories, blurb: "Headsets, mice, keyboards & more." },
  { slug: "components", name: "PC Components", image: cComponents, blurb: "GPUs, CPUs & upgrade parts." },
];

export const products: Product[] = [
  {
    id: "p1", slug: "phantom-rig-rtx-4070",
    name: "Phantom Rig RTX 4070",
    brand: "Net Phantom",
    category: "gaming-pcs",
    price: 2_450_000, oldPrice: 2_750_000,
    image: pPc, images: [pPc, cPc],
    stock: 5, rating: 4.9, reviews: 124,
    badge: "BEST SELLER", bestSeller: true,
    description: "A custom-built gaming tower engineered in Kigali. Intel Core i7, 32GB DDR5, RTX 4070, 1TB NVMe and silent liquid cooling — ready for 1440p ultra esports.",
    specs: [
      { label: "CPU", value: "Intel Core i7-13700KF" },
      { label: "GPU", value: "NVIDIA RTX 4070 12GB" },
      { label: "RAM", value: "32GB DDR5 6000MHz" },
      { label: "Storage", value: "1TB NVMe Gen4 SSD" },
      { label: "Cooling", value: "240mm AIO Liquid" },
      { label: "Warranty", value: "2 years local" },
    ],
  },
  {
    id: "p2", slug: "shadow-laptop-rtx-4060",
    name: "Shadow Laptop RTX 4060",
    brand: "ROG",
    category: "laptops",
    price: 1_890_000,
    image: pLaptop, images: [pLaptop, cLaptop],
    stock: 8, rating: 4.7, reviews: 88,
    badge: "HOT", bestSeller: true,
    description: "15.6\" QHD 165Hz display, Ryzen 9, RTX 4060, per-key RGB and 90Wh battery. Built for tournaments and streaming on the go.",
    specs: [
      { label: "Display", value: "15.6\" QHD 165Hz" },
      { label: "CPU", value: "AMD Ryzen 9 7940HS" },
      { label: "GPU", value: "RTX 4060 8GB" },
      { label: "RAM", value: "16GB DDR5" },
      { label: "Storage", value: "1TB NVMe SSD" },
      { label: "Weight", value: "2.1 kg" },
    ],
  },
  {
    id: "p3", slug: "phantom-curve-34-ultrawide",
    name: "Phantom Curve 34\" Ultrawide",
    brand: "Phantom",
    category: "accessories",
    price: 780_000, oldPrice: 920_000,
    image: pMonitor, images: [pMonitor],
    stock: 12, rating: 4.8, reviews: 56,
    badge: "-15%", newArrival: true,
    description: "34\" curved ultrawide QHD panel, 165Hz, 1ms response and HDR400. Immerse yourself in every frame.",
    specs: [
      { label: "Size", value: "34\" curved 1500R" },
      { label: "Resolution", value: "3440 x 1440" },
      { label: "Refresh", value: "165Hz" },
      { label: "Response", value: "1ms GtG" },
      { label: "HDR", value: "DisplayHDR 400" },
    ],
  },
  {
    id: "p4", slug: "phantom-mech-tkl-blue",
    name: "Phantom Mech TKL Blue Switch",
    brand: "Phantom",
    category: "accessories",
    price: 95_000,
    image: pKeyboard, images: [pKeyboard],
    stock: 30, rating: 4.6, reviews: 210,
    description: "Tenkeyless mechanical keyboard with hot-swap blue switches, double-shot PBT keycaps and per-key neon RGB.",
    specs: [
      { label: "Layout", value: "TKL 87 keys" },
      { label: "Switches", value: "Hot-swap blue (clicky)" },
      { label: "Keycaps", value: "Double-shot PBT" },
      { label: "Backlight", value: "Per-key RGB" },
    ],
  },
  {
    id: "p5", slug: "phantom-mouse-pro-19k",
    name: "Phantom Mouse Pro 19K",
    brand: "Phantom",
    category: "accessories",
    price: 65_000,
    image: pMouse, images: [pMouse],
    stock: 50, rating: 4.7, reviews: 180,
    badge: "BEST SELLER", bestSeller: true,
    description: "19,000 DPI optical sensor, 65g lightweight shell, 6 programmable buttons and 70hr battery life.",
    specs: [
      { label: "Sensor", value: "PAW 19K optical" },
      { label: "DPI", value: "100 – 19,000" },
      { label: "Weight", value: "65g" },
      { label: "Battery", value: "Up to 70 hours" },
    ],
  },
  {
    id: "p6", slug: "phantom-wave-7-1-headset",
    name: "Phantom Wave 7.1 Headset",
    brand: "Phantom",
    category: "accessories",
    price: 120_000,
    image: pHeadset, images: [pHeadset],
    stock: 18, rating: 4.5, reviews: 92,
    description: "Virtual 7.1 surround, 50mm drivers, memory-foam earcups and a detachable boom mic for clear comms.",
    specs: [
      { label: "Drivers", value: "50mm neodymium" },
      { label: "Audio", value: "Virtual 7.1" },
      { label: "Mic", value: "Detachable boom" },
      { label: "Connection", value: "USB & 3.5mm" },
    ],
  },
  {
    id: "p7", slug: "phantom-throne-pro-chair",
    name: "Phantom Throne Pro Chair",
    brand: "Phantom",
    category: "accessories",
    price: 340_000,
    image: pChair, images: [pChair],
    stock: 9, rating: 4.7, reviews: 41,
    badge: "NEW", newArrival: true,
    description: "Ergonomic racing-style chair with lumbar support, 4D armrests and a 180° recline.",
    specs: [
      { label: "Material", value: "Premium PU leather" },
      { label: "Armrests", value: "4D adjustable" },
      { label: "Recline", value: "90° – 180°" },
      { label: "Capacity", value: "Up to 150 kg" },
    ],
  },
  {
    id: "p8", slug: "playstation-5-slim",
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "consoles",
    price: 720_000,
    image: pConsole, images: [pConsole],
    stock: 6, rating: 4.9, reviews: 312,
    badge: "BEST SELLER", bestSeller: true,
    description: "The latest slim PS5 disc edition with DualSense controller. Plug, play, dominate.",
    specs: [
      { label: "Storage", value: "1TB SSD" },
      { label: "Disc", value: "Ultra HD Blu-ray" },
      { label: "Includes", value: "1x DualSense" },
      { label: "Region", value: "Worldwide" },
    ],
  },
  {
    id: "p9", slug: "phantom-pad-wireless-controller",
    name: "Phantom Pad Wireless Controller",
    brand: "Phantom",
    category: "consoles",
    price: 75_000,
    image: pController, images: [pController],
    stock: 25, rating: 4.4, reviews: 67,
    description: "Universal wireless controller for PC, Android and consoles with hall-effect sticks.",
    specs: [
      { label: "Connection", value: "2.4G + Bluetooth + USB-C" },
      { label: "Sticks", value: "Hall-effect anti-drift" },
      { label: "Battery", value: "20 hours" },
    ],
  },
  {
    id: "p10", slug: "phantom-stream-studio-mic",
    name: "Phantom Stream Studio Mic",
    brand: "Phantom",
    category: "accessories",
    price: 145_000,
    image: pStream, images: [pStream],
    stock: 14, rating: 4.6, reviews: 38,
    badge: "NEW", newArrival: true,
    description: "Cardioid USB condenser microphone with shock mount and RGB ring — perfect for streaming and podcasts.",
    specs: [
      { label: "Pattern", value: "Cardioid" },
      { label: "Sample rate", value: "192kHz / 24-bit" },
      { label: "Includes", value: "Boom arm + pop filter" },
    ],
  },
  {
    id: "p11", slug: "phantom-mobile-grip-pro",
    name: "Phantom Mobile Grip Pro",
    brand: "Phantom",
    category: "accessories",
    price: 38_000,
    image: pMobile, images: [pMobile],
    stock: 60, rating: 4.3, reviews: 124,
    description: "Telescopic Bluetooth controller grip for Android & iOS — turn your phone into a handheld console.",
    specs: [
      { label: "Compatibility", value: "Android / iOS" },
      { label: "Connection", value: "Bluetooth 5.0" },
      { label: "Battery", value: "12 hours" },
    ],
  },
  {
    id: "p12", slug: "rtx-4070-super-12gb",
    name: "RTX 4070 SUPER 12GB",
    brand: "NVIDIA",
    category: "components",
    price: 980_000,
    image: pGpu, images: [pGpu],
    stock: 4, rating: 4.9, reviews: 73,
    badge: "HOT", newArrival: true,
    description: "Triple-fan RTX 4070 SUPER graphics card with 12GB GDDR6X — ray-traced 1440p at high refresh.",
    specs: [
      { label: "Memory", value: "12GB GDDR6X" },
      { label: "Bus", value: "192-bit" },
      { label: "Power", value: "220W (1x 12VHPWR)" },
      { label: "Ports", value: "3x DP 1.4, 1x HDMI 2.1" },
    ],
  },
];

export const formatRWF = (amount: number) =>
  new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(amount) + " RWF";

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const bestSellers = () => products.filter((p) => p.bestSeller);
export const newArrivals = () => products.filter((p) => p.newArrival);
