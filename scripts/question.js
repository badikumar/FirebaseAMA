'use strict';

app.controller('QuestionController', function ($scope, authsvc, questionsvc) {

    $scope.questions = questionsvc.all;

    initialize();

    function initialize() {
        $scope.questions.$loaded().then(function (questions) {
            $scope.questions.sort(compare);
            questionsvc.initialize(questions);
        });
    }
    
    $scope.setSelectedQuestion = function (question) {
        $scope.selectedQuestion = question;
    };


    $scope.postQuestion = function (question) {
        if (question != undefined) {
            questionsvc.createQuestion(question).then(function() {
                question.text = '';
            });
        }
    };

    $scope.login = function () {
        authsvc.login();
    }

    $scope.signedIn = function () {
        return authsvc.signedIn();
    }

    authsvc.auth.$onAuth(function () {
        initialize();
    });

    //Listen to real-time events
    questionsvc.questionsRef.on("child_changed", function (snapshot) {
        var q = snapshot.val();
        q.$id = snapshot.key();

        questionsvc.updatevote(q);
    });


    $scope.upvote = function(question) {
        questionsvc.upvote(question);
    }

    // each time the server sends records, re-sort
    $scope.questions.$watch(function() {
         $scope.questions.sort(compare);
    });

    // custom sorting routine (sort by star count)
    function compare(a, b) {
        var ret =  b.starcount - a.starcount ;
        if(ret == 0){
            ret = a.datetime - b.datetime;
        }
        return ret;
    }
    
    $scope.showaddbutton = false; 

});