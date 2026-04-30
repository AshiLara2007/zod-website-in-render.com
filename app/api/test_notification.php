<?php
// test_notification.php
// Use this file to test if your push notifications are working

header('Content-Type: application/json');

echo "========================================\n";
echo "     PUSH NOTIFICATION TESTER\n";
echo "========================================\n\n";

// Configuration
$API_URL = "https://zodmanpower.info/api/send_notification.php";

// Test 1: Simple Test
echo "📤 Sending test notification...\n\n";

$testData = [
    'title' => '🧪 Test Notification',
    'body' => 'Your push notification system is working correctly! ✅'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $API_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($testData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Status Code: " . $httpCode . "\n";

if ($error) {
    echo "CURL Error: " . $error . "\n";
} else {
    echo "Response: " . $response . "\n\n";
}

if ($httpCode == 200) {
    $result = json_decode($response, true);
    if ($result && isset($result['success']) && $result['success'] === true) {
        echo "✅ NOTIFICATION SENT SUCCESSFULLY!\n";
        echo "📱 Check your Android device - you should receive a notification!\n";
    } else {
        echo "⚠️ Notification may have failed. Check error message above.\n";
    }
} else {
    echo "❌ Failed to send notification. Check your API endpoint.\n";
}

echo "\n========================================\n";
echo "Test 2: Candidate Added Notification\n";
echo "========================================\n\n";

// Test 2: Simulate New Candidate
$candidateData = [
    'title' => '✨ New Candidate Available! ✨',
    'body' => 'John Doe (Driver) from INDIA is now available for hiring!',
    'candidate_name' => 'John Doe',
    'candidate_id' => '12345'
];

echo "📤 Sending candidate notification...\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $API_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($candidateData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: " . $httpCode . "\n";
echo "Response: " . $response . "\n\n";

if ($httpCode == 200) {
    echo "✅ CANDIDATE NOTIFICATION SENT!\n";
} else {
    echo "❌ Failed to send candidate notification.\n";
}

echo "\n========================================\n";
echo "If no notification received, check:\n";
echo "1. App is installed and running\n";
echo "2. App has internet connection\n";
echo "3. Notification permission is granted\n";
echo "4. Device is subscribed to 'all' topic\n";
echo "========================================\n";
?>
