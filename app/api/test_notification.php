<?php
// test_notification.php - Test if notification is working

include 'send_notification.php';

$result = sendFirebaseNotification(
    "Test Notification 🧪",
    "This is a test message from ZOD MANPOWER website. Notification system is working!"
);

echo "<pre>";
print_r($result);
echo "</pre>";

if ($result['success']) {
    echo "<h2 style='color:green'>✅ Notification sent successfully!</h2>";
} else {
    echo "<h2 style='color:red'>❌ Notification failed! Check your Server Key.</h2>";
}
?>
