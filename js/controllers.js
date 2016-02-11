app = angular.module("main")
.controller("postsController",["$scope","$resource","PostsResource","$filter",function($scope,$resource,PostsResource,$filter){
	Post = PostsResource; // Se injecta el servicio PostsResource
	$("#main").addClass('hide');
	$("#progress").removeClass("hide");
	
	var orderBy = $filter('orderBy');
	var filerBy = $filter('filter');

	$scope.validOptions = ["title","body"]; // Valores por los cuales se pueden ordenar
	$scope.predicate = "title"; // valor de ordenacion por defecto

	$scope.postsPerPage = 2; // Posts que se muestran por pagina
	$scope.currentPage = 1; // Pagina actual

	// Funcion para filtrar la busqueda
	$scope.filter = function(){
		// Si la busqueda esta vacia o el arreglo de posts que paso por algun filtro
		// actualmente esta vacio se debe cargar de nuevo todos los posts
		if($scope.search == "" || $scope.posts.length==0)
		{
			$scope.posts = $scope.allPost;
		}
		$scope.posts = filerBy($scope.posts, $scope.search);// Se filtra el arreglo
		$scope.order(); // Se ordena el array de posts
		$scope.numPageArray = new Array($scope.numPages()); // Se crea un array del tamanio del numero de paginas
		$scope.numPageValor = $scope.numPages(); // Cantidad de paginas
		$scope.changePage(1); // Moverse a la primera pagina
	}

	// Funcion para ordenar el arreglo de posts
	$scope.order = function(){
		$scope.posts = orderBy($scope.posts, $scope.predicate, false);
	}

	// Funcion para moverse entre paginas
	$scope.changePage = function(newPage){
		// Si la pagina nueva es menor que 1 o mayor que la cantidad de paginas
		// o si la cantidad de paginas a mostrar es menor a 1
		if(newPage < 1 || newPage > $scope.numPageValor || $scope.postsPerPage < 1)
			return false;
		// Se agrega un animacion a los posts a menos que se haga una busqueda
		if($scope.search == null || $scope.search == ""){
			if(newPage > $scope.currentPage){
				$("#posts-container").animateCss("slideInRight");
			}
			else{
				$("#posts-container").animateCss("slideInLeft");
			}
		}
		$scope.currentPage = newPage; // Se modifica el valor de pagina actual
		// Se modifica el valor en donde empiezan a mostrarse los posts
		// Ej: a * b - b = b ( a - 1 )
		// newPage = 3
		// $scope.postsPerPage = 5
		// $scope.postsBegin = 3 * 5 - 5 = 10
		$scope.postsBegin = $scope.postsPerPage * (newPage - 1);
	}

	// Funcion para calcular el numero de paginas
	$scope.numPages = function () {
		return Math.ceil($scope.posts.length / $scope.postsPerPage);
	}

	// Funcion para determinar si la pagina actual es la primera pagina
	$scope.isFirstPage = function(){
		return $scope.currentPage == 1;
	}

	// Funcion para determinar si la pagina enviada es la pagina actual
	$scope.isSelect = function(page){
		return $scope.currentPage == page;
	}

	// Funcion para determinar si la pagina actual es la ultima pagina
	$scope.isLastPage = function(){
		return $scope.currentPage == $scope.numPageValor;
	}

	$scope.message = function(){
		suma = $scope.postsBegin + parseInt($scope.postsPerPage);
		if (suma > $scope.posts.length)
			suma = $scope.posts.length;

		return "Displaying "
			+ ($scope.postsBegin + 1)
			+ " - " 
			+ (suma)
			+ " of " 
			+ $scope.posts.length
			+ " results"
	}

	// Metodo para obtener el array de posts a partir de la url
	Post.query(function(data) {
		$scope.allPost = $scope.posts = data; // Se cargan todos los post
		$scope.filter(); // Filtrar los posts
	})

	Post.query().
		$promise.
			then(function(data){
					$("#progress").addClass("hide");
					$("#main").removeClass('hide').animateCss("fadeInUp");
					$scope.allPost = $scope.posts = data; // Se cargan todos los post
				},function(data){
					$("#progress").addClass("hide");
					$("#no-found").removeClass("hide");
				}
			);

}]);