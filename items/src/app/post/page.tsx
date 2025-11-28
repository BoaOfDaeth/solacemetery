import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import PostItemForm from '@/components/PostItemForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Add Item - Solabase',
  description: 'Submit a new item to the Solabase database',
};

export default async function PostPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/api/auth/discord');
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <PostItemForm />
        </div>
      </div>
    </div>
  );
}
