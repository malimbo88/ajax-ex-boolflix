//javaScript
//Jquery
$(document).ready( function() {
  //Variabili necessarie a Function searchMovieApi
  var apiUrl = "https://api.themoviedb.org/3/search/movie"
  var apiKey = "037cb7e7c9242bc9f153448eeeda4619";

  //Evento button click su Search button
  $("button#btn_search").click( function() {
    var apiQuery = $("input#search_movie").val()
    searchMovieApi (apiUrl, apiKey, apiQuery)
  });

  //Evento keypress enter su Search bar
  $("input#search_movie").keypress( function() {
    if(event.which === 13 || event.keyCode === 13) {
      var apiQuery = $("input#search_movie").val()
      searchMovieApi (apiUrl, apiKey, apiQuery)
    }
  });

  //Function searchMovieApi
  //I valori sono url Api, key authentication Api, .val() della input search
  //Consulta Api movieDb e cerca tra i film in disponibili
  function searchMovieApi (url, key, query) {
    $.ajax(
      {
        url: url,
        method: "GET",
        data: {
          api_key: key,
          query: query,
          language: "en"
        },
        success: function(dataSuccess) {
          //Variabile che indica un Array di oggetti fornito da Api
          //Ogni oggetto rappresenta un Film
          var dataSuccessResults = dataSuccess.results;
          console.log(dataSuccessResults)
          printMovies(dataSuccessResults)
        },
        error: function(dataError) {
          alert("Error: " + dataError.status)
        }
      }
    );
  }
  //end Function searchMovieApi

  //Function printMovies
  //Cerca tra tutti gli oggetti di un Array
  //Per ogni oggetto legge i valori delle chiavi necessarie
  //Stampa i valori trovati con Handlebars
  function printMovies(array) {
    $("ul.movies_list > li").remove()
    var index = 0;
    while (index < array.length) {
      var currentMovieObject = array[index];
      var movieTitle = currentMovieObject.title
      var movieOriginalTitle = currentMovieObject.original_title
      var movieOriginalLanguage = currentMovieObject.original_language
      var movieVoteAverage = currentMovieObject.vote_average

      //Handlebars
      var source = $("#template_movie").html();
      var template = Handlebars.compile(source);

      //Creo oggetto per compilazione Handelbars
      var context = {
        title: movieTitle,
        original_title: movieOriginalTitle,
        original_language: movieOriginalLanguage,
        vote_average: movieVoteAverage
      };

      //Compilazione Handlebars
      var html = template(context);
      console.log(html)

      //Appendo tag Handlebars compilato nel Dom
      $("ul.movies_list").append(html)

      index++
    }

  }
  //end Function printMovies
})
//end Jquery
