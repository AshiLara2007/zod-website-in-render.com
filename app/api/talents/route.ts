import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function GET() {
  const { data: talents, error } = await supabaseAdmin
    .from('talents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(talents);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id              = formData.get('id')           as string | null;
    const name            = formData.get('name')         as string;
    const dob             = formData.get('dob')          as string;
    const age             = parseInt(formData.get('age') as string);
    const gender          = formData.get('gender')       as string;
    const job             = formData.get('job')          as string;
    const country         = formData.get('country')      as string;
    const religion        = formData.get('religion')     as string;
    const salary          = parseInt(formData.get('salary') as string);
    const experience      = formData.get('experience')   as string;
    const maritalStatus   = formData.get('maritalStatus') as string;
    const workerType      = formData.get('workerType')   as string;
    const picFile         = formData.get('tPic')         as File | null;
    const cvFile          = formData.get('tCv')          as File | null;

    // Validate required fields
    if (!name || isNaN(age) || !gender || !job || !country || !religion || isNaN(salary)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    let picUrl: string | null = null;
    let cvUrl: string | null  = null;

    if (picFile && picFile.size > 0) picUrl = await uploadFile(picFile, 'photos');
    if (cvFile && cvFile.size > 0) cvUrl = await uploadFile(cvFile, 'cvs');

    const talentData: Record<string, any> = {
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
      created_at: new Date().toISOString(),
    };

    if (picUrl) talentData.pic = picUrl;
    if (cvUrl)  talentData.cv  = cvUrl;

    if (id) {
      // UPDATE existing record
      delete talentData.created_at;
      talentData.updated_at = new Date().toISOString();
      
      const { error } = await supabaseAdmin
        .from('talents')
        .update(talentData)
        .eq('id', id);

      if (error) throw new Error(error.message);
      return NextResponse.json({ message: 'Updated successfully' });

    } else {
      // INSERT new record
      talentData.ref = '#ZOD-' + Math.floor(1000 + Math.random() * 9000);
      
      if (!talentData.pic) talentData.pic = 'https://placehold.co/150x150?text=User';
      if (!talentData.cv)  talentData.cv  = '#';

      const { error } = await supabaseAdmin.from('talents').insert([talentData]);
      if (error) throw new Error(error.message);
      return NextResponse.json({ message: 'Saved successfully' });
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
