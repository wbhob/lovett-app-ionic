angular.module('starter.controllers', ['ionic', 'ionic.utils', 'ngCordova'])
	.controller('AppCtrl', function($rootScope, $cordovaAdMob, $ionicSlideBoxDelegate, $scope, $ionicPopup, $ionicActionSheet, $cordovaCamera, $cordovaFile, $state, $cordovaStatusbar, $ionicModal, $ionicPlatform, $ionicUser, $ionicPush) {

		$scope.buy = function() {
			if ((window.device && device.platform == "iOS") && window.storekit) {
				storekit.purchase("productId1");
			}
		}

		$scope.restore = function() {
			if ((window.device && device.platform == "iOS") && window.storekit) {
				storekit.restore();
			}
		}



		if (window.localStorage.getItem('instertitialAutoShow') != 'false') window.localStorage.setItem('instertitialAutoShow', true);
		$('.digital-id-toggle').removeAttr('checked');
		if (window.localStorage.getItem('digital-id-enabled') == "true") {
			$('#digital-id-menu-item').show();
		} else {
			$('#digital-id-menu-item').hide();
			$('.digital-id-toggle').prop('checked', false)
		}
		//Setup Modal
		$scope.nextSlide = function() {
			$ionicSlideBoxDelegate.next();
		};
		$scope.prevSlide = function() {
			$ionicSlideBoxDelegate.previous();
		};
		$ionicModal.fromTemplateUrl('templates/slider.html', function(modal) {
			$scope.modal = modal;
			console.log(window.localStorage.getItem('setup'));
			if (window.localStorage.getItem('setup') == 'true') {
				$scope.modal.hide();
				$scope.modal.remove();
			} else {
				$scope.openModal();
			}
		}, {
			// Use our scope for the scope of the modal to keep it simple
			scope: $scope,
			// The animation we want to use for the modal entrance
			animation: 'slide-in-up',
			backdropClickToClose: false
		});

		$scope.openModal = function() {
			console.log('Opening Modal');
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			console.log('Closing Modal');
			$('.profile-img').attr('src', window.localStorage.getItem('url'));
			$scope.modal.hide();
			$scope.modal.remove();
			console.log('Modal Closed');
		};

		$scope.identifyNewUser = function() {
			console.log('Functioncalled')
			if ($('#enableDigitalId').prop('checked')) {
				$('.digital-id-toggle').prop('checked', true);
				window.localStorage.setItem('digital-id-enabled', 'true');
				$('#digital-id-menu-item').show();
				var name = $('#setUpName').val();
				var id = $('#setUpId').val();
				console.log('values taken');
				var url = window.localStorage.getItem('url');
				console.log(url);
				if (id !== "" && name !== "" && url !== "") {
					window.localStorage.setItem('id', id);
					window.localStorage.setItem('name', name);
					console.log('vars set');
					$ionicUser.identify({
						user_id: $ionicUser.generateGUID(),
						name: window.localStorage.getItem('name'),
						id: window.localStorage.getItem('id'),
						image: window.localStorage.getItem('url'),
					}).then(function() {
						console.log('UserIdentified');
						$('.name').text(name);
						$('.id').text(id);
						$('.profile-img').attr('src', window.localStorage.getItem('url'));
						if (id != "null") {
							console.log(id);
							$('#barcode').JsBarcode(id);
						}
						$scope.identified = true;
						$('#identifyButton').hide();
						$('#pushNameList').hide();
						$('#identify-desc').hide();
						$scope.nextSlide();
						var user = $ionicUser.get();
						console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
					})
				} else {
					if (name === "") {
						$('#setUpNameForm').addClass('input-assertive');
					}
					if (id === "") {
						$('#setUpIdForm').addClass("input-assertive");
					}
					if (url === "") {
						$('#setUpImgForm').addClass('input-assertive')
					}
					if (name !== "") {
						$('#setUpNameForm').removeClass('input-assertive');
					}
					if (id !== "") {
						$('#setUpIdForm').removeClass("input-assertive");
					}
					if (url !== "") {
						$('#setUpImgForm').removeClass('input-assertive')
					}
				}
			} else {
				$('#digital-id-menu-item').hide();
				$('.digital-id-toggle').prop('checked', 'false');
				$scope.nextSlide();
			}
		}
		$scope.identifyUser = function() {
			console.log('Ionic User: Identifying with Ionic User service');

			// Add some metadata to your user object.
			var name = $('#pushName').val()

			// Identify your user with the Ionic User Service
			$ionicUser.identify({
				user_id: $ionicUser.generateGUID(),
				name: name,
			}).then(function() {
				$scope.identified = true;
				console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
			});

			console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
		};
		$scope.pushRegister = function() {
			console.log('Ionic Push: Registering user');

			// Register with the Ionic Push service.  All parameters are optional.
			$ionicPush.register({ //Can pushes show an console.log on your screen?
				canSetBadge: true, //Can pushes update app icon badges?
				canPlaySound: true, //Can notifications play a sound?
				canRunActionsOnWake: true, //Can run actions outside the app,
				onNotification: function(notification) {
					// Handle new push notifications here
					// console.log(notification);
					return true;
				}
			}).then(function(result) {
				submitRegister();
				console.log('result: ' + result)
			});
		};
		var submitRegister = function() {
			console.log('Ionic Push: User registered');
			$scope.nextSlide();
		}
		$rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
			console.log("Successfully registered token " + data.token);
			console.log('Ionic Push: Got token ', data.token, data.platform);
			$scope.token = data.token;
		});
		$scope.verify = function() {
			var password = $('#passwordInput').val();
			if (password === "lions") {
				window.localStorage.setItem('setup', 'true');
				console.log(window.localStorage.getItem('setup'));
				$scope.closeModal();
			} else {
				window.localStorage.setItem('setup', 'false');
				$('#password-input-cont').addClass('input-assertive');
			}
		}
		$scope.addImage = function() {
				// 2
				$(document).ready(function() {
						$ionicActionSheet.show({
							cancelText: 'Cancel',
							buttons: [
								{
									text: '<i class="icon ion-camera"></i> Take Photo'
            },
								{
									text: '<i class="icon ion-image"></i> Camera Roll'
            },
    ],
							buttonClicked: function(index) {
								switch (index) {
									case 0:
										//Handle Take Photo Button
										$scope.options = {
											destinationType: Camera.DestinationType.FILE_URI,
											sourceType: Camera.PictureSourceType.CAMERA,
											allowEdit: false,
											encodingType: Camera.EncodingType.JPEG,
											popoverOptions: CameraPopoverOptions,
										};
										$scope.processImage();
										$scope.options = 0;
										$scope.image = window.localStorage.getItem('url');
										$('.profile-img').attr("src", window.localStorage.getItem('url'));
										return true;
										break;
									case 1:
										//Handle Camera Roll Button
										$scope.options = {
											destinationType: Camera.DestinationType.FILE_URI,
											sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
											allowEdit: false,
											encodingType: Camera.EncodingType.JPEG,
											popoverOptions: CameraPopoverOptions,
										};
										$scope.processImage();
										$scope.options = 0;
										$('.profile-img').attr("src", window.localStorage.getItem('url'));
										return true;
										break;
									default:
										return false;
								}
							}
						});
					})
					// 3
				$scope.processImage = function() {
					$cordovaCamera.getPicture($scope.options).then(function(imageData) {
						// 4
						onImageSuccess(imageData);

						function onImageSuccess(fileURI) {
							createFileEntry(fileURI);
						}

						function createFileEntry(fileURI) {
							window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
						}

						// 5
						function copyFile(fileEntry) {
							var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
							var newName = makeid() + name;

							window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
									fileEntry.copyTo(
										fileSystem2,
										newName,
										onCopySuccess,
										fail
									);
								},
								fail);
						}

						// 6
						function onCopySuccess(entry) {
							$scope.$apply(function() {
								$scope.image = entry.nativeURL;
								window.localStorage.setItem('url', entry.nativeURL);
								$('.profile-img').attr("src", entry.nativeURL);
								console.log(entry);
							});
						}

						function fail(error) {
							console.log("fail: " + error.code + error.message);
						}

						function makeid() {
							var text = "";
							var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

							for (var i = 0; i < 5; i++) {
								text += possible.charAt(Math.floor(Math.random() * possible.length));
							}
							return text;
						}

					}, function(err) {
						console.log(err.code + ": " + error.message);
					});
					$('.profile-img').attr('src', window.localStorage.getItem('url'));
				};
			}
			// Set Local Storage Variables
		$scope.setLocal = function() {
			$(document).ready(function() {
				console.log(window.localStorage.getItem('url'));
				var name = document.getElementById("fullName").value;
				var id = document.getElementById("idNum").value;
				window.localStorage.setItem("name", name);
				window.localStorage.setItem("id", id);
				$('.name').text(name);
				$('.id').text(id);
				if (id != "null") {
					console.log(id);
					$('#barcode').JsBarcode(id);
				}
				if ($('.digital-id-toggle').prop('checked')) {
					window.localStorage.setItem('digital-id-enabled', true);
					$('#digital-id-menu-item').show();
				} else {
					window.localStorage.setItem('digital-id-enabled', false);
					$('#digital-id-menu-item').hide();
				}
			});
		}
	})
	.controller('WelcomeCtrl', function($scope) {
		date = new Date();
		var hours = date.getHours();
		console.log(hours);
		if (hours >= 5 && hours <= 11) //MESSAGE FOR MORNING
			$scope.time = "Good Morning.";
		else if (hours >= 12 && hours <= 17) //MESSAGE FOR AFTERNOON
			$scope.time = 'Good Afternoon.';
		else if (hours >= 18 && hours <= 20) //MESSAGE FOR EVENING (6pm-8pm)
			$scope.time = 'Good Evening.';
		else //MESSAGE FOR NIGHT (9pm-4am)
			$scope.time = 'Good Night.';
		console.log('Control Working');
	})

