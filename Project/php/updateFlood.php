<?php


$conn = new PDO('pgsql:host=localhost;dbname=practice','postgres','1q2w3e4r5t');

# Build SQL SELECT statement and return the geometry as a GeoJSON element
$sql = 'UPDATE bygning
set inters = 2
from bluespots
  WHERE st_disjoint(bygning.geom, bluespots.geom)';
$sql1 = 'UPDATE bygning
set inters = 1
from bluespots
  WHERE st_intersects(bygning.geom, bluespots.geom)';

$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}
$rs1 = $conn->query($sql1);
if (!$rs1) {
    echo 'An SQL error occured.\n';
    exit;
}


$conn = NULL;
?>
