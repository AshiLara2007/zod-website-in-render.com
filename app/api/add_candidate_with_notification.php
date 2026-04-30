<?php
// add_candidate_with_notification.php
// Complete candidate addition script with notification

// Database Configuration
$DB_HOST = "localhost";
$DB_USER = "your_database_username";
$DB_PASS = "your_database_password";
$DB_NAME = "your_database_name";

// API Configuration
$NOTIFICATION_API_URL = "https://zodmanpower.info/api/send_notification.php";

header('Content-Type: application/json');

// ============================================
// FUNCTION: Send Notification
// ============================================
function sendNotification($title, $body, $candidateName = null, $candidateId = null) {
    global $NOTIFICATION_API_URL;
    
    $data = [
        'title' => $title,
        'body' => $body
    ];
    
    if ($candidateName) {
        $data['candidate_name'] = $candidateName;
    }
    if ($candidateId) {
        $data['candidate_id'] = $candidateId;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $NOTIFICATION_API_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'success' => ($httpCode == 200),
        'response' => json_decode($response, true)
    ];
}

// ============================================
// FUNCTION: Add Candidate to Database
// ============================================
function addCandidateToDatabase($data, $connection) {
    $name = mysqli_real_escape_string($connection, $data['name']);
    $job = mysqli_real_escape_string($connection, $data['job']);
    $country = mysqli_real_escape_string($connection, $data['country']);
    $gender = mysqli_real_escape_string($connection, $data['gender']);
    $age = intval($data['age']);
    $salary = mysqli_real_escape_string($connection, $data['salary']);
    $experience = mysqli_real_escape_string($connection, $data['experience']);
    $workerType = mysqli_real_escape_string($connection, $data['worker_type']);
    $imageUrl = mysqli_real_escape_string($connection, $data['image_url'] ?? '');
    $cvUrl = mysqli_real_escape_string($connection, $data['cv_url'] ?? '');
    
    $query = "INSERT INTO talents (name, job, country, gender, age, salary, experience, worker_type, image_url, cv_url, created_at) 
              VALUES ('$name', '$job', '$country', '$gender', $age, '$salary', '$experience', '$workerType', '$imageUrl', '$cvUrl', NOW())";
    
    if (mysqli_query($connection, $query)) {
        return mysqli_insert_id($connection);
    }
    return false;
}

// ============================================
// MAIN PROCESSING
// ============================================

// Connect to database
$connection = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

if (!$connection) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . mysqli_connect_error()
    ]);
    exit;
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get candidate data from POST
    $candidateData = [
        'name' => $_POST['name'] ?? '',
        'job' => $_POST['job'] ?? '',
        'country' => $_POST['country'] ?? '',
        'gender' => $_POST['gender'] ?? '',
        'age' => $_POST['age'] ?? 0,
        'salary' => $_POST['salary'] ?? '',
        'experience' => $_POST['experience'] ?? '',
        'worker_type' => $_POST['worker_type'] ?? 'Recruitment',
        'image_url' => $_POST['image_url'] ?? '',
        'cv_url' => $_POST['cv_url'] ?? ''
    ];
    
    // Validate required fields
    if (empty($candidateData['name']) || empty($candidateData['job'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Name and Job are required fields'
        ]);
        mysqli_close($connection);
        exit;
    }
    
    // Add candidate to database
    $candidateId = addCandidateToDatabase($candidateData, $connection);
    
    if ($candidateId) {
        // Prepare notification message
        $title = "✨ New Candidate Available! ✨";
        $body = $candidateData['name'] . " (" . $candidateData['job'] . ") from " . $candidateData['country'] . " is now available!";
        
        // Send notification
        $notificationResult = sendNotification(
            $title,
            $body,
            $candidateData['name'],
            $candidateId
        );
        
        // Return success response
        echo json_encode([
            'success' => true,
            'candidate_id' => $candidateId,
            'candidate_name' => $candidateData['name'],
            'notification_sent' => $notificationResult['success'],
            'notification_response' => $notificationResult['response'],
            'message' => 'Candidate added successfully! Notification ' . ($notificationResult['success'] ? 'sent' : 'failed')
        ]);
        
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to add candidate to database'
        ]);
    }
    
    mysqli_close($connection);
    
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Please use POST method'
    ]);
}
?>
