import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'talents.json');

export async function POST() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const talents = JSON.parse(data);
    const updatedTalents = talents.map(t => ({ ...t, cv: '' }));
    await fs.writeFile(dataFilePath, JSON.stringify(updatedTalents, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear CVs' }, { status: 500 });
  }
}
