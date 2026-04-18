import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const { data: talent, error } = await supabaseAdmin
    .from('talents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(talent);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const dob = formData.get('dob') as string;
    const age = parseInt(formData.get('age') as string);
    const gender = formData.get('gender') as string;
    const job = formData.get('job') as string;
    const country = formData.get('country') as string;
    const religion = formData.get('religion') as string;
    const salary = parseInt(formData.get('salary') as string);
    const experience = formData.get('experience') as string;
    const maritalStatus = formData.get('maritalStatus') as string;
    const workerType = formData.get('workerType') as string;
    const picFile = formData.get('tPic') as File | null;
    const cvFile = formData.get('tCv') as File | null;

    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
      if (!file || file.size === 0) return null;
      
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${folder}/${Date.now()}-${safeName}`;

      const { error } = await supabaseAdmin.storage
        .from('zod_manpower')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) {
        console.error('Upload error:', error.message);
        return null;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from('zod_manpower')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    };

    // First get existing talent to get old file URLs
    const { data: existingTalent } = await supabaseAdmin
      .from('talents')
      .select('pic, cv')
      .eq('id', id)
      .single();

    let picUrl = existingTalent?.pic;
    let cvUrl = existingTalent?.cv;

    // Upload new files if provided
    if (picFile && picFile.size > 0) {
      picUrl = await uploadFile(picFile, 'photos');
    }
    if (cvFile && cvFile.size > 0) {
      cvUrl = await uploadFile(cvFile, 'cvs');
    }

    // Build update data
    const updateData: Record<string, any> = {
      name,
      dob,
      age,
      gender,
      job,
      country,
      religion,
      salary,
      experience: experience || '',
      maritalStatus: maritalStatus || 'Single',
      workerType: workerType || 'Recruitment Workers',
      updated_at: new Date().toISOString(),
    };

    if (picUrl) updateData.pic = picUrl;
    if (cvUrl) updateData.cv = cvUrl;

    const { error: updateError } = await supabaseAdmin
      .from('talents')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
