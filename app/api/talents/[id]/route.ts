import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';  // changed

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const { data: talent, error: fetchError } = await supabaseAdmin
    .from('talents')
    .select('pic, cv')
    .eq('id', id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (talent) {
    const filesToDelete = [];
    if (talent.pic && !talent.pic.includes('placehold.co')) {
      const picPath = talent.pic.split('/storage/v1/object/public/zod_manpower/')[1];
      if (picPath) filesToDelete.push(picPath);
    }
    if (talent.cv && !talent.cv.includes('#')) {
      const cvPath = talent.cv.split('/storage/v1/object/public/zod_manpower/')[1];
      if (cvPath) filesToDelete.push(cvPath);
    }
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('zod_manpower')
        .remove(filesToDelete);
      if (storageError) console.error('Storage deletion error:', storageError);
    }
  }

  const { error: deleteError } = await supabaseAdmin
    .from('talents')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Deleted successfully' });
}