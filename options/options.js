/**
 * Created by Santeri on 11.4.2016.
 */


var username = "";
var mangaList = [];
var sites = [];

const MY_ANIME_LIST_USERNAME  = "MyAnimeListUsername";
const MANGA_LIST              = "mangaList";
const MANGA_TABLE             = "mangaTable";
const MANGA_LIST_LINK         = "MangaListLink";
const SITES                   = "sites";
const ADD_SITE                = "addSite";
const ADD_FORM                = "addSiteForm";
const CLEAR_MANGA_LIST        = "clearMangaList";


init();

document.getElementById(MANGA_LIST).addEventListener("change", saveMangaList, false);
document.getElementById(MY_ANIME_LIST_USERNAME).addEventListener("change", saveMyAnimeListUsername, false);
document.getElementById(ADD_FORM).addEventListener("submit", addSite, false);
document.getElementById(CLEAR_MANGA_LIST).addEventListener("click", clearMangaList, false);

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        this[i].trim();
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function clearMangaList()
{
    mangaList = [];
    save(MANGA_LIST, mangaList);
    makeMangaTable();
}

function saveMangaList(e)
{
    var files = e.target.files;
    var reader = new FileReader();
    reader.onload = function() {
        var parsed = new DOMParser().parseFromString(this.result, "text/xml");
        parseMangaList(parsed);
    };
    reader.readAsText(files[0]);
}

function addSite()
{
    var site = document.getElementById(ADD_SITE).value;
    sites.push(site);
    save(SITES, sites);
    makeSites();
}


function removeSite(site)
{
    var index = sites.indexOf(site);
    if (index > -1) {
        sites.splice(index, 1);
        save(SITES, sites);
        makeSites();
    }
}

function makeSites()
{
    var $table = $( "<table></table>" );
    var $row = $( "<tr></tr>" );
    var site = "";
    var button = "";
    for ( var i = 0; i < sites.length; i++ ) {
        $row = $( "<tr></tr>" );
        site = sites[i];
        button = "<button id='"+site+"'>"+chrome.i18n.getMessage("Remove")+"</button>";
        $row.append( $( "<td></td>" ).html( site ) );
        $row.append( $( "<td></td>" ).html( button ) );
        $table.append($row);
    }
    document.getElementById(SITES).innerHTML = "";
    $table.appendTo( $( "#"+SITES+"" ) );
    for (i = 0; i < sites.length; i++ ) {
        const site = sites[i];
        document.getElementById(site).addEventListener("click", function () {
            removeSite(site);
        }, false);
    }
}

function saveMyAnimeListUsername()
{
    username = document.getElementById(MY_ANIME_LIST_USERNAME).value;
    save(MY_ANIME_LIST_USERNAME, username);
    setMangaListLink()
}

function parseMangaList(list)
{
    var newMangaList = [];
    $("manga", list).each(function() {
        if(parseInt($('series_status', this).text().trim()) != 6)
        {
            newMangaList.push($('series_title', this).text().trim());

            $.merge(newMangaList, $('series_synonyms', this).text().trim().split("; "));
        }
    });
    newMangaList = newMangaList.clean("");
    if(newMangaList.length > 0)
    {
        mangaList = newMangaList;
        save(MANGA_LIST, mangaList);
        makeMangaTable();
    }
}

function makeMangaTable()
{
    var $table = $( "<table class='.table-condensed' ></table>" );
    var $row = $( "<tr></tr>" );
    var counter = 0;
    for ( var i = 0; i < mangaList.length; i++ ) {
        ++counter;
        if(counter >= 5)
        {
            $table.append( $row );
            $row = $( "<tr></tr>" );
            counter = 0;
        }
        var title = mangaList[i];
        $row.append( $( "<td></td>" ).html( title ) );
    }
    document.getElementById(MANGA_TABLE).innerHTML = "";
    $table.appendTo( $( "#"+MANGA_TABLE+"" ) );
}

function save(name, value)
{
    localStorage.setItem(name, JSON.stringify(value));
}

function load(name, def)
{
    var item = JSON.parse(localStorage.getItem(name));
    if(item === null) item = def;
    return item;
}

function setMangaListLink()
{
    var url = "http://myanimelist.net/malappinfo.php?u="+username+"&status=all&type=manga";
    document.getElementById(MANGA_LIST_LINK).innerHTML = "<a href='"+url+"' id='MangaListLink'>"+url+"</a>";
}

function init()
{
    mangaList = load(MANGA_LIST, []);
    sites = load(SITES, []);
    username = load(MY_ANIME_LIST_USERNAME, "UserName");
    document.getElementById(MY_ANIME_LIST_USERNAME).value = username;
    setMangaListLink();
    makeSites();
    makeMangaTable();
}

document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.getElementsByTagName('*'), function (el) {
        if ( el.hasAttribute('data-i18n') ){
            var tranlation = chrome.i18n.getMessage(el.getAttribute('data-i18n'));
            el.innerHTML = tranlation;
        }
    });
});