//javaScript
//Jquery
$(document).ready( function() {
  //Variabili necessarie a Function searchMovieApi
  var apiMovieUrl = "https://api.themoviedb.org/3/search/movie"
  var apiKey = "037cb7e7c9242bc9f153448eeeda4619";

  //Evento button click su Search button
  $("button#btn_search").click( function() {
    var apiQuery = $("input#search_movie").val()
    var moviesList = $(".movies_list")
    resetHtml (moviesList);
    searchMovieApi (apiMovieUrl, apiKey, apiQuery);
  });

  //Evento keypress enter su Search bar
  $("input#search_movie").keypress( function() {
    if(event.which === 13 || event.keyCode === 13) {
      var apiQuery = $("input#search_movie").val()
      var moviesList = $(".movies_list")
      resetHtml (moviesList);
      searchMovieApi (apiMovieUrl, apiKey, apiQuery)
    }
  });

  //Function searchMovieApi
  //I valori sono url Api, key authentication Api, query Api = al .val input search
  //Consulta Api movieDb e cerca tra i film in disponibili
  function searchMovieApi (url, key, query) {
    //Ajax Call
    $.ajax(
      {
        url: url,
        method: "GET",
        data: {
          api_key: key,
          query: query,
          language: "en"
        },
        success: function (dataSuccess) {
          //Variabile che indica un Array di oggetti fornito da Api
          //Ogni oggetto rappresenta un Film
          var dataSuccessResults = dataSuccess.results;

          //Nel caso Api in base ai valori di ricerca digitati da utente
          //Non produca alcun risultato, stampo un messaggio di errore
          if (dataSuccessResults.length === 0) {
            var errorType = "Internal Error"
            var errorMessage = "We are sorry. Your search produced no results."
            printError (errorType, errorMessage)
          }

          //Nel caso Api in base ai valori di ricerca digitati da utente
          //Produca risultato, stampo i risultati prodotti
          else {
            printMovies (dataSuccessResults)
          }
        },
        error: function (dataError) {
          console.log(apiErrorNumber)
          //Variabile che riporta il codice numerico di errore fornito da Api
          var apiErrorNumber = dataError.status;

          //Se il codice di errore e` 422
          //In questo caso utente ha lasciato vuota la input bar
          //Se la input bar rimane vacante la Api non puo funzionare
          if (apiErrorNumber === 422) {
            var errorType = "Internal Error"
            var errorMessage = "Maybe the search bar is empty. You must write a text in the search field."
            printError (errorType, errorMessage)
          }

          //In caso di qualsiasi altra tipologia di errore dovuta al server api
          //Riporto un messaggio con il codice di errore riportato da Api
          else if (apiErrorNumber != undefined) {
            var errorType = "Sever Error"
            var errorMessage = apiErrorNumber
            printError (errorType, errorMessage)
          }
        }
      }
    );
    //end Ajax Call
  }
  //end Function searchMovieApi

  //Function printMovies
  //Cerca tra tutti gli oggetti di un Array
  //Per ogni oggetto legge i valori delle chiavi necessarie
  //Stampa i valori trovati con Handlebars
  function printMovies (array) {
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

      //Appendo tag Handlebars compilato nel Dom
      $("ul.movies_list").append(html)

      index++
    }
  }
  //end Function printMovies

  //Function Reset
  //Gli passo come attributo un tag html dal Dom
  //Fa il reset del tag html passato svuotandolo del suo contenuto
  function resetHtml (tagHtml) {
    tagHtml.html("");
  }
  //end Function Reset

  //Function printError
  //Stampa a schermo un messaggio di errore
  function printError (errorType, errorMessage) {
    //Handlebars
    var source = $("#template_error").html();
    var template = Handlebars.compile(source);

    //Creo oggetto per compilazione Handelbars
    var context = {
      error_type: errorType,
      error_text: errorMessage
    };

    //Compilazione Handlebars
    var html = template(context);

    //Appendo tag Handlebars compilato nel Dom
    $("ul.movies_list").append(html)
  }
  //end Function printError

})
//end Jquery
