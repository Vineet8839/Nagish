<?php
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirm = $_POST['confirm'];
//Database Connection
$conn = new mysqli('localhost','root','','if0_37257700_Register');
if($conn->connect_error){
    die('Connection Failed : '.$conn->connect_error);
} else{
    $stmt = $conn->prepare("insert into registration(username, email, password, confirm)
    values(? ,? ,? , ?)");
    $stmt->bind_param("ssss", $username , $email, $password, $confirm);
    $stmt->execute();
    echo "registration Succesfully...";
    $stmt->close();
    $conn->close();

}
?>