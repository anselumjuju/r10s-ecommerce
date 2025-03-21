import Link from 'next/link';

const Footer = () => {
  return (
    <div className='w-full h-full max-w-screen-2xl mx-auto px-3 md:px-5 py-16 flex flex-wrap items-start justify-between gap-12 bg-neutral-900 text-white'>
      {/* Logo and name */}
      <div className='flex flex-col items-start justify-center gap-4'>
        <div className='flex items-end justify-start cursor-pointer'>
          <p className='text-4xl font-bold text-[#ea580c] leading-[0.8]'>N</p>
          <div className='flex flex-col gap-0 *:leading-none text-sm'>
            <p>ative</p>
            <p>ellai</p>
          </div>
        </div>
        <p className='w-[40ch] text-sm text-muted-foreground'>
          Discover authentic traditional and local products from Nellai, a region rich in history, culture and natural resources, and experience the best of South India.
        </p>
      </div>
      {/* NavLinks */}
      <div className='flex flex-col items-start justify-start gap-3'>
        <h1>Quick Links</h1>
        <nav className='flex flex-col items-start justify-start gap-1'>
          {[
            { link: '/', name: 'Home' },
            { link: '/products', name: 'Products' },
            { link: '/categories', name: 'Categories' },
            { link: '/locations', name: 'Locations' },
          ].map((item, index) => (
            <button key={index} className='text-sm text-muted-foreground'>
              <Link href={item.link}>{item.name}</Link>
            </button>
          ))}
        </nav>
      </div>
      {/* Copyright */}
      <p className='text-sm text-muted-foreground text-right lg:text-left'>&copy; 2025 Native Nellai | All rights reserved</p>
    </div>
  );
};

export default Footer;
