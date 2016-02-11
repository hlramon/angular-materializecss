var app = angular.module("main",["ngResource"])
.service("PostsResource",["$resource",function($resource){
	return $resource("http://jsonplaceholder.typicode.com/posts/:id",{id: "@id"})
}]);