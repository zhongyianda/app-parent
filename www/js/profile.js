console.log('profile.js loaded');

app.controller("profileCtrl",['$http', '$scope', function($http,$scope){
  
//Inits

$scope.currentPerson={};
$scope.currentRoute={};


//Get
this.getPerson = function() {
	console.log("getPerson");
	
	var query = new AV.Query(AV_People);
	query.equalTo('cellphone',AV.User.current().get('mobilePhoneNumber')); //Temporary TODO
	
	query.find({
		success:function (results){
			$scope.$apply(function(){
				$scope.currentPerson = JSON.parse(JSON.stringify(results[0]));
				$scope.currentPerson.parentName=$scope.currentPerson.name+"家长"
				console.log($scope.currentPerson);
			});
		}
	})
}

this.getPerson();


}]);