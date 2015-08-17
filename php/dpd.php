<?php
session_start();
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/x-www-form-urlencoded');


if(isset($_POST["getParcels"])){
	echo getParcels();
}elseif(isset($_POST["getParcelsByStatus"])){
	echo getParcelsByStatus();
}elseif(isset($_POST["updateParcel"],$_POST["value"]) && is_numeric($_POST["updateParcel"])){
	$id = $_POST["updateParcel"];
	$state = $_POST["value"];
	echo updateParcel($id,$state);
}


function getParcels(){
	$mysqli = getConnection();
	if (mysqli_connect_errno()) {
    	printf("Connect failed: %s\n", mysqli_connect_error());
    	exit();
	}
	$sql="SELECT id,state,reference,origin,destination,retrieved,eta,sender FROM dpd_parcels WHERE state <> 'delivered' ORDER BY eta,destination";
	if($res = $mysqli->query($sql)){
		while ($row = $res->fetch_assoc()) {
			$parcels[]=$row;
    	}
		return json_encode($parcels);
	}else{
		return $mysqli->error;
	}
}
function getParcelsByStatus(){
	$mysqli = getConnection();
	if (mysqli_connect_errno()) {
    	printf("Connect failed: %s\n", mysqli_connect_error());
    	exit();
	}
	$sql="SELECT id,state,reference,origin,destination,retrieved,eta,sender FROM dpd_parcels WHERE state <> 'delivered' ORDER BY state DESC,eta,destination";
	if($res = $mysqli->query($sql)){
		while ($row = $res->fetch_assoc()) {
			$parcels[]=$row;
    	}
		return json_encode($parcels);	
	}else{
		return $mysqli->error;
	}
}
function updateParcel($id,$state) {
	$mysqli = getConnection();
	if (mysqli_connect_errno()) {
    	printf("Connect failed: %s\n", mysqli_connect_error());
    	exit();
	}
	$sql="UPDATE dpd_parcels SET state=? WHERE id=?";
	$stmt = $mysqli->prepare($sql);
	$stmt->bind_param("si", $state,$id);
	$stmt->execute();
	if($mysqli->affected_rows>0){
		return 1;
	}else{
		return 0;
	}

}
function getConnection(){
	$server= "localhost";
	$db_user="root";
	$db_pass="root";
	$db="sanderdeblpai4cu";
	$mysqli = new mysqli($server,$db_user,$db_pass,$db);
	if (mysqli_connect_errno()) {
    	printf("Connect failed: %s\n", mysqli_connect_error());
    	exit();
	}
	return $mysqli;
}