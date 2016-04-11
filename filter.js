
(function($) 
{
  var mangaList = [];

  function createCORSRequest(method, url)
  {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr){
          xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined"){
          xhr = new XDomainRequest();
          xhr.open(method, url);
      } else {
          xhr = null;
      }
      return xhr;
  }
      
  function getMangaList()
  {
          
    var url = "ULRL_TO_XML";
    var request = createCORSRequest( "get", url );
    if ( request ){
        request.onload = function(){parseMangaList(request.responseText);};
        request.send();
    }
  }
  function parseMangaList(list)
  {
    mangaList = [];
    $("manga", list).each(function() {
        if(parseInt($('series_status', this).text().trim()) != 6)
        {
            mangaList.push($('series_title', this).text().trim());
            $.merge(mangaList, $('series_synonyms', this).text().trim().split("; "));
        }
    });
    mangaList = mangaList.filter(Boolean);
    $('table td:first-child').each(function(index,Element){
        var tdValue=$(Element).text().trim();
        var i = $.inArray(tdValue,mangaList);
        if(i != -1){
            if(hidden) $(Element).closest('tr').show();
            else $(Element).closest('tr').hide();
            console.log(tdValue);
        }
    });
  
  }

  getMangaList();

})(jQuery);