
self.onmessage = function(e){
	
	var clustArr=[];
	for(var i=0;i<e.data.res.length;i++){

		var geoJson = JSON.parse(e.data.res[i].points);
		var clusterParam = {
			name:e.data.res[i][e.data.titleColumn],
			lon:geoJson.coordinates[0],
			lat:geoJson.coordinates[1],
			gid:e.data.res[i].gid
		}

		clustArr.push(clusterParam);
	}
    this.postMessage(clustArr);
}