//Upper School Bulletin Controller
.controller('USCtrl', function() {
		/*var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
		if (!result.error) {
			var entry = result.feed.entries[1];
			$('#usBulletin').html(entry);
		}*/
	})
	.controller('MSCtrl', function() {
		/*var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
		if (!result.error) {
			var entry = result.feed.entries[1];
			$('#msBulletin').html(entry);
		}*/

	})
	.controller('LSCtrl', function() {
		/*var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
		if (!result.error) {
			var entry = result.feed.entries[1];
			$('#lsBulletin').html(entry);
		}*/
	})
	//Lunch Controller
	.controller('LunchCtrl', function($scope, $http) {
		/*var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
		if (!result.error) {
			var entry = result.feed.entries[1];
			$('#lunchBulletin').html(entry);
		}*/
	})

.controller('AboutCtrl', function($scope) {
		$scope.show = function() {
			$('.meta').fadeToggle(400);
		}
	})
	.controller('ChooseCtrl', function() {})
	.controller('DashCtrl', function($scope) {
		var onLoad = function() {
			$(document).ready(function() {
				var name = window.localStorage.getItem('name');
				var id = window.localStorage.getItem('id');
				$('.profile-img').attr('src', window.localStorage.getItem('url'));
				if (name != "null") {
					$scope.name = name;
				}
				if (id != "null") {
					$scope.id = id;
					console.log(id);
					$('#barcode').JsBarcode(id);
				}
			})
		};
		onLoad();
	})

.controller('SettingsCtrl', function($scope, $cordovaCamera, $cordovaFile, $ionicActionSheet, $state) {
		var setValues = function() {
			$(document).ready(function() {
				$('#fullName').val(window.localStorage.getItem("name"));
				$('#idNum').val(window.localStorage.getItem("id"));
				$('.profile-img').attr("src", window.localStorage.getItem("url"));
			})
		}
		setValues();
	})
	.controller('SlideCtrl', function($scope, $ionicSlideBoxDelegate) {

	})
