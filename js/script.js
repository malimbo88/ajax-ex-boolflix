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
          console.log(dataSuccessResults)
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
      var movieLanguageFlag = languageFlag (movieOriginalLanguage)
      var movieVoteAverageNumber = currentMovieObject.vote_average
      var movieVoteAverageStars = voteAverageStars (movieVoteAverageNumber)

      //Handlebars
      var source = $("#template_movie").html();
      var template = Handlebars.compile(source);

      //Creo oggetto per compilazione Handelbars
      var context = {
        title: movieTitle,
        original_title: movieOriginalTitle,
        original_language: movieLanguageFlag,
        vote_average: movieVoteAverageStars
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

  //Function voteAverageStars
  //Necessita come attributo di un numero decimale da 1 a 10
  //Trasforma il voto da 1 a 10 decimale in un numero intero da 1 a 5
  //Arrotonda sempre per eccesso all’unità successiva
  //così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5
  //Le stelle sono piene o vuote a seconda del voteAverage. Mai piene in parte
  //Ritorna una stringa con 5 tag i concatenati
  function voteAverageStars (number1to10) {
    var message = ""
    number1to5Int = Math.ceil(number1to10 / 2); // numero intero da 1 a 5

    //Se il voto medio e` uguale a 0
    //Creo un messaggio per informare utente che non ci sono voti per questo titolo
    if (number1to5Int === 0) {
      message = "<span>There are no votes for this title</span>"
    }

    //Se il voto e` superiore a 0
    //Trasformo il valore di media voto espresso in numero in simboli grafici
    //Per il momento mi limito a scrivere html sotto forma di stringhe concatenate
    else {
      var fullStars = "";
      for (var counterFullStars = 0; counterFullStars < number1to5Int; counterFullStars++) {
        var singleFullStar = '<i class="fas fa-star ' + 'full_star' + '"></i>';
        message += singleFullStar;
      }
      var emptyStars = "";
      for(var counterEmptyStars = number1to5Int; counterEmptyStars < 5; counterEmptyStars++) {
        var singleEmptyStar = '<i class="fas fa-star"></i>';
        message += singleEmptyStar;
      }
    }
    return message
  }
  //end Function voteAverageStars

  //Function languageFlag
  //Necessita come attributo di una stringa che rappresenti un linguaggio es(it, en)
  //Si appoggia al sito web https://www.countryflags.io/
  //Coverte la stringa rappresentate la lingua nella img flag corrispondente .png
  //Scrive solo html sotto forma di stringa concatenata e non stampa niente
  //Ritorna una stringa con un tag img compilato html ma non stampato
  function languageFlag (language) {
    //Corrego incongruenze tra versione Iso e linguaggio utilizzato da www.countryflags.io
    if (language === "en") {
      language = "us";
    }else if (language === "da") {
      language = "dk";
    }else if (language === "cs") {
      language = "cz"
    }

    //Compilo html img inserendo il riferimento al language code per richiamare la corretta flag
    var flagImg =  '<img src="https://www.countryflags.io/' + language + '/flat/64.png">'
    return flagImg
  }
  //end Function languageFlag

})
//end Jquery
