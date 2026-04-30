<?php
// send_notification.php
// Firebase Cloud Messaging HTTP V1 API
// Location: https://zodmanpower.info/api/send_notification.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// =====================================================
// YOUR CONFIGURATION (Already filled from your JSON)
// =====================================================

$PROJECT_ID = "zod-manpower";  // Your project ID
$SERVICE_ACCOUNT_FILE = __DIR__ . '/firebase-service-account.json';

// =====================================================
// DO NOT EDIT BELOW THIS LINE
// =====================================================

function getAccessToken() {
    global $SERVICE_ACCOUNT_FILE;
    
    if (!file_exists($SERVICE_ACCOUNT_FILE)) {
        return ['error' => 'Service account file not found: ' . $SERVICE_ACCOUNT_FILE];
    }
    
    $serviceAccount = json_decode(file_get_contents($SERVICE_ACCOUNT_FILE), true);
    
    if (!$serviceAccount) {
        return ['error' => 'Invalid service account JSON'];
    }
    
    $jwtHeader = base64_encode(json_encode([
        'alg' => 'RS256',
        'typ' => 'JWT'
    ]));
    
    $now = time();
    $jwtPayload = base64_encode(json_encode([
        'iss' => $serviceAccount['client_email'],
        'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
        'aud' => 'https://oauth2.googleapis.com/token',
        'exp' => $now + 3600,
        'iat' => $now
    ]));
    
    $privateKey = $serviceAccount['private_key'];
    $signature = '';
    openssl_sign($jwtHeader . '.' . $jwtPayload, $signature, $privateKey, OPENSSL_ALGO_SHA256);
    $jwtSignature = base64_encode($signature);
    
    $jwt = $jwtHeader . '.' . $jwtPayload . '.' . $jwtSignature;
    
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $jwt
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return ['error' => 'Failed to get access token: ' . $response];
    }
    
    $data = json_decode($response, true);
    return $data['access_token'] ?? ['error' => 'No access token in response'];
}

function sendNotification($title, $body, $projectId, $candidateName = null, $candidateId = null) {
    $accessTokenResult = getAccessToken();
    
    if (isset($accessTokenResult['error'])) {
        return ['success' => false, 'error' => $accessTokenResult['error']];
    }
    
    $accessToken = $accessTokenResult;
    
    $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";
    
    $message = [
        'message' => [
            'topic' => 'all',
            'notification' => [
                'title' => $title,
                'body' => $body
            ],
            'android' => [
                'notification' => [
                    'icon' => 'ic_notification',
                    'color' => '#2196F3',
                    'priority' => 'high',
                    'sound' => 'default'
                ]
            ],
            'apns' => [
                'payload' => [
                    'aps' => [
                        'sound' => 'default'
                    ]
                ]
            ]
        ]
    ];
    
    // Add candidate data if provided
    if ($candidateId || $candidateName) {
        $message['message']['data'] = [];
        if ($candidateId) $message['message']['data']['candidate_id'] = (string)$candidateId;
        if ($candidateName) $message['message']['data']['candidate_name'] = $candidateName;
    }
    
    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'success' => ($httpCode === 200),
        'response' => json_decode($response, true),
        'http_code' => $httpCode
    ];
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = isset($_POST['title']) ? $_POST['title'] : '✨ New Candidate Available! ✨';
    $body = isset($_POST['body']) ? $_POST['body'] : 'A new candidate has been added to ZOD MANPOWER';
    $candidateName = isset($_POST['candidate_name']) ? $_POST['candidate_name'] : null;
    $candidateId = isset($_POST['candidate_id']) ? $_POST['candidate_id'] : null;
    
    $result = sendNotification($title, $body, $PROJECT_ID, $candidateName, $candidateId);
    
    echo json_encode($result);
} else {
    echo json_encode(['error' => 'Please use POST method', 'success' => false]);
}
?>
