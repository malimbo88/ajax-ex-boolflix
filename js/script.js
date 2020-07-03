//javaScript
//Jquery
$(document).ready( function() {
  //Variabili necessarie a Function searchMovieApi
  var apiKey = "037cb7e7c9242bc9f153448eeeda4619";
  var apiTypeMovie = "movie";
  var apiTypeTvShow = "tv";

  //Evento button click su Search button
  $("button#btn_search").click( function() {
    var apiQuery = $("input#search_movie").val();
    var moviesList = $(".movies_list");
    var errorList = $(".error_list");
    resetHtml (moviesList);
    resetHtml (errorList);
    searchDataApi (apiKey, apiQuery, apiTypeMovie);
    searchDataApi (apiKey, apiQuery, apiTypeTvShow);
  });

  // //Evento keypress enter su Search bar
  // $("input#search_movie").keypress( function() {
  //   if(event.which === 13 || event.keyCode === 13) {
  //     var apiQuery = $("input#search_movie").val()
  //     var moviesList = $(".movies_list")
  //     resetHtml (moviesList);
  //     searchTvApi (apiTvUrl, apiKey, apiQuery);
  //     searchMovieApi (apiMovieUrl, apiKey, apiQuery)
  //   }
  // });

  //Function searchMovieApi
  //I valori sono: key authentication Api,type tipo di contenuto (movie or tv), query Api = al .val input search
  //Consulta Api movieDb e cerca tra i film in disponibili
  function searchDataApi (key, query, type) {
    //Gestisco piu` chiamate in base al type_result
    //Cambiando il type cambia anche url chiamata
    if (type === "movie") {
      url = "https://api.themoviedb.org/3/search/movie";
    }else if (type === "tv") {
      url = "https://api.themoviedb.org/3/search/tv";
    }

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
          if (dataSuccessResults.length === 0 && $("ul.error_list").length === 0) {
            var errorType = "Internal Error"
            var errorMessage = "We are sorry. Your search produced no results in Movies."
            printError (errorType, errorMessage)
          }

          //Nel caso Api in base ai valori di ricerca digitati da utente
          //Produca risultato, stampo i risultati prodotti
          else {
            printData (dataSuccessResults)
          }
        },
        error: function (dataError) {
          //Variabile che riporta il codice numerico di errore fornito da Api
          var apiErrorNumber = dataError.status;

          //Se il codice di errore e` 422
          //In questo caso utente ha lasciato vuota la input bar
          //Se la input bar rimane vacante la Api non puo funzionare
          if (apiErrorNumber === 422 && $(".error_list > *").length === 0) {
            var errorType = "Internal Error"
            var errorMessage = "Maybe the search bar is empty. You must write a text in search field.";
            printError (errorType, errorMessage);
          }

          //In caso di qualsiasi altra tipologia di errore dovuta al server api
          //Riporto un messaggio con il codice di errore riportato da Api
          else if (apiErrorNumber != undefined && $(".error_list > *").length === 0) {
            var errorType = "Sever Error"
            var errorMessage = apiErrorNumber
            printError (errorType, errorMessage);
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
  function printData (array) {
    var index = 0;
    while (index < array.length) {
      var currentMovieObject = array[index];
      var movieTitle = currentMovieObject.title
      var movieOriginalTitle = currentMovieObject.original_title
      var movieTypeResult = "Movie";
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
        type_result: movieTypeResult,
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
    $("ul.error_list").append(html)
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
    var voteAverageHtml = ""
    // numero intero da 1 a 5
    numberInt1to5 = Math.ceil(number1to10 / 2);
    //Il mio counter cicla 5 volte perche` il voto va da 1 a 5
    //Trasformo il valore di media voto espresso in numero in simboli grafici
    //Scrivo html sotto forma di stringhe concatenate rappresentanti 5 icone
    //Le icone saranno vuote o piene a seconda del voto espresso
    for (var count = 0; count < 5; count++) {
      if (count < numberInt1to5) {
        voteAverageHtml += '<i class="fas fa-star ' + 'full_star' + '"></i>';
      }
      else {
        voteAverageHtml += '<i class="fas fa-star"></i>';
      }
    }
    return voteAverageHtml;
  }
  //end Function voteAverageStars

  //Function languageFlag
  //Necessita come attributo di una stringa che rappresenti un linguaggio Iso639-1 es(it, en)
  //Si appoggia al sito web https://www.countryflags.io/
  //Converte quando possibile il linguaggio espresso in Iso639-1 in codice Iso3166-1
  //Coverte la stringa rappresentate la lingua nella img flag corrispondente .png
  //Scrive solo html sotto forma di stringa concatenata e non stampa niente
  //Ritorna una stringa con un tag img compilato html ma non stampato
  function languageFlag (languageIso6391) {
    var countryCodes = {
    "aa": "dj",
    "af": "za",
    "ak": "gh",
    "sq": "al",
    "am": "et",
    "az": "az",
    "bm": "ml",
    "be": "by",
    "bn": "bd",
    "bi": "vu",
    "bs": "ba",
    "bg": "bg",
    "my": "mm",
    "ca": "ad",
    "zh": "cn",
    "hr": "hr",
    "cs": "cz",
    "da": "dk",
    "dv": "mv",
    "nl": "nl",
    "dz": "bt",
    "en": "gb",
    "et": "ee",
    "fj": "fj",
    "fil": "ph",
    "fi": "fi",
    "fr": "fr",
    "gaa": "gh",
    "ka": "ge",
    "de": "de",
    "el": "gr",
    "gu": "in",
    "ht": "ht",
    "he": "il",
    "hi": "in",
    "ho": "pg",
    "hu": "hu",
    "is": "is",
    "ig": "ng",
    "id": "id",
    "ga": "ie",
    "it": "it",
    "ja": "jp",
    "kr": "ne",
    "kk": "kz",
    "km": "kh",
    "kmb": "ao",
    "rw": "rw",
    "kg": "cg",
    "ko": "kr",
    "kj": "ao",
    "ku": "iq",
    "ky": "kg",
    "lo": "la",
    "la": "va",
    "lv": "lv",
    "ln": "cg",
    "lt": "lt",
    "lu": "cd",
    "lb": "lu",
    "mk": "mk",
    "mg": "mg",
    "ms": "my",
    "mt": "mt",
    "mi": "nz",
    "mh": "mh",
    "mn": "mn",
    "mos": "bf",
    "ne": "np",
    "nd": "zw",
    "nso": "za",
    "no": "no",
    "nb": "no",
    "nn": "no",
    "ny": "mw",
    "pap": "aw",
    "ps": "af",
    "fa": "ir",
    "pl": "pl",
    "pt": "pt",
    "pa": "in",
    "qu": "wh",
    "ro": "ro",
    "rm": "ch",
    "rn": "bi",
    "ru": "ru",
    "sg": "cf",
    "sr": "rs",
    "srr": "sn",
    "sn": "zw",
    "si": "lk",
    "sk": "sk",
    "sl": "si",
    "so": "so",
    "snk": "sn",
    "nr": "za",
    "st": "ls",
    "es": "es",
    "ss": "sz",
    "sv": "se",
    "tl": "ph",
    "tg": "tj",
    "ta": "lk",
    "te": "in",
    "tet": "tl",
    "th": "th",
    "ti": "er",
    "tpi": "pg",
    "ts": "za",
    "tn": "bw",
    "tr": "tr",
    "tk": "tm",
    "uk": "ua",
    "umb": "ao",
    "ur": "pk",
    "uz": "uz",
    "ve": "za",
    "vi": "vn",
    "cy": "gb",
    "wo": "sn",
    "xh": "za"
    }//iso639-1 To Iso3166-1
    var languageReturn = "";
    var check = false;
    for (var key in countryCodes) {
      //Se il codice language e` compreso tra le keys del mio oggetto countryCodes
      //Converto il codice language da iso639-1, assegnando il valore corrispondente, in code Iso3166-1
      //Scrivo una stringa convertibile in html per poter stampare .img Flag corrispondente al codice Iso3166-1
      if (key === languageIso6391) {
        languageIso6391 = countryCodes[key];
        //Cambio il valore della variabile check perche` il linguaggio e` stato convertito in iso3166-1
        var check = true;
        //Compilo html img inserendo la stringa language con il code iso3166-1 per richiamare la corretta flag
        var htmlImageFlag =  '<img src="https://www.countryflags.io/' + languageIso6391 + '/flat/64.png">';
        languageReturn = htmlImageFlag;
      }

      //Se il codice language NON e` compreso tra le keys del mio oggetto countryCodes
      //Ritorno il codice iso639-1 originale senza fare alcun intervento di modifica
      else if (check === false) {
        languageReturn = languageIso6391;
      }
    }
    return languageReturn;
  }
  //end Function languageFlag

  //Function emptyTag
  //Verifica che un tag sia vuoto
  //Se il tag e` vuoto torna true
  //Se il tag NON e` vuoto torna false
  //Ritorna un valore booleano
  function isEmpty (tag) {
    if (tag.html() === "") {
      return true;
    }
    else {
      return false;
    }
  }
  //end Function emptyTag
})
//end Jquery
