import { NextRequest, NextResponse } from 'next/server';

// Your Firebase Service Account JSON (keep this secure)
// For production, use environment variables
const FIREBASE_PROJECT_ID = 'zod-manpower';
const FIREBASE_CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@zod-manpower.iam.gserviceaccount.com';
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

async function getAccessToken() {
  const jwtHeader = Buffer.from(
    JSON.stringify({ alg: 'RS256', typ: 'JWT' })
  ).toString('base64');

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = Buffer.from(
    JSON.stringify({
      iss: FIREBASE_CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${jwtHeader}.${jwtPayload}`);
  const signature = sign.sign(FIREBASE_PRIVATE_KEY, 'base64');

  const jwt = `${jwtHeader}.${jwtPayload}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: messageBody, candidate_name, candidate_id } = body;

    const accessToken = await getAccessToken();

    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`;

    const notification = {
      message: {
        topic: 'all',
        notification: {
          title: title || '✨ New Candidate Available! ✨',
          body: messageBody || 'A new candidate has been added!',
        },
        android: {
          notification: {
            icon: 'ic_notification',
            color: '#2196F3',
            priority: 'high',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
        data: candidate_id ? {
          candidate_id: String(candidate_id),
          candidate_name: candidate_name || '',
        } : undefined,
      },
    };

    const response = await fetch(fcmUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({ success: false, error: result }, { status: response.status });
    }
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
