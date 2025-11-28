import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import ParsedItemVisibilityLog, {
  VisibilityActionType,
} from '@/models/ParsedItemVisibilityLog';
import { AuthUser } from '@/lib/auth';

interface VisibilityActionParams {
  hru: string;
  action: VisibilityActionType;
  adminUser: Pick<AuthUser, 'userId' | 'username'>;
}

type VisibilityLogEntry = {
  _id: unknown;
  hru: string;
  action: VisibilityActionType;
  performedBy: string;
  performedByUsername: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function applyVisibilityAction({
  hru,
  action,
  adminUser,
}: VisibilityActionParams) {
  await connectDB();

  const parsedItem = await ParsedItem.findOne({ hru });
  if (!parsedItem) {
    throw new Error(`Parsed item ${hru} not found`);
  }

  const hiddenState = action === 'hide';
  if (parsedItem.hidden === hiddenState) {
    // Still log to preserve action history
    await ParsedItemVisibilityLog.create({
      hru,
      action,
      performedBy: adminUser.userId,
      performedByUsername: adminUser.username,
    });
    return;
  }

  parsedItem.hidden = hiddenState;
  await parsedItem.save();

  await ParsedItemVisibilityLog.create({
    hru,
    action,
    performedBy: adminUser.userId,
    performedByUsername: adminUser.username,
  });
}

export async function reapplyVisibilityLog() {
  await connectDB();

  const logs = await ParsedItemVisibilityLog.find()
    .sort({ createdAt: 1 })
    .lean();

  const finalStates = new Map<string, boolean>();
  logs.forEach(log => {
    finalStates.set(log.hru, log.action === 'hide');
  });

  const operations = Array.from(finalStates.entries()).map(([hru, hidden]) =>
    ParsedItem.updateOne({ hru }, { hidden })
  );

  if (operations.length > 0) {
    await Promise.all(operations);
  }
}

export async function getVisibilityLog(hru: string) {
  await connectDB();
  return ParsedItemVisibilityLog.find({ hru })
    .sort({ createdAt: -1 })
    .lean<VisibilityLogEntry[]>();
}
