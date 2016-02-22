'use strict';

app.factory('questionsvc', function (FURL, authsvc, $firebaseArray, $firebaseObject) {

    var questionsRef = new Firebase(FURL + '/questions');
    var usersRef = new Firebase(FURL + '/users');

    var questions = $firebaseArray(questionsRef);

    var Question = {
        all: questions,
        questionsRef: questionsRef,
        getQuestion: function (questionId) {
            return getQuestion(questionId);
        },

        createQuestion: function (question) {
            question.starcount = 0;
            question.datetime = Firebase.ServerValue.TIMESTAMP;
            return questions.$add(question);
        },
        getUserVotes: function (questionId) {
            return getUserVotes(questionId);
        },
        updatevote: function(question) {
            return updatevote(question);
        },

        upvote: function(question) {
            return upvote(question);
        },

        initialize: function(questions) {
            //if not logged in
            if (authsvc.user.uid == undefined) {
                setStarsWhenLoggedOut(questions);
                return;
            }

            //when logged in
            setStarsAfterLogin(questions);

        }

    };

    function setStarsWhenLoggedOut(questions) {
        angular.forEach(questions, function (q) {
            q.class = "";
        });
    }

    function setStarsAfterLogin(questions) {
        angular.forEach(questions, function (q) {

            var vote = $firebaseObject(Question.getUserVotes(q.$id));

            vote.$loaded().then(function () {
                q.class = vote.$value == true ? q.class = "fa-star starred" : q.class = "";
            });

        });
    }

    function getQuestion(questionId) {
        return $firebaseObject(questionsRef.child(questionId));
    }

    function getUserVotes(questionId) {
        return usersRef.child(authsvc.user.uid).child('votes').child(questionId);
    }

    //Update UI when the stars are toggled ( callback when the server sends updates )
    function updatevote(question) {
        var starred = false;
        if (authsvc.user.uid == undefined) return;
        var vote = $firebaseObject(getUserVotes(question.$id));

        vote.$loaded().then(function () {
            var qRef = getQuestion(question.$id);

            qRef.$loaded().then(function () {

                starred = (vote.$value == null) ? false : vote.$value;

                if (starred == true) {
                    qRef.starcount = ++question.starcount;

                    questions.$getRecord(question.$id).class = 'fa-star starred';
                } else {
                    qRef.starcount = --question.starcount;

                    questions.$getRecord(question.$id).class = '';
                }

            });

        });
    }

    function upvote(question) {
        var starred = false;
        if (authsvc.user.uid == undefined)return;
        var vote = $firebaseObject(getUserVotes(question.$id));

        vote.$loaded().then(function () {
            var qRef = getQuestion(question.$id);

            //toggle the star selection
            qRef.$loaded().then(function () {

                starred = (vote.$value == null) ? false : vote.$value;

                var newValue = !starred;

                getUserVotes(question.$id).set(newValue);

                if (newValue == true) {
                    qRef.starcount = ++question.starcount;
                    qRef.$save();

                    questions.$getRecord(question.$id).class = 'fa-star starred';
                } else {
                    qRef.starcount = --question.starcount;
                    qRef.$save();

                    questions.$getRecord(question.$id).class = '';
                }

            });

        });
    }

    return Question;

});