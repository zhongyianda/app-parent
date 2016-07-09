console.log('profile.js loaded');

app.controller("busCtrl",['$http', '$scope', function($http,$scope){
  
//Inits

$scope.currentRoute={};
$scope.students=[];


//Get
this.getRoute = function() {
	console.log("getRoute");
	
	var query = new AV.Query(AV_Route);
	query.equalTo('objectId','5747dad8c26a38006ba38f22'); //Temporary TODO
	
	query.find({
		success:function (results){
			$scope.$apply(function(){
				$scope.currentRoute = JSON.parse(JSON.stringify(results[0]));
				console.log($scope.currentRoute);
				
					
				var query = new AV.Query(AV_People);
				sam=$scope;
				query.get($scope.currentRoute.driver).then(function(res) {$scope.driver=JSON.parse(JSON.stringify(res));});
				query.get($scope.currentRoute.teacher).then(function(res) {$scope.teacher=JSON.parse(JSON.stringify(res));});
				query.get($scope.currentRoute.security).then(function(res) {$scope.security=JSON.parse(JSON.stringify(res));});
				
				for(var i=0; i<$scope.currentRoute.passengers.length; i++) {
					var passengerId=$scope.currentRoute.passengers[i];
					query.get(passengerId).then(function(res) {$scope.students.push(JSON.parse(JSON.stringify(res)));});
				}
				
			});
		}
	})

	
}

this.getRoute();





setInterval(calcR,5000);
setTimeout(calcR,100);





function calcR() {
	
	
	
	var origin=$scope.currentRoute.originCoordinates;
	var dest=$scope.currentRoute.destinationCoordinates;
	
	if (typeof origin === 'undefined') return 'none';
	if (typeof dest === 'undefined') return 'none';
	
	var center=[(origin[0]+dest[0])/2,(origin[1]+dest[1])/2];
	
	$scope.routeUrl = 'http://restapi.amap.com/v3/staticmap?key=ee95e52bf08006f63fd29bcfbcf21df0&location=' +
		center[0] + ',' + center[1] +
		'&size='+document.getElementById('route-staticmapcontainer').clientWidth+'*400&markers=mid,,' +
		'起' + ':' + origin[0] + ',' + origin[1] + '|mid,,'+
		'终' + ':' + dest[0] + ',' + dest[1];
		
		/*
	if (1||routeCtrl.currentRoute.operationStatus===110 // Arriving 
		|| routeCtrl.currentRoute.operationStatus===120) // Running
		addRouteVehicle();
	
	if (0||routeCtrl.currentRoute.operationStatus===120 // Running
		|| routeCtrl.currentRoute.operationStatus===130) // Finished*/
		//addRouteTrace();
	
		/*
	var queryT=new AV.Query('Trace');
	queryT.addDescending('createdAt');
	queryT.limit(1);

	queryT.find().then(function(resp) {
		
		var loc=resp[0].get('location');
		console.log(loc);
		var mString='|mid,,V:'+loc.longitude + ',' + loc.latitude;
		conosle.log(mString);
		
		//$scope.routeUrl= $scope.routeUrl + mString;
		//$scope.$apply();
		
		
	}, function(err) {console.log(err)});
	
	*/
	addRouteTrace();
		
}

function addRouteTrace() {
	var number=100; //How many points to create the path
	
	var GDUrl = $scope.routeUrl +  '&paths=5,0xFF0000,1,,:';
		
		
	var procRes=[];
	
	
	
	var queryT=new AV.Query('Trace');
	queryT.addAscending('createdAt');
	queryT.greaterThan('createdAt', $scope.currentRoute.originTime);
	queryT.limit(100);
	queryT.find().then(function(res) {
		if(res.length<number) {
			procRes=res;
		} else {
			var m=0;
			
			var interval=1.0*(res.length-1)/(number-1);
			
			
			
			for(var i=0; i<res.length; i=i+interval) {

				procRes.push(res[Math.round(i)]);
			}
		}
		
		for(var i=0;i<procRes.length;i++) {
			if(i>0) GDUrl=GDUrl+';';
			var loc=procRes[i].get('location');
			GDUrl=GDUrl+loc.longitude+','+loc.latitude;
		}
		
		
		$scope.routeUrl=GDUrl;
		$scope.$apply();
	}, function(err) {console.log(err)});
}

	
	

}]);