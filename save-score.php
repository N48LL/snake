 <?php
$name = $_POST["name"];
$score = $_POST["score"];
$time = $_POST["time"];
$data = "$name,$score,$time\n";
$file = fopen("scores.txt", "a");
fwrite($file, $data);
fclose($file);
?>

