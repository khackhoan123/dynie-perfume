import { getPerfumeProducts } from '@/lib/sheets';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const { products } = await getPerfumeProducts();

  return <HomeClient products={products} />;
}
