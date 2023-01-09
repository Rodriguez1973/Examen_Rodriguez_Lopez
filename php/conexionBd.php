<?php

$host_name = "localhost";

$database = "s1037944_CiudadI";

$user_name = "s1037944_fer2122";

$password = "21Curso_22"; 

    $connect = mysqli_connect($host_name, $user_name, $password, $database);

    if(mysqli_connect_errno()) {

		echo '<p>"Error: Fallo al conectarse a MySQL debido a: '.mysqli_connect_error().'</p>';

    }

?>

