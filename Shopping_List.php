<?php

session_start();

$host = "localhost";
$username = "root";
$password = "";
$dbname = "shopping_list";

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

// Create table
$sql = "CREATE TABLE items (
    name VARCHAR(30) NOT NULL PRIMARY KEY,
    quantity INT(6) NOT NULL,
);";

if ($conn->($sql) === TRUE) {
    echo "Table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}



// Add item to database
$item = $_POST['item'];
$sql = "INSERT INTO items (name) VALUES ('$item');";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array('message' => 'Item added to the shopping list.'));
} else {
    echo json_encode(array('message' => 'Error adding item to the shopping list.'));
}

// Get items from database
$sql = "SELECT name FROM items";
$result = $conn->query($sql);

$items = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        array_push($items, $row["name"]);
    }
}

// Return items as JSON
echo json_encode(array('items' => $items));
$conn->close();

$conn->close();

