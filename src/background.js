
chrome.identity.getProfileUserInfo(function(userInfo) { email = userInfo.email; });

useCurrentAccount = true;

getState(function(state) {
   updateIcon(state);
});

chrome.webRequest.onBeforeRequest.addListener(function(details){
   
   if(useCurrentAccount === true ){
      var url = new URL(details.url);        

      var search = url.searchParams;
      if(!search.has("login_hint") && !search.has("sid")){
         search.append("login_hint", email);
   
         return { redirectUrl: url.toString()};
      }
   }    
},
{urls:["*://login.microsoftonline.com/*/authorize*"]},
["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(function(details){
   
   if(useCurrentAccount === true ){
      var url = new URL(details.url);        

      var search = url.searchParams;
      if(!search.has("whr")) {

         var domain = email.split('@').pop()
         search.append("whr", domain);
   
         return { redirectUrl: url.toString()};
      }
   }    
},
{urls:["*://login.microsoftonline.com/*/saml2*",
       "*://login.microsoftonline.com/*/wsfed*"]},
["blocking"]
);

function setState(state){
   useCurrentAccount = state;
   chrome.storage.local.set({
      state: state
  });
}

function getState(callback) {
   chrome.storage.local.get('state', function(data) {
      if(data.state === undefined) {
         useCurrentAccount = true;
      }
      else{
         useCurrentAccount = data.state;
      }

      callback(useCurrentAccount);
   });
}

getState(function(state) {
   updateIcon(state);
});

chrome.browserAction.onClicked.addListener(function() {
   getState(function(state) {
       var newState = !state;
       updateIcon(newState);
       setState(newState);
   });
});

function updateIcon(state) {
   var color = [255, 0, 0, 255];
   var text = state ? '' : 'Off';
   chrome.browserAction.setBadgeBackgroundColor({
       color: color
   });

   chrome.browserAction.setBadgeText({
       text: text
   });
}
