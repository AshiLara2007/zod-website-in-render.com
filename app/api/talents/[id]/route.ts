import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // First fetch the talent to get file URLs
  const { data: talent, error: fetchError } = await supabaseAdmin
    .from('talents')
    .select('pic, cv')
    .eq('id', id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // Delete files from Supabase Storage
  if (talent) {
    const filesToDelete: string[] = [];

    const extractPath = (url: string): string | null => {
      if (!url) return null;
      if (url.includes('placehold.co')) return null;
      if (url === '#') return null;

      // Try to extract path after bucket name
      const match = url.match(/\/storage\/v1\/object\/public\/zod_manpower\/(.+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);

      return null;
    };

    const picPath = extractPath(talent.pic);
    const cvPath = extractPath(talent.cv);

    if (picPath) filesToDelete.push(picPath);
    if (cvPath) filesToDelete.push(cvPath);

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('zod_manpower')
        .remove(filesToDelete);

      if (storageError) {
        console.error('Storage deletion error:', storageError.message);
        // Continue with DB delete even if storage fails
      }
    }
  }

  // Delete from database
  const { error: deleteError } = await supabaseAdmin
    .from('talents')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Deleted successfully' });
}
