'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useImageUpload } from '@/hooks/use-image-upload';
import { handleRequest } from '@/lib/serverActions';
import { uploadImage } from '@/lib/uploadImage';
import useAuthStore from '@/store/authStore';
import useUserStore from '@/store/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, UserRound } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const UserDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(10, 'Phone number must be at most 10 digits'),
  street: z.string().min(2, 'Street must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(2, 'Zip Code must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  profilePic: z.string().optional(),
});

interface IUserDetails {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profilePic: string | File;
}

const EditProfile = () => {
  const { previewUrl, fileInputRef, handleThumbnailClick: handleButtonClick, handleFileChange, setPreviewUrl } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const { uid } = useAuthStore();
  const { _id, name, email, phone, address, profilePic, setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IUserDetails>({
    resolver: zodResolver(UserDetailsSchema),
  });

  useEffect(() => {
    setIsInitializing(true);
    setValue('name', name);
    setValue('email', email);
    setValue('phone', phone);
    setValue('street', address?.street || '');
    setValue('city', address?.city || '');
    setValue('state', address?.state || '');
    setValue('zipCode', address?.zipCode || '');
    setValue('country', address?.country || '');
    setPreviewUrl(profilePic !== '' ? profilePic : null);
    setIsInitializing(false);
  }, []);

  const onSubmit = async (data: IUserDetails) => {
    setIsSubmitting(true);
    const name = data.name;
    const email = data.email;
    const phone = data.phone;
    const uploadedProfilePic = (await uploadImage(fileInputRef.current?.files?.[0])) || (previewUrl == null ? 'https://placehold.co/400/png' : profilePic);
    const address = {
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
    };
    toast.promise(
      async () => {
        const formData = new FormData();
        formData.append('uid', `${uid}`);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('profilePic', uploadedProfilePic);
        formData.append('address', JSON.stringify(address));
        await handleRequest({ endpoint: 'users', method: 'PATCH', id: _id, data: formData });
        setUser({ name, email, phone, profilePic: uploadedProfilePic, address });
        setIsSubmitting(false);
      },
      {
        loading: 'Updating user details...',
        success: 'User details updated successfully',
        error: 'Error updating user details',
      }
    );
  };

  return (
    <div className='w-full max-w-screen-xl mx-auto px-4'>
      {isInitializing ? (
        <div className='size-full flex items-center justify-center'>
          <h1>Fetching user details</h1>
        </div>
      ) : (
        <>
          <div className='flex flex-col items-start gap-y-4'>
            {/* Profile Image */}
            <div className='flex items-center gap-4 align-top'>
              <div className='relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full'>
                {previewUrl ? (
                  <Image className='size-full object-cover' src={previewUrl} alt='profile' width={48} height={48} priority unoptimized />
                ) : (
                  <div aria-hidden='true' className='size-full'>
                    <UserRound className='w-full size-full' strokeWidth={1} stroke='#9CA3AF' />
                  </div>
                )}
              </div>
              <div>
                <Button onClick={handleButtonClick} aria-haspopup='dialog' variant={'outline'} size={'lg'} className=''>
                  <Pencil className='mr-2 size-4' />
                  Upload new picture
                </Button>
                <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' accept='image/*' />
              </div>
              <Button disabled={isSubmitting} variant={'secondary'} size={'lg'} onClick={() => setPreviewUrl(null)}>
                Delete
              </Button>
            </div>

            {/* Profile Details */}
            <form onSubmit={handleSubmit(onSubmit)} className='w-full h-full flex flex-1 flex-col gap-4 relative'>
              <p className='text-lg font-semibold my-3'>User Details</p>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>Name</Label>
                <div className='w-full space-y-1'>
                  <Input type='text' placeholder='Name' {...register('name')} />
                  {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>Email</Label>
                <div className='w-full space-y-1'>
                  <Input type='email' placeholder='Name' {...register('email')} />
                  {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>Phone</Label>
                <div className='w-full space-y-1'>
                  <Input type='tel' placeholder='Phone' {...register('phone')} />
                  {errors.phone && <span className='text-red-500 text-sm'>{errors.phone.message}</span>}
                </div>
              </div>
              <p className='text-lg font-semibold my-3'>Address</p>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>Street</Label>
                <div className='w-full space-y-1'>
                  <Input type='text' placeholder='Street' {...register('street')} />
                  {errors.street && <span className='text-red-500 text-sm'>{errors.street.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>City</Label>
                <div className='w-full space-y-1'>
                  <Input type='text' placeholder='City' {...register('city')} />
                  {errors.city && <span className='text-red-500 text-sm'>{errors.city.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>State</Label>
                <div className='w-full space-y-1'>
                  <Input type='text' placeholder='State' {...register('state')} />
                  {errors.state && <span className='text-red-500 text-sm'>{errors.state.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>ZipCode</Label>
                <div className='w-full space-y-1'>
                  <Input type='text' placeholder='ZipCode' {...register('zipCode')} />
                  {errors.zipCode && <span className='text-red-500 text-sm'>{errors.zipCode.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm flex flex-col items-start lg:items-center lg:flex-row gap-2 lg:gap-6'>
                <Label className='min-w-[10ch] font-normal'>Country</Label>
                <div className='w-full space-y-1'>
                  <Input type='text' placeholder='Country' {...register('country')} />
                  {errors.country && <span className='text-red-500 text-sm'>{errors.country.message}</span>}
                </div>
              </div>
              <div className='w-full lg:max-w-screen-sm mt-6 flex justify-end'>
                <Button variant={'default'} size={'lg'} type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default EditProfile;
