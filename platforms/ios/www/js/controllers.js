angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, PeopleService) {
	// Call the service so we can have some data in our application
	PeopleService.init();
})

.controller('NetworkCtrl', function($scope, $location, PeopleService) {

	// Load our netowkr page with the list of users
    $scope.network = PeopleService.list();

    // A simple reusable function to go to a URL 
    $scope.go = function(path){
	    $location.path(path);
	};
})

.controller('PersonCtrl', function($scope, $stateParams, PeopleService) {
	// Get the contact's details and put them in scope
	$scope.person = PeopleService.get($stateParams['personId']);

	//Initialising our error variable for validation
	$scope.error = {};

	// Using the same form for add and edit. If its a new contact, we initialise some variables and choose to show some of the elements or not.
	if($stateParams['personId'] == "new"){
		$scope.showAddToContacts = true;
		$scope.person = {};
		$scope.person.name = "";
		$scope.person.twitter = "@";
		$scope.person.phone = "";
	} else {
		$scope.showAddToContacts = false;
	}

	// Cancel button
	$scope.cancel = function(){
		history.go(-1);
	}

	// Update button press
	$scope.update = function(){
		// Use the validate form function to make sure our data is ok
		$scope.error = $scope.validateForm($scope.person);
		
		// If there are no errors then carry on
		if($scope.error.name == undefined && $scope.error.contact == undefined){

			// If its a new form then we do an add, and if its an edit, we do a set
			if($stateParams['personId'] == "new"){
				PeopleService.add($scope.person);
			} else {
				PeopleService.set($stateParams['personId'], $scope.person);
			}
			
			history.go(-1);
		}
	}

	// When the delete button is pressed, and the user presses a button on the popup
	$scope.removeContact = function(buttonIndex){
		// Coming from our localhost or OK on notification
		// If the correct button is pressed, then we delete the contact from the data store
		if((buttonIndex == null)||(buttonIndex == 1)){
			PeopleService.delete($stateParams['personId']);
			history.go(-1);
		}
	}

	// As we have consistent data, we can validate this all in one form
	$scope.validateForm = function(formdata){
		var error = {};
		if(formdata.name == ''){ 
			error.name = true; 
		}
		
		if(formdata.twitter == '' && formdata.phone == ''){ 
			error.contact = true; 
		}
		
		return error;
	}

	// Delete a contact from the data store
	$scope.delete = function(){
		// Check to see if we are on a actual device and not a browser
		if (navigator.notification) {
			// Call to the Cordova Notification Plugin
			navigator.notification.confirm(
			    'Are you sure?',        // message
			     $scope.removeContact,  // callback
			    'Delete Contact',       // title
			    ['Delete','Cancel']     // buttonLabels
			);
		} else {
			// If you are on a web browser, then use a confirm box
			var check = confirm("Are you Sure?");
			if(check == true){
				$scope.removeContact();
			}
		}
	}
})

// Service added here for simplicity, should be its own file in future
.service('PeopleService', function(){

	// Populate the app initially with some test data
	this.init = function(){
		if(!localStorage.getItem('people')){
		    var people = [
			    { name: 'Hollie Oaks', twitter: '@hollyoaks', avatar: 'glasses.png', phone: '07898 987654', id: 1 },
			    { name: 'Emma Dale', twitter: '@emmadale', avatar: 'ghostie.png', phone: '07123 456734', id: 2 },
			    { name: 'Brook Side', twitter: '@brookie', avatar: 'eye.png', phone: '07987 654321', id: 3 }
		    ];

		    // Local storage used for simplicty but maintains a persistent storage - good for an example
		    localStorage.setItem('people', JSON.stringify(people));
		}
	}

	// Show a list of all the contacts from our storage and feed them into the UI
	this.list = function(){
		var people = JSON.parse(localStorage.getItem('people'));
		return people;
	}

	// Get an individual contact's details based on the id sent through
	this.get = function(id){
		var people = JSON.parse(localStorage.getItem('people'));
		    for (i in people) {
	        	if (people[i].id == id) {
	            	return people[i];
	      		}
	  		}
	}

	// Add an individual to the data storage
	this.add = function(formdata){
		var people = JSON.parse(localStorage.getItem('people'));
		
		// Simple algorithm to find out the highest id number, so we can +1 for the new contact
		// Creating index rather than using JSON indexes as they change when you splice. Keeps permanence
		var highestId = 0;
		for (var i=0; i<people.length; i++) {
	    	if (people[i].id > highestId) {
	  			highestId = people[i].id;
	  		}
		}

		var newId = highestId+1;
		// Simply create random avatars to add a bit of fun. Could be replaced by Camera functionality
		var avatars = ["glasses.png", "ghostie.png", "eye.png", "briefcase.png", "car.png", "donut.png", "glove.png", "knife.png", "pizza.png"];
		formdata.avatar = avatars[Math.floor(Math.random() * avatars.length)];
		// Push to the local JSON object before putting it back into Local Storage
		people.push({name: formdata.name, twitter: formdata.twitter, phone: formdata.phone, avatar: formdata.avatar, id: newId });
		localStorage.setItem('people', JSON.stringify(people));
	}

	// Updating the contacts data
	this.set = function(id, formdata){
		// Getting our data out of storage to overwrite locally
		var people = JSON.parse(localStorage.getItem('people'));

		for (var i=0; i<people.length; i++) {
	    	if (people[i].id == formdata.id) {
			    people[i].name = formdata.name;
			    people[i].twitter = formdata.twitter;
			    people[i].phone = formdata.phone;
			    // Overwrite the storage with the new data
			    localStorage.setItem('people', JSON.stringify(people));
	    		break;
	  		}
		}
	}

	// Delete a contact from out storage
	this.delete = function(id){
		var people = JSON.parse(localStorage.getItem('people'));
		// Simple algorith to get the JSON index to easily remove from our object
		var remove = 0;
		for (var i=0; i<people.length; i++) {
	    	if (people[i].id == id) {
	  			remove = i;
	  		}
		}
		
		people.splice(remove, 1);
		localStorage.setItem('people', JSON.stringify(people));
	}

})