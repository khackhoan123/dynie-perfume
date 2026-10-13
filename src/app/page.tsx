import { getPerfumeProducts } from '@/lib/sheets';
import HomeClient from '@/components/home/HomeClient';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const { products } = await getPerfumeProducts();

  return <HomeClient products={products} />;
}
