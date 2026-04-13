import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    // First get the talent to delete files from storage
    const { data: talent, error: fetchError } = await supabaseAdmin
      .from('talents')
      .select('pic, cv')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (talent) {
      const filesToDelete = [];
      
      // Delete photo from storage if exists and not default
      if (talent.pic && !talent.pic.includes('placehold.co')) {
        // Extract path from URL
        let picPath = '';
        if (talent.pic.includes('/storage/v1/object/public/zod_manpower/')) {
          picPath = talent.pic.split('/storage/v1/object/public/zod_manpower/')[1];
        } else if (talent.pic.includes('/object/public/zod_manpower/')) {
          picPath = talent.pic.split('/object/public/zod_manpower/')[1];
        } else {
          // Try to extract from URL pattern
          const match = talent.pic.match(/zod_manpower\/(.+)$/);
          if (match) picPath = match[1];
        }
        
        if (picPath) {
          filesToDelete.push(picPath);
          console.log('Deleting photo:', picPath);
        }
      }
      
      // Delete CV from storage if exists and not default
      if (talent.cv && !talent.cv.includes('#')) {
        // Extract path from URL
        let cvPath = '';
        if (talent.cv.includes('/storage/v1/object/public/zod_manpower/')) {
          cvPath = talent.cv.split('/storage/v1/object/public/zod_manpower/')[1];
        } else if (talent.cv.includes('/object/public/zod_manpower/')) {
          cvPath = talent.cv.split('/object/public/zod_manpower/')[1];
        } else {
          // Try to extract from URL pattern
          const match = talent.cv.match(/zod_manpower\/(.+)$/);
          if (match) cvPath = match[1];
        }
        
        if (cvPath) {
          filesToDelete.push(cvPath);
          console.log('Deleting CV:', cvPath);
        }
      }
      
      // Delete files from storage
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('zod_manpower')
          .remove(filesToDelete);
        
        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // Continue with database deletion even if storage deletion fails
        } else {
          console.log(`Successfully deleted ${filesToDelete.length} file(s) from storage`);
        }
      }
    }

    // Delete the talent record from database
    const { error: deleteError } = await supabaseAdmin
      .from('talents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Deleted successfully',
      id: id 
    });
    
  } catch (error: any) {
    console.error('Unexpected error in DELETE:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Optional: Add GET method to fetch a single talent by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const { data: talent, error } = await supabaseAdmin
      .from('talents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!talent) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
    }

    return NextResponse.json(talent);
    
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Optional: Add PUT method to update a single talent
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const age = parseInt(formData.get('age') as string);
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const job = formData.get('job') as string;
    const country = formData.get('country') as string;
    const religion = formData.get('religion') as string;
    const salary = parseInt(formData.get('salary') as string);
    const experience = formData.get('experience') as string;
    const maritalStatus = formData.get('maritalStatus') as string;
    const picFile = formData.get('tPic') as File | null;
    const cvFile = formData.get('tCv') as File | null;

    if (!name || isNaN(age) || !gender || !job || !country || !religion || isNaN(salary)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
      const fileName = `${folder}/${Date.now()}-${file.name}`;
      const { data, error } = await supabaseAdmin.storage
        .from('zod_manpower')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) {
        console.error('Upload error:', error);
        return null;
      }
      const { data: urlData } = supabaseAdmin.storage
        .from('zod_manpower')
        .getPublicUrl(fileName);
      return urlData.publicUrl;
    };

    let picUrl: string | null = null;
    let cvUrl: string | null = null;

    if (picFile && picFile.size > 0) picUrl = await uploadFile(picFile, 'photos');
    if (cvFile && cvFile.size > 0) cvUrl = await uploadFile(cvFile, 'cvs');

    // First get existing talent to delete old files if new ones are uploaded
    const { data: existingTalent } = await supabaseAdmin
      .from('talents')
      .select('pic, cv')
      .eq('id', id)
      .single();

    const talentData: any = { 
      name, 
      age, 
      dob: dob || null,
      gender, 
      job, 
      country, 
      religion, 
      salary,
      experience: experience || null,
      maritalStatus: maritalStatus || null,
      updated_at: new Date().toISOString()
    };
    
    if (picUrl) {
      talentData.pic = picUrl;
      // Delete old photo if exists
      if (existingTalent?.pic && !existingTalent.pic.includes('placehold.co')) {
        let oldPicPath = '';
        if (existingTalent.pic.includes('/storage/v1/object/public/zod_manpower/')) {
          oldPicPath = existingTalent.pic.split('/storage/v1/object/public/zod_manpower/')[1];
        } else {
          const match = existingTalent.pic.match(/zod_manpower\/(.+)$/);
          if (match) oldPicPath = match[1];
        }
        if (oldPicPath) {
          await supabaseAdmin.storage.from('zod_manpower').remove([oldPicPath]);
        }
      }
    }
    
    if (cvUrl) {
      talentData.cv = cvUrl;
      // Delete old CV if exists
      if (existingTalent?.cv && !existingTalent.cv.includes('#')) {
        let oldCvPath = '';
        if (existingTalent.cv.includes('/storage/v1/object/public/zod_manpower/')) {
          oldCvPath = existingTalent.cv.split('/storage/v1/object/public/zod_manpower/')[1];
        } else {
          const match = existingTalent.cv.match(/zod_manpower\/(.+)$/);
          if (match) oldCvPath = match[1];
        }
        if (oldCvPath) {
          await supabaseAdmin.storage.from('zod_manpower').remove([oldCvPath]);
        }
      }
    }

    const { error } = await supabaseAdmin
      .from('talents')
      .update(talentData)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Updated successfully' });
    
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
