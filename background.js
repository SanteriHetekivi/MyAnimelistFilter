var hidden = false;

var supportedUrls = [
  "http://mangafox.me/search.php"
  ];

function filter()
{
  chrome.tabs.executeScript(null, { file: "libs/jquery.js" }, 
    function() 
    {
      chrome.tabs.executeScript(null, {code: 'var hidden = '+hidden+';'}, 
        function()
        {
          hidden = !hidden;
          chrome.tabs.executeScript(null, { file: "filter.js" });
        }
      );
    }
  );
}

function newPage(url)
{
  hidden = false;

  if (new RegExp(supportedUrls.join("|")).test(url)) 
  {
    filter();
  }
}

chrome.browserAction.onClicked.addListener(filter);

chrome.tabs.onUpdated.addListener(function (id, info, tab) 
{
  if (info.status == 'complete') {
    newPage(tab.url);
  }
});

chrome.tabs.onCreated.addListener(function (tab) 
{
  newPage(tab.url);
});