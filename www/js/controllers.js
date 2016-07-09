app=angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $state) {
	  
	  //Inits

$scope.currentPerson={};

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



    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $ionicModal.fromTemplateUrl('templates/map.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.mapModal = modal;
    });

    $scope.openMap = function () {
      $scope.mapModal.show();
    }

    $scope.closeMap = function () {
      $scope.mapModal.hide();
    }

    $scope.openMonitor = function () {
      $ionicModal.fromTemplateUrl('templates/monitor.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.monitorModal = modal;
        $scope.monitorModal.show();
      });
    }

    $scope.closeMonitor = function () {
      $scope.monitorModal.hide();
    }

    // Form data for the login modal
    $scope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      if (AV.User.current()) {
        $scope.currentUser = AV.User.current();
      } else {
        $scope.modal.show();
      }
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.pendingSMSText = "获取验证码";
    $scope.pendingSMS = false;
    $scope.doSendSMS = function (loginForm) {
      if ($scope.pendingSMS) {
        return;
      }
      AV.Cloud.requestSmsCode(loginForm.phoneNo).then(function () {
        $scope.lastError = "发送成功";
        $scope.$apply();
      }, function (err) {
        $scope.lastError = "错误," + err.message;
        $scope.$apply();
      });
      var count = 30;
      $scope.pendingSMS = true;
      var timerId = setInterval(function () {
        count--;
        $scope.pendingSMSText = count + "秒";
        $scope.$apply();
        if (count == 0) {
          clearInterval(timerId);
          $scope.pendingSMSText = "获取验证码";
          $scope.pendingSMS = false;
          $scope.$apply();
        }
      }, 1000);
    }

    // Perform the login action when the user submits the login form
    $scope.doLogin = function (loginForm) {
      var user = new AV.User();
      user.signUpOrlogInWithMobilePhone({
        mobilePhoneNumber: loginForm.phoneNo,
        smsCode: loginForm.verificationCode,
      }).then(function (user) {
        $scope.lastError = "注册成功,请登录";
        $scope.$apply();
        $scope.closeLogin();
      }, function (error) {
        $scope.lastError = "错误," + err.message;
        $scope.$apply();
      });

    };

    // popup of logout
    $scope.infoApp2 = function () {
      AV.User.logOut();
      var alertPopup = $ionicPopup.alert({
        template: '<center>已经登出!</center>',
        buttons: [
          {
            text: '好',
            type: 'button-dark'
          }
        ]
      });
      alertPopup.then(function (res) {
        $scope.modal.show();
      });
    };
  })

  
  
  
  .controller('NewsCtrl', function ($scope, $ionicPopup) {
    $scope.infoApp = function () {
      var alertPopup = $ionicPopup.alert({
        title: '<b class="assertive">Template</b>',
        template: '<center>Template ionSunset </center>',
        buttons: [
          {
            text: 'Ok',
            type: 'button-dark'
          }
        ]
      });
      alertPopup.then(function (res) {
        console.log('Thank you!!');
      });
    };
  })

  .controller('MenuActiveCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
      return route === $location.path();
    };
  });
