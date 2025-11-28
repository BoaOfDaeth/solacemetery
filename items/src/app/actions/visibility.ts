'use server';

import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/auth-server';
import { applyVisibilityAction } from '@/services/visibilityService';

async function mutateVisibility(hru: string, action: 'hide' | 'restore') {
  const user = await getServerUser();

  if (!user || !user.isAdmin) {
    throw new Error('Unauthorized');
  }

  await applyVisibilityAction({
    hru,
    action,
    adminUser: {
      userId: user.userId,
      username: user.username,
    },
  });

  revalidatePath('/');
  revalidatePath('/items');
  revalidatePath(`/item/${hru}`);
  revalidatePath('/compare');
}

export async function hideParsedItem(hru: string) {
  await mutateVisibility(hru, 'hide');
}

export async function restoreParsedItem(hru: string) {
  await mutateVisibility(hru, 'restore');
}
