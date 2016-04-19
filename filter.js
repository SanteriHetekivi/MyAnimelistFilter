/**
 * Working
 *  http://myanimelist.net
 *  http://www.mangareader.net
 *  http://www.mangahere.co
 *  http://kissmanga.com
 *  http://www.mangaeden.com
 *  http://bato.to
 *  http://mangapark.me
 *  http://mangafox.me
 */
(function($) 
{
    String.prototype.clean = function () {
        return this.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    };
    /**
     * Function filter
     * for filtering
     */
    function filter()
    {
        console.log("Filtering...");
        var text = "";
        var locator = getLocator();
        if(mangaList != null && Object.prototype.toString.call( mangaList ) === '[object Array]')
        {
            $(locator.all).each(function(index,Element){
                if(trimNames) text=$(Element).text().clean();
                else text=$(Element).text().trim();
                var i = $.inArray(text,mangaList);
                if(i != -1){
                    if(hidden) $(Element).closest(locator.closest).show();
                    else $(Element).closest(locator.closest).hide();
                    console.log(text);
                }
            });
            console.log("Filtering done!");
        }
        else console.error("Filtering failed! Given mangaList was not array!");
    }

    function getLocator()
    {
        var locator = { all:"td a", closest: "tr"};
        if(url.indexOf("mangareader") != -1) locator = { all:".manga_name a", closest: ".mangaresultitem"};
        else if(url.indexOf("mangahere") != -1) locator = { all:".result_search dt a", closest: "dl"};
        return locator;
    }

    filter();

})(jQuery);