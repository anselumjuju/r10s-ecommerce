import { handleRequest } from '@/lib/serverActions';
import ProductCard from '../features/ProductCard';

const Featured = async () => {
  const { data: products, success: productSuccess } = await handleRequest({ endpoint: 'products' });

  if (!productSuccess) return null;
  return (
    <div className='w-full flex flex-col items-center justify-center gap-12'>
      <h1 className='text-3xl font-medium relative after:content-[""] after:h-0.5 after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:bg-orange-400 after:block after:mx-auto'>
        Featured Products
      </h1>
      <div className='w-full h-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8'>
        {[...products, ...products].map(
          (product: { _id: string; name: string; caption: string; mainImage: string; slug: string; originalPrice: number; discountPrice: number }, i: number) => (
            <div key={product.slug + i}>
              <ProductCard product={product} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Featured;
