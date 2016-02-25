'use strict';

app.factory("authsvc", function (FURL, $firebaseAuth, $firebaseObject) {
    var ref = new Firebase(FURL);
    var auth = $firebaseAuth(ref);

    var Auth = {
        auth:auth,
        user: {},
        login: function () {
            return auth.$authWithOAuthPopup("facebook")
        },
        logout: function () {
            auth.$unauth();
        },
        signedIn: function () {
            return !!Auth.user.provider;
        },
        getUserProfile: function(authData) {
            return getUserProfile(authData);
        }
    };

    auth.$onAuth(function (authData) {
        if (authData) {
            angular.copy(authData, Auth.user);
            
            var userProfile = ref.child('users').child(authData.uid);
            
            userProfile.once("value", function(snapshot){
                if(!snapshot.exists()){
                    userProfile = getUserProfile(authData);
                    ref.child("users").child(authData.uid).set(userProfile);
                }
                Auth.user.profile = $firebaseObject(ref.child('users').child(authData.uid));
            });
     
        } else {
            if (Auth.user && Auth.user.profile) {
                Auth.user.profile.$destroy();
            }
            angular.copy({}, Auth.user);
        }
    });

    function getUserProfile (authData) {
        if (authData == null)
            return { "provider": "", "name": "", "image": "" };
        var profile = {
            "provider": authData.provider,
            "name": authData.facebook.displayName,
            "image": authData.facebook.profileImageURL
        };
        return profile;
    }

    return Auth;
});