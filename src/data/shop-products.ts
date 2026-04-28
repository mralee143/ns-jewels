export type ShopProduct = {
  readonly imageSrc: string;
  readonly price: string;
  readonly title: string;
};

export const SHOP_PRODUCTS: readonly ShopProduct[] = [
  {
    imageSrc: "/rings/ring-1.jpeg",
    price: "Rs. 599.00 PKR",
    title: "Emerald Grace Ring",
  },
  {
    imageSrc: "/bracelets/bracelet-1.jpeg",
    price: "Rs. 599.00 PKR",
    title: "Mesh Watch Bracelet",
  },
  {
    imageSrc: "/handchain/handchain-1.jpeg",
    price: "Rs. 350.00 PKR",
    title: "HeartLock Ring",
  },
  {
    imageSrc: "/handcuffs/handcuffs-1.jpeg",
    price: "Rs. 650.00 PKR",
    title: "Heart Drop Necklace",
  },
  {
    imageSrc: "/necklace/necklace-1.jpeg",
    price: "Rs. 699.00 PKR",
    title: "Luna Crystal Pendant",
  },
  {
    imageSrc: "/necklace/necklace-2.jpeg",
    price: "Rs. 780.00 PKR",
    title: "Aurora Set",
  },
  {
    imageSrc: "/rings/ring-2.jpeg",
    price: "Rs. 490.00 PKR",
    title: "Vintage Ring Stack",
  },
  {
    imageSrc: "/necklace/necklace-3.jpeg",
    price: "Rs. 610.00 PKR",
    title: "Pendant Glow",
  },
  {
    imageSrc: "/bracelets/bracelet-2.jpeg",
    price: "Rs. 520.00 PKR",
    title: "Classic Bracelet",
  },
  {
    imageSrc: "/handcuffs/handcuffs-2.jpeg",
    price: "Rs. 540.00 PKR",
    title: "Velvet Handcuff Charm",
  },
  {
    imageSrc: "/necklace/necklace-4.jpeg",
    price: "Rs. 720.00 PKR",
    title: "Crystal Duo Set",
  },
  {
    imageSrc: "/necklace/necklace-5.jpeg",
    price: "Rs. 590.00 PKR",
    title: "Twilight Pendant",
  },
] as const;
