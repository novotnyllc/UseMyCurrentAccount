
chrome.identity.getProfileUserInfo(function(userInfo) { email = userInfo.email; });

useCurrentAccount = true;

getState(function(state) {
   updateIcon(state);
});

chrome.webRequest.onBeforeRequest.addListener(function(details){
   
   if(useCurrentAccount === true ){
      var url = new URL(details.url);        

      var search = url.searchParams;
      if(!search.has("login_hint")){
         search.append("login_hint", email);
   
         return { redirectUrl: url.toString()};
      }
   }    
},
{urls:["*://login.microsoftonline.com/*/authorize*"]},
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
   var color = state ? [255, 0, 0, 255] : [190, 190, 190, 230];
   var text = state ? 'On' : 'Off';
   chrome.browserAction.setBadgeBackgroundColor({
       color: color
   });
   chrome.browserAction.setBadgeText({
       text: text
   });
}
