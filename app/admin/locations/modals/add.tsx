'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useTransition } from 'react';
import { addLocation } from '@/lib/serverActions';
import { uploadImage } from '@/lib/uploadImage';

const locationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Image is required',
  }),
});

interface LocationFormData {
  name: string;
  image: File;
}

const AddLocationModal = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  const onSubmit = async (data: LocationFormData) => {
    startTransition(async () => {
      const imageUrl = await uploadImage(data.image);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', imageUrl);
      await addLocation(formData);
      reset();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={'outline'}>
          <Plus className='mr-1 h-4 w-4' />
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' type='text' {...register('name')} placeholder='Location Name' />
            {errors.name && <p className='text-red-500 text-sm'>{String(errors.name.message)}</p>}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='image'>Image</Label>
            <Input
              id='image'
              className='p-0 pe-3 file:me-3 file:border-0 file:border-e file:border-muted h-full file:py-2 text-primary'
              type='file'
              accept='image/*'
              onChange={(e) => setValue('image', e.target.files?.[0] as File)}
            />
            {errors.image && <p className='text-red-500 text-sm'>{String(errors.image.message)}</p>}
          </div>
          <DialogFooter>
            <Button type='submit'>{isPending ? 'Submitting...' : 'Submit'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationModal;
