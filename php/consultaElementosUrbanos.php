<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Headers: Content-Type');

include('conexionBd.php');

$contenido=$_POST['Envio'];
$contenido= str_replace("\\","", $contenido);
$array=explode(",",$contenido);
 
$condicion=$array[0]; 

$sql = "SELECT * FROM ElementosUrbanos where tipo = $condicion ";

$resultado = mysqli_query($connect, $sql);

while ($row = mysqli_fetch_assoc($resultado)) {

    $output[] = $row;

}

print(json_encode($output));

$connect->close();

?>



