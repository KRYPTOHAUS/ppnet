function PostingController($scope){

	
	/*
	 *  INIT VARS
	 */
	$scope.posting={};
	$scope.posting_functions={};
	$scope.postings={};
	
	$scope.apply 	= function() {if(!$scope.$$phase) {$scope.$apply();}};
	$scope.time = function(timestamp) {timestamp=timestamp/1000;return timestamp;};
	
	$scope.db.changes({
					  since:  'latest',
					  continuous: true,
					  include_docs: true,
					  onChange:  function(change) {
					  	 onChange(change);
					  },
					  complete: function(err, response) {
					  	 onComplete();
					  }
	});


	/*
	 *  JEDES MAL EIN KOMPLETTER DB-SELECT? Uncool!
	 */
	function onChange(change){
		$scope.posting_functions.showPostings();
		
	}
	
	function onComplete(){
		$scope.posting_functions.showPostings();
	}
	
	
	
	$scope.posting_functions.create = function(){		
		doc={ 
			created : new Date().getTime(),
			msg: document.getElementById('new-posting').value,
			user: {
				id : $scope.user.getId(),
				name : $scope.user.getName()
			},
			type : 'POST'
		};	
		$scope.db.post(doc, function (err, response) {});
		document.getElementById('new-posting').value = '';
	};

	
	$scope.posting_functions.delete = function(posting) {
		$scope.db.get(posting.id, function(err, results) {
			$scope.db.remove(results, function(err, results){});
		});
		
		
	};
	
	$scope.posting_functions.showPostings = function() {
		$scope.db.allDocs({include_docs: true, descending: true}, function(err, docs) {
			$scope.postings=docs.rows;
			$scope.apply();
	    });	
    };
    
    $scope.posting_functions.orderByCreated = function(posting) {
    	if(posting.created)
    		return posting.created;
    	else
    		return posting.doc.created;
	};

	 $scope.posting_functions.isDeletable = function(posting) {
	 	if(posting.doc.user.id == $scope.user.getId())
	 		return true;
	 	return false;
	 };
	 

}