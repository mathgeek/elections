'use strict';

angular.module('electionsApp.results', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/results', {
    templateUrl: 'results/results.html'
  });
}])

.controller('resultsCtrl', ['presResultsService', 'senResultsService', 'repResultsService', 'bopResultsService', '$timeout', '$q', function(presResultsService, senResultsService, repResultsService, bopResultsService, $timeout, $q) {
  var ctrl = this;
  ctrl.loaded = false;

  var allPresStates = [
    {code:'AL',ecVotes:9},
    {code:'AK',ecVotes:3},
    {code:'AZ',ecVotes:11},
    {code:'AR',ecVotes:6},
    {code:'CA',ecVotes:55},
    {code:'CO',ecVotes:9},
    {code:'CT',ecVotes:7},
    {code:'DE',ecVotes:3},
    {code:'DC',ecVotes:3},
    {code:'FL',ecVotes:29},
    {code:'GA',ecVotes:16},
    {code:'HI',ecVotes:4},
    {code:'ID',ecVotes:4},
    {code:'IL',ecVotes:20},
    {code:'IN',ecVotes:11},
    {code:'IA',ecVotes:6},
    {code:'KS',ecVotes:6},
    {code:'KY',ecVotes:8},
    {code:'LA',ecVotes:8},
    {code:'ME',ecVotes:4},
    {code:'MD',ecVotes:10},
    {code:'MA',ecVotes:11},
    {code:'MI',ecVotes:16},
    {code:'MN',ecVotes:10},
    {code:'MS',ecVotes:6},
    {code:'MO',ecVotes:10},
    {code:'MT',ecVotes:3},
    {code:'NE',ecVotes:5},
    {code:'NV',ecVotes:6},
    {code:'NH',ecVotes:4},
    {code:'NJ',ecVotes:14},
    {code:'NM',ecVotes:5},
    {code:'NY',ecVotes:29},
    {code:'NC',ecVotes:15},
    {code:'ND',ecVotes:3},
    {code:'OH',ecVotes:18},
    {code:'OK',ecVotes:7},
    {code:'OR',ecVotes:7},
    {code:'PA',ecVotes:20},
    {code:'RI',ecVotes:4},
    {code:'SC',ecVotes:9},
    {code:'SD',ecVotes:3},
    {code:'TN',ecVotes:11},
    {code:'TX',ecVotes:38},
    {code:'UT',ecVotes:6},
    {code:'VT',ecVotes:3},
    {code:'VA',ecVotes:13},
    {code:'WA',ecVotes:12},
    {code:'WV',ecVotes:5},
    {code:'WI',ecVotes:10},
    {code:'WY',ecVotes:3}];
  var senStates = ['TX','NC'];
  var repStates = ['TX','NC','KS'];
  var repRaces = {'KS2': true, 'TX21': true};

  loadResults();

  function loadResults() {
    var presPromises = [];
    var senPromises = [];
    var repPromises = [];
    var bopPromises = [];
    var presTempResults = [];
    var senTempResults = [];
    var repTempResults = [];
    var presBopTempResults = {};
    var senBopTempResults = {};
    var repBopTempResults = {};
    angular.forEach(allPresStates, function(state){
      var code = state.code;
      var promise = presResultsService.get({state: code}).$promise;
      presPromises.push(promise);
      promise.then(function(resp) {
        var cand1 = resp.candidates[0];
        var cand2 = resp.candidates[1];
        presTempResults.push({
          ecVotes: state.ecVotes,
          raceCode: state,
          state: resp.stateName,
          raceToWatch: resp.raceToWatch,
          totalVote: resp.totalVote,
          pctReporting: resp.percentReporting,
          cand1: {
            name: cand1.fullName,
            vote: cand1.voteStr,
            votePct: cand1.votePercentStr,
            candidatePartyCode: cand1.candidatePartyCode,
            winner: cand1.winner
          },
          cand2: {
            name: cand2.fullName,
            vote: cand2.voteStr,
            votePct: cand2.votePercentStr,
            candidatePartyCode: cand2.candidatePartyCode
          }
        });
      });
    });
    angular.forEach(senStates, function(state){
      var promise = senResultsService.get({state: state}).$promise;
      senPromises.push(promise);
      promise.then(function(resp) {
        var cand1 = resp.candidates[0];
        var cand2 = resp.candidates[1];
        senTempResults.push({
          raceCode: state,
          state: resp.stateName,
          totalVote: resp.totalVote,
          pctReporting: resp.percentReporting,
          cand1: {
            name: cand1.fullName,
            vote: cand1.voteStr,
            votePct: cand1.votePercentStr,
            candidatePartyCode: cand1.candidatePartyCode,
            winner: cand1.winner
          },
          cand2: {
            name: cand2.fullName,
            vote: cand2.voteStr,
            votePct: cand2.votePercentStr,
            candidatePartyCode: cand2.candidatePartyCode
          }
        });
      });
    });
    angular.forEach(repStates, function(state){
      var promise = repResultsService.query({state: state}, {isArray: true}).$promise;
      repPromises.push(promise);
      promise.then(function(resp) {
        angular.forEach(resp, function(race) {
          var cand1 = race.candidates[0];
          var cand2 = race.candidates[1];
          var raceCode = state + race.jurisdictionCode;
          if (repRaces[raceCode]) {
            repTempResults.push({
              raceCode: raceCode,
              state: race.stateName,
              totalVote: race.totalVote,
              pctReporting: race.percentReporting,
              cand1: {
                name: cand1.fullName,
                vote: cand1.voteStr,
                votePct: cand1.votePercentStr,
                candidatePartyCode: cand1.candidatePartyCode,
                winner: cand1.winner
              },
              cand2: {
                name: cand2.fullName,
                vote: cand2.voteStr,
                votePct: cand2.votePercentStr,
                candidatePartyCode: cand2.candidatePartyCode
              }
            });
          }
        });
      });
    });
    var presBopPromise = bopResultsService.get({race: 'PG'}).$promise;
    bopPromises.push(presBopPromise);
    presBopPromise.then(function(resp) {
      var cand1EV = resp.electoralVotes.candidates[0];
      var cand2EV = resp.electoralVotes.candidates[1];
      var cand1 = resp.results.candidates[0];
      var cand2 = resp.results.candidates[1];
      var candDEV = cand1EV.partyAbbreviation === 'D' ? cand1EV : cand2EV;
      var candREV = cand1EV.partyAbbreviation === 'R' ? cand1EV : cand2EV;
      var candD = cand1.candidatePartyCode === 'D' ? cand1 : cand2;
      var candR = cand1.candidatePartyCode === 'R' ? cand1 : cand2;
      presBopTempResults.candD = {
        name: candD.fullName,
        vote: candD.voteStr,
        votePct: candD.votePercentStr,
        candidatePartyCode: candD.candidatePartyCode,
        ec: candDEV.votes
      };
      presBopTempResults.candR = {
        name: candR.fullName,
        vote: candR.voteStr,
        votePct: candR.votePercentStr,
        candidatePartyCode: candR.candidatePartyCode,
        ec: candREV.votes
      };
    });
    var senBopPromise = bopResultsService.get({race: 'SG'}).$promise;
    bopPromises.push(senBopPromise);
    senBopPromise.then(function(resp) {
      var cand1 = resp.results.candidates[0];
      var cand2 = resp.results.candidates[1];
      var candD = cand1.candidatePartyCode === 'D' ? cand1 : cand2;
      var candR = cand1.candidatePartyCode === 'R' ? cand1 : cand2;
      senBopTempResults.candD = {
        name: candD.fullName,
        gains: resp.bop.gains.Dem,
        losses: resp.bop.losses.Dem,
        currentSeats: resp.bop.currentSeats.Dem
      };
      senBopTempResults.candR = {
        name: candR.fullName,
        gains: resp.bop.gains.Rep,
        losses: resp.bop.losses.Rep,
        currentSeats: resp.bop.currentSeats.Rep
      };
    });
    var repBopPromise = bopResultsService.get({race: 'HG'}).$promise;
    bopPromises.push(repBopPromise);
    repBopPromise.then(function(resp) {
      var cand1 = resp.results.candidates[0];
      var cand2 = resp.results.candidates[1];
      var candD = cand1.candidatePartyCode === 'D' ? cand1 : cand2;
      var candR = cand1.candidatePartyCode === 'R' ? cand1 : cand2;
      repBopTempResults.candD = {
        name: candD.fullName,
        gains: resp.bop.gains.Dem,
        losses: resp.bop.losses.Dem,
        currentSeats: resp.bop.currentSeats.Dem
      };
      repBopTempResults.candR = {
        name: candR.fullName,
        gains: resp.bop.gains.Rep,
        losses: resp.bop.losses.Rep,
        currentSeats: resp.bop.currentSeats.Rep
      };
    });
    $q.all(presPromises.concat(senPromises, repPromises, bopPromises)).then(function () {
      ctrl.presResults = presTempResults;
      ctrl.senResults = senTempResults;
      ctrl.repResults = repTempResults;
      ctrl.presBopResults = presBopTempResults;
      ctrl.senBopResults = senBopTempResults;
      ctrl.repBopResults = repBopTempResults;
      ctrl.loaded = true;
    });
    $timeout(loadResults, 10000);
  }
}])

.factory('presResultsService', ['$resource', function($resource) {
  return $resource('https://politics-elex-results.data.api.cnn.io/results/view/2020-PG-:state.json', {
    state: '@state'
  });
}])

.factory('senResultsService', ['$resource', function($resource) {
  return $resource('https://politics-elex-results.data.api.cnn.io/results/view/2020-SG-:state.json', {
    state: '@state'
  });
}])

.factory('repResultsService', ['$resource', function($resource) {
  return $resource('https://politics-elex-results.data.api.cnn.io/results/view/2020-district-races-:state.json', {
    state: '@state'
  });
}])

.factory('bopResultsService', ['$resource', function($resource) {
  return $resource('https://politics-elex-results.data.api.cnn.io/results/view/2020-balance-of-power-:race.json', {
    race: '@race'
  });
}]);