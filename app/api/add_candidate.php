<?php
// add_candidate.php - Your existing candidate addition script with notification

include 'db_connection.php'; // Your database connection
include 'send_notification.php'; // Include the notification function

// Your existing code to add candidate to database
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get candidate data from form
    $name = $_POST['name'];
    $job = $_POST['job'];
    $country = $_POST['country'];
    $gender = $_POST['gender'];
    $age = $_POST['age'];
    $salary = $_POST['salary'];
    // ... other fields
    
    // Your database insert query
    $query = "INSERT INTO talents (name, job, country, gender, age, salary, ...) VALUES (...)";
    $result = mysqli_query($connection, $query);
    
    if ($result) {
        // ** SEND NOTIFICATION AFTER SUCCESSFUL INSERT **
        
        $title = "✨ New Candidate Available! ✨";
        $body = "$name ($job) from $country is now available for hiring!";
        
        // Send notification via Firebase
        $notificationResult = sendFirebaseNotification($title, $body);
        
        // Log notification result (optional)
        if ($notificationResult['success']) {
            error_log("Notification sent successfully for candidate: $name");
        } else {
            error_log("Notification failed: " . json_encode($notificationResult));
        }
        
        // Return success response
        echo json_encode(['success' => true, 'message' => 'Candidate added and notification sent']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>
