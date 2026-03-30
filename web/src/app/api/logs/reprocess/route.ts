import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GameLog from '@/models/GameLog';
import { processGameLogData } from '@/lib/processGameLogData';

export async function POST() {
  try {
    await connectDB();

    const cursor = GameLog.find({}, { _id: 1, text: 1 }).lean().cursor();
    const bulkOps: any[] = [];

    let processed = 0;
    let updated = 0;

    for await (const doc of cursor) {
      processed += 1;

      const text = typeof (doc as any).text === 'string' ? (doc as any).text : '';
      const html = processGameLogData({ text }).html;

      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { html } },
        },
      });

      if (bulkOps.length >= 250) {
        const res = await GameLog.bulkWrite(bulkOps, { ordered: false });
        updated += res.modifiedCount ?? 0;
        bulkOps.length = 0;
      }
    }

    if (bulkOps.length > 0) {
      const res = await GameLog.bulkWrite(bulkOps, { ordered: false });
      updated += res.modifiedCount ?? 0;
    }

    return NextResponse.json({ success: true, processed, updated });
  } catch (error) {
    console.error('Error reprocessing logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reprocess logs' },
      { status: 500 }
    );
  }
}

