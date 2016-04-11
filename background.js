var hidden = false;
var url = "";
var mangaList = [];

var hidden = {};

function load(name, def)
{
  var item = JSON.parse(localStorage.getItem(name));
  if(item === null) item = def;
  return item;
}

function getMangaList()
{
  return load("mangaList", []);
}

function getSites()
{
  return load("sites", []);
}

function filter()
{
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs)
  {
    var tab = tabs[0];
    if(notChromeTab(tab) && tab.id != null && tab.url != null) {
      url = tab.url;
        chrome.tabs.executeScript(tab.id, { file: "libs/jquery.js" },
            function()
            {
              chrome.tabs.executeScript(tab.id, {code: 'var hidden = '+hidden[tab.id]+'; var mangaList = '+JSON.stringify(mangaList)+'; var url = "'+url+'";'},
                  function()
                  {
                    hidden[tab.id] = !hidden[tab.id];
                    chrome.tabs.executeScript(tab.id, { file: "filter.js" });
                  }
              );
            }
        );
    }
  });

}

function newPage(tab)
{

  if(notChromeTab(tab) && tab.id != null && tab.url != null)
  {
    hidden[tab.id] = false;
    url = tab.url;
    var sites = getSites();
    mangaList = getMangaList();
    if(mangaList.length > 0)
    {
      chrome.browserAction.enable(tab.id);
      if(sites.length > 0 )
      {
         if (new RegExp(sites.join("|")).test(url)) {
           filter();
          }
      }
    }
    else chrome.browserAction.disable(tab.id);
  }
}

chrome.browserAction.onClicked.addListener(filter);

chrome.tabs.onUpdated.addListener(function (id, info, tab) 
{
  if (info.status == 'complete' && notChromeTab(tab)) {
    newPage(tab);
  }
});

chrome.tabs.onCreated.addListener(function (tab) 
{
  newPage(tab);
});

function notChromeTab(tab)
{
  if(tab != null && tab.url != null)
  {
    return (tab.url.indexOf("chrome:") < 0);
  }
  return false;
}