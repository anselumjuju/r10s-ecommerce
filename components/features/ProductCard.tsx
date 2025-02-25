import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    caption: string;
    mainImage: string;
    slug: string;
    originalPrice: number;
    discountPrice: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.slug}`} className='w-full max-w-64 h-full mx-auto flex flex-col items-start justify-between gap-0.5 rounded-lg overflow-hidden'>
      <div className='h-64 aspect-square rounded-lg overflow-hidden'>
        <Image src={product.mainImage} alt={product.name} width={400} height={400} className='size-full object-cover rounded-lg hover:scale-110 duration-500 bg-neutral-200' />
      </div>
      <div className='space-y-1'>
        <p className='text-base text-primary'>{product.name}</p>
        <p className='py-1 text-xs text-muted-foreground line-clamp-1'>{product.caption}</p>
      </div>
      <div className='py-2 flex items-center justify-between w-full'>
        <p>&#8377; {product.originalPrice}</p>
        <button className='px-5 py-1.5 bg-orange-400 text-white rounded-lg text-sm'>Buy Now</button>
      </div>
    </Link>
  );
};

export default ProductCard;
