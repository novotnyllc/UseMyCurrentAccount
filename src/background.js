
chrome.identity.getProfileUserInfo(function(userInfo) { email = userInfo.email; });

chrome.webRequest.onBeforeRequest.addListener(function(details){
           //details.url has the URL

           var url = new URL(details.url);        
           
           var search = url.searchParams;
           if(!search.has("login_hint")){
               search.append("login_hint", email);

               return { redirectUrl: url.toString()};
           }
        },
        {urls:["*://login.microsoftonline.com/*/authorize*"]},
        ["blocking"]
        );

