<?php
// send_notification.php
// Location: /api/send_notification.php or /send_notification.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Firebase Server Key (Get from Firebase Console)
$FIREBASE_SERVER_KEY = "AAAA...YOUR_SERVER_KEY...";

/**
 * Send notification to all subscribed devices
 */
function sendFirebaseNotification($title, $body, $candidateId = null, $imageUrl = null) {
    global $FIREBASE_SERVER_KEY;
    
    $url = "https://fcm.googleapis.com/fcm/send";
    
    $notification = array(
        'title' => $title,
        'body' => $body,
        'sound' => 'default',
        'icon' => 'ic_notification'
    );
    
    $data = array(
        'title' => $title,
        'body' => $body,
        'candidate_id' => $candidateId,
        'click_action' => 'FLUTTER_NOTIFICATION_CLICK'
    );
    
    if ($imageUrl) {
        $notification['image'] = $imageUrl;
    }
    
    $fields = array(
        'to' => '/topics/all',  // Send to all subscribers
        'notification' => $notification,
        'data' => $data,
        'priority' => 'high'
    );
    
    $headers = array(
        'Authorization: key=' . $FIREBASE_SERVER_KEY,
        'Content-Type: application/json'
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return array(
        'success' => $httpCode == 200,
        'response' => json_decode($result, true),
        'http_code' => $httpCode
    );
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from POST request
    $title = isset($_POST['title']) ? $_POST['title'] : 'New Candidate Available! 🎉';
    $body = isset($_POST['body']) ? $_POST['body'] : 'A new candidate has been added to ZOD MANPOWER';
    $candidateId = isset($_POST['candidate_id']) ? $_POST['candidate_id'] : null;
    $imageUrl = isset($_POST['image_url']) ? $_POST['image_url'] : null;
    
    $result = sendFirebaseNotification($title, $body, $candidateId, $imageUrl);
    
    echo json_encode($result);
} else {
    echo json_encode(['error' => 'Only POST method allowed']);
}
?>
