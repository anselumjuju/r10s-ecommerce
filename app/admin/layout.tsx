import { AppSidebar } from '@/app/admin/ui/layout/sidebar';
import { SiteHeader } from '@/app/admin/ui/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='[--header-height:calc(theme(spacing.14))]'>
      <SidebarProvider className='flex flex-col'>
        <SiteHeader />
        <div className='flex flex-1'>
          <AppSidebar />
          <SidebarInset className='!min-h-[calc(100svh-var(--header-height))]'>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
