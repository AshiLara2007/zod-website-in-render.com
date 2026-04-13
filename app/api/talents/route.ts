import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseClient';

// In-memory storage for leads (ප්‍රොඩක්ෂන් එකේදී database table එකක් භාවිතා කරන්න)
// Leads will be stored in a separate table called 'leads'
// For now, using in-memory - but recommend creating a 'leads' table in Supabase

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  // If type is 'leads', return leads from leads table
  if (type === 'leads') {
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(leads);
  }

  // Otherwise return talents
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
    const contentType = req.headers.get('content-type') || '';

    // Handle lead tracking (JSON request)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { source, action } = body;

      if (!source || !action) {
        return NextResponse.json({ error: 'Missing source or action' }, { status: 400 });
      }

      const { data: newLead, error } = await supabaseAdmin
        .from('leads')
        .insert([{
          source,
          action,
          time: new Date().toLocaleTimeString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Lead insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(newLead);
    }

    // Handle talent form data (multipart/form-data)
    const formData = await req.formData();
    const id = formData.get('id') as string | null;
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
    
    if (picUrl) talentData.pic = picUrl;
    if (cvUrl) talentData.cv = cvUrl;

    if (id) {
      const { error } = await supabaseAdmin
        .from('talents')
        .update(talentData)
        .eq('id', id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ message: 'Updated successfully' });
    } else {
      talentData.ref = '#ZOD-' + Math.floor(1000 + Math.random() * 9000);
      talentData.created_at = new Date().toISOString();
      if (!talentData.pic) talentData.pic = 'https://placehold.co/150x150?text=User';
      if (!talentData.cv) talentData.cv = '#';
      const { error } = await supabaseAdmin.from('talents').insert([talentData]);
      if (error) throw new Error(error.message);
      return NextResponse.json({ message: 'Saved successfully' });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    // Clear all leads
    if (type === 'clear-leads') {
      const { error } = await supabaseAdmin
        .from('leads')
        .delete()
        .neq('id', 0); // Delete all rows

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ message: 'All leads cleared' });
    }

    // Delete single talent
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // First get the talent to delete files from storage
    const { data: talent, error: fetchError } = await supabaseAdmin
      .from('talents')
      .select('pic, cv')
      .eq('id', id)
      .single();

    if (!fetchError && talent) {
      // Delete photo from storage if exists and not default
      if (talent.pic && !talent.pic.includes('placehold.co')) {
        const photoPath = talent.pic.split('/').slice(-2).join('/');
        await supabaseAdmin.storage.from('zod_manpower').remove([photoPath]);
      }
      // Delete CV from storage if exists and not default
      if (talent.cv && !talent.cv.includes('#')) {
        const cvPath = talent.cv.split('/').slice(-2).join('/');
        await supabaseAdmin.storage.from('zod_manpower').remove([cvPath]);
      }
    }

    const { error } = await supabaseAdmin
      .from('talents')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
