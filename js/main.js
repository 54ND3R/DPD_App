var httpRequest;
var base = getBase();
var container_parcels = getContainer();
window.onload = init;

function init() {
	showParcelHeader();
	getParcels();


}
function status_click(){
	if(!document.getElementById("status").classList.contains('selected')){
		removeChildren(getContainer());
		showParcelHeader();
		getParcelsByStatus();
		document.getElementById("status").classList.add('selected');
		document.getElementById("eta").classList.remove('selected');
	}	
}
function eta_click(){
	console.log("hi");
	if(!document.getElementById("eta").classList.contains('selected')){
		removeChildren(getContainer());
		showParcelHeader();
		getParcels();
		document.getElementById("status").classList.remove('selected');
		document.getElementById("eta").classList.add('selected');
	}		
}
function getBase(){
	var url = document.location.href;
	return url.slice(0,url.lastIndexOf("/")-url.length);
}
function getContainer(){
	return document.getElementById("container");
}
function getParcels(){
	httpRequest=new createXmlHttpRequestObject();
	httpRequest.open("POST",base+"/php/dpd.php",true);
	var params = "getParcels=all";
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.onload = handleGetParcels;
	httpRequest.send(params);	
}
function getParcelsByStatus(){
	httpRequest=new createXmlHttpRequestObject();
	httpRequest.open("POST",base+"/php/dpd.php",true);
	var params = "getParcelsByStatus=all";
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.onload = handleGetParcels;
	httpRequest.send(params);	
}
function handleGetParcels() {
	var parcels = JSON.parse(httpRequest.response);
	showParcels(parcels);
	var selects = document.getElementsByTagName('select');
	for(var i=0;i<selects.length;i++){
		selects[i].onchange=changeState;
	}
}
function showParcelHeader() {
	var header = create("<div class='header'>"+
		"<span id='number'>Number</span>"+
		"<span id='status' class='filter'>Status</span>"+
		"<span id='location'>Location</span>"+
		"<span id='eta' class='selected filter'>Est. Delivery Time</span></div>");
	container.appendChild(header);
	var status = document.getElementById("status");
	var eta = document.getElementById("eta");
	status.addEventListener("click",status_click);
	eta.addEventListener("click",eta_click);
}
function showParcels(parcels){

	for(var i=0;i<parcels.length;i++){
		showParcel(parcels[i],i+1);
	}	
}
function showParcel(parcel,number) {
	if(parcel['state']=="waiting"){
		var location=parcel["origin"];
	}else{
		var location=parcel["destination"];
	}
	var unit = create("<div class='unit' id='"+parcel['id']+"'>"+
						"<div class='number'>"+number+"</div>"+
						"<div class='details'>"+
							"<div class='state'>"+
								showState(parcel['state'])+
							"</div>"+
						 	"<div class='origin'>"+location+"</div>"+
							"<div class='eta'>"+new Date(parcel['eta']).toLocaleDateString()+"</div>"+
						"</div>"+
					  "</div>");
	container.appendChild(unit);
}
function showState(state){
	switch(state){
		case "waiting":
			return "<select><option selected>waiting</option><option>retrieved</option><option>delivered</option></select>";
		case "retrieved":
			return "<select><option>waiting</option><option selected>retrieved</option><option>delivered</option></select>";
		case "delivered":
			return "<select><option>waiting</option><option>retrieved</option><option selected>delivered</option></select>";
		default:
			return "<select><option selected>waiting</option><option>retrieved</option><option>delivered</option></select>";
	}
}
function changeState(event){
	var select = event.target;
	var id = select.parentNode.parentNode.parentNode.getAttribute("id");
	var newValue = select.value;
	updateParcelState(id,newValue);
}
function updateParcelState(id,val){
	httpRequest=new createXmlHttpRequestObject();
	httpRequest.open("POST",base+"/php/dpd.php",true);
	var params = "updateParcel="+id+"&value="+val;
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.onload = handleUpdateParcelState;
	httpRequest.send(params);	
}
function handleUpdateParcelState(){
	console.log(httpRequest.response);
}
function createXmlHttpRequestObject() {
	var xmlHttp;
	if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}else{
		xmlHtpp = new ActiveXObject("Microsoft.XMLHTTP");
	}	
	return xmlHttp;
}
function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}
function removeChildren(el) {
	while (el.firstChild) {
    	el.removeChild(el.firstChild);
	}
}