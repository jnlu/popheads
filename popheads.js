var main_string = "";

function buildOutput(str) {
  main_string = main_string + str;
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function StandardDeviation(numbersArr) {
    var total = 0;
    for(var key in numbersArr) 
       total += numbersArr[key];
    var meanVal = total / numbersArr.length;
    var SDprep = 0;
    for(var key in numbersArr) 
       SDprep += Math.pow((parseFloat(numbersArr[key]) - meanVal),2);
    var SDresult = Math.sqrt(SDprep/numbersArr.length);
    return SDresult;
}

function sorter(a, b) {
  return a - b;
}

function tuple_sorter(a, b) {
  if (a[1] > b[1]) {
    return -1;
  }
  else if (a[1] < b[1]) {
    return 1;
  }

  if (a[0].toLowerCase() > b[0].toLowerCase()) {
    return 1;
  }
  else if (a[0].toLowerCase() < b[0].toLowerCase()) {
    return -1;
  }

  else {
    return 0;
  }
}

function equalScorer(a, b) {
  return(+a.toString().split('').pop() - 5 > 0) == (+b.toString().split('').pop() - 5 > 0);
}

function equalScorerAverage(a, b, average, bool) {
  if (bool == true) {
    return true;
  }
  else {
    return((a - average > 0) == (b - average > 0));
  }
}

function findAllScores(scores, average, bool) {
  var setLowest = true;
  if (bool) {
    buildOutput(String("\n\n**Highest scores:**"));
    setLowest = false;
  }
  var sorted_scores = Object.keys(scores).sort(function(a,b){
    if (scores[a] == scores[b]) {
      return b.localeCompare(a);
    }
    else {
      return scores[a] - scores[b];
    }
  }).reverse();
  curr_score = 500;
  var switched = false;
  for (var key in sorted_scores) {
    var c_user = sorted_scores[key];
    var c_score = scores[c_user];
    if (curr_score == c_score) {
      buildOutput(", " + c_user);
    }
    else {
      if ((c_score <= average) && (setLowest == false)) {
        buildOutput(String("\n\n**Lowest scores:**"));
        setLowest = true;
        switched = true;
      }
      var total = countTotal(scores, c_score);
      if (Number.isInteger(c_score)) {
        buildOutput(String("\n\n(" + c_score + " x" + total + ") "));
        buildOutput(c_user);
      }

      else if ((curr_score % 0.5 != 0) && (c_score % 0.5 != 0) && (equalScorerAverage(curr_score, c_score, average, setLowest)) && (equalScorer(curr_score, c_score))) {
        var total = countTotal(scores, c_score);
        if (switched) {
          buildOutput("\n\n(" + c_score.toFixed(1) + " x" + total + ") " + c_user);
        }
        else {
          buildOutput(" (" + c_score.toFixed(1) + " x" + total + ") " + c_user);
        }
      }
      else {
        buildOutput(String("\n\n(" + c_score.toFixed(1) + " x" + total + ") "));
        buildOutput(c_user);
      }
      curr_score = c_score;
      switched = false;
    }
  }
  buildOutput(String("\n\n"));
}

function countTotal(arr, x) {
  var tempcount = 0;
  for (var k in arr) {
    if (Math.abs(arr[k] - x) < 0.00001) {
      tempcount = tempcount + 1;
    }
  }
  return tempcount;
}

function findHighestLowestScores(scores, average, upper, lower, upperavg, loweravg) {
  var highest = {};
  var lowest = {};
  var highestScore = -20;
  var lowestScore = 20;
  var sorted_scores = Object.keys(scores).sort(function(a,b){return scores[a]-scores[b]});

  for (var song in sorted_scores) {
    var name = sorted_scores[song];
    var score = scores[name]
    if (score > highestScore) {
      if (score != 11) {
        highestScore = score;
      }
    }
    if (score < lowestScore) {
      if (score != 0) {
        lowestScore = score;
      }
    }
  }

  for (var song in sorted_scores) {

    var name = sorted_scores[song];
    var score = parseFloat(scores[name]);
    if (score == 11) {
      if (!(11 in highest)) {
        highest[11] = [];
      }
      highest[11].push(name);
    }
    else if (score == 10) {
      if (!(10 in highest)) {
        highest[10] = [];
      }
      highest[10].push(name);
    }
    else if (((highestScore - score) < upper) && ((score - upperavg > average))) {
      if (!(score in highest)) {
        highest[score] = [];
      }
      highest[score].push(name);
    }
    else if (score == 0) {
      if (!(0 in lowest)) {
        lowest[0] = [];
      }
      lowest[0].push(name);
    }
    else if (score == 1) {
      if (!(1 in lowest)) {
        lowest[1] = [];
      }
      lowest[1].push(name);
    }
    else if (((score - lowestScore) < lower) && ((score + loweravg < average))) {
      if (!(score in lowest)) {
        lowest[score] = [];
      }
      lowest[score].push(name);
    }
  }


  buildOutput(String("\n\n**Highest scores:**\n\n"));
  var sorted = Object.keys(highest).sort(sorter).reverse();

  for (var key in (sorted)) {
    var score = key;
    score = parseFloat(score);
    if (Number.isInteger(score)) {
      var length = highest[sorted[key]].length;
      buildOutput(String("(" + sorted[score] + " x" + length + ") "));
    }
    else {
      var length = highest[sorted[key]].length;
      score.toFixed(1);
      buildOutput(String("(" + sorted[score] + " x" + length + ") "));
    }
    lastusername = highest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)}).slice(-1)[0];
    for (var username in highest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)})) {
      var user = highest[sorted[key]][username];
      buildOutput(String(user));
      if (user === lastusername) {
        buildOutput(String("\n\n"));
      }
      else {
        buildOutput(String(", "));
      }
    }
  }

  var sorted = Object.keys(lowest).sort(sorter).reverse();

  buildOutput(String("\n**Lowest Scores:**\n\n"));
  for (var key in sorted) {
    var score = key;
    if (Number.isInteger(score)) {
      var length = lowest[sorted[key]].length;
      buildOutput(String("(" + sorted[score] + " x" + length + ") "));
    }
    else {
      var length = lowest[sorted[key]].length;
      score = parseFloat(score);
      score.toFixed(1);
      buildOutput(String("(" + sorted[score] + " x" + length + ") "));
    }
    lastusername = lowest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)}).slice(-1)[0];
    for (var username in lowest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)})) {
      var user = lowest[sorted[key]][username];
      buildOutput(String(user));
      if (user === lastusername) {
        buildOutput(String("\n\n"));
      }

      else {
        buildOutput(String(", "));
      }
    }
  }
  buildOutput(String("\n"));
}

function copyOutputText() {
  var copyText = document.getElementById("output");
  copyText.select();
  copyText.setSelectionRange(0, 9999999);
  document.execCommand("copy");
  
  var tooltip = document.getElementById("outputTooltip");
  tooltip.innerHTML = "Copied output!";
}

function copyMessageText() {
  var copyText = document.getElementById("msgoutput");
  copyText.select();
  copyText.setSelectionRange(0, 9999999);
  document.execCommand("copy");
  
  var tooltip = document.getElementById("msgTooltip");
  tooltip.innerHTML = "Copied message link!";
}

function outFunc() {
  var tooltip = document.getElementById("outputTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}

function outFunc2() {
  var tooltip = document.getElementById("msgTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}

document.getElementById('button2').onclick = function() {
  $.ajax({
    url: "data.txt",
    dataType: "text",
    success: function(data) {
      document.getElementById('output').value = "Hit the Convert button.";
      $("#data").text(data);
    }
  })
}

document.getElementById('button5').onclick = function() {
  $.ajax({
    url: "rate_anniversary.txt",
    dataType: "text",
    success: function(data) {
      document.getElementById('output').value = "Hit the Convert button.";
      $("#data").text(data);
    }
  })
}

document.getElementById('button6').onclick = function() {
  $.ajax({
    url: "prophecy.txt",
    dataType: "text",
    success: function(data) {
      document.getElementById('output').value = "Hit the Convert button.";
      $("#data").text(data);
    }
  })
}

document.getElementById('button7').onclick = function() {
  $.ajax({
    url: "winners.txt",
    dataType: "text",
    success: function(data) {
      document.getElementById('output').value = "Hit the Convert button.";
      $("#data").text(data);
    }
  })
}

document.getElementById('button8').onclick = function() {
  $.ajax({
    url: "kpop.txt",
    dataType: "text",
    success: function(data) {
      document.getElementById('output').value = "Hit the Convert button.";
      $("#data").text(data);
    }
  })
}
document.getElementById('button3').onclick = function() {
  var user = encodeURIComponent(String(document.getElementById('username').value));
  var body = encodeURIComponent(String(document.getElementById('msginput').value));
  var subject = encodeURIComponent(String(document.getElementById('subject').value));
  document.getElementById("msgoutput").value = String("https://old.reddit.com/message/compose?to=" + user + "&subject=" + subject + "&message=" + body);
}

document.getElementById('button4').onclick = function() {
  document.getElementById('username').value = "letsallpoo";
  document.getElementById('subject').value = "2016 Ultimate Album Rate";
  $.ajax({
    url: "msgdata.txt",
    dataType: "text",
    success: function(data) {
      document.getElementById('msgoutput').value = "Hit the Create Message URL button.";
      $("#msginput").text(data);
    }
  })
}



document.getElementById('button').onclick = function() {
  var input = document.getElementById('data').value;
  document.getElementById('output').value = "";
  main_string = "";

  var usernames = []; //This list holds all of the usernames
  var songs = []; //This list holds all of the songs in order
  var bonusSongs = []; //This list holds all of the bonus songs in order
  var albums = []; //This list holds all of the albums in order

  var songComments = {}; //This dictionary's keys are the song titles, and the values are lists of tuples that have the username, score, and comment
  var songAvgScores = {}; //This dictionary's keys are the song titles, and the values are the current average
  var songAllScores = {}; //This dictionary's keys are the song titles, and the values are the lists that contain just the scores
  var songAllScoresWithNames = {}; //This dictionary's keys are the song titles, and the values are another dictionary that contain a username and a score
  var songAllControversies = {}; //This dictionary's keys are titles, and the values are controversy scores

  var bonusComments = {};
  var bonusAvgScores = {};
  var bonusAllScores = {};
  var bonusAllScoresWithNames = {};

  var albumOverallAverages = {}; //This dictionary's keys are album titles, and the values are a list with every single score it received
  var albumUserAverages = {}; //This dictionary's keys are the album titles, and the values are another dictionary that contain a username and an average
  var albumAllComments = {}; //This dictionary's keys are the album titles, and the values are a list that contain a username and comment
  var albumSongs = {}; //This dictionary's keys are album titles, and the values are a list of each song that belongs to that album

  var hostSongComments = {};
  var hostAlbumComments = {};
  var hostAllScoresLinks = {};
  var hostAllListenHereLinks = {};
  var hostAllSongImages = {};
  var hostNamefix = {};
  var hosts = [];

  var songArtistMap = {};
  var userAllScores = {};

  var hasAlbums = true;
  var category = "Album";
  var ranks = {};
  var rankIterations = [];

  var gaveZero = false;
  var gaveEleven = false;
  var bonus = false;
  var host = false;
  var hostSet = false;
  var debug = false;

  var username = "";
  var artist = "";
  var album = "";
  var albumAllScores = [];
  var songAlbumMap = {}; //This dictionary's keys are song titles, and the values are the album it belongs to
  var albumSongMap = {}; //This dictionary's keys are album titles, and the values are lists of all of its songs

  var hostAddInfo1 = {};
  var hostAddInfo2 = {};
  var hostAddInfo3 = {};

  var require11Comment = false;
  var require0Comment = false;

  var regexSong = /(.+?):\s*([\d\.\/10]+)?\s*(.+)?/;
  var regexUsername = /Username:\s*(.+)/;
  var regexAllScores = /AS:\s*(.+)/;
  var regexListenHere = /LH:\s*(.+)/;
  var regexNameFix = /NF:\s*(.+)/;
  var regexImage = /IMAGE:\s*(.+)/;
  var regexArtist = /ARTIST:\s*(.+)/;
  var regexAddInfo1 = /AI1:\s*(.+)/;
  var regexAddInfo2 = /AI2:\s*(.+)/;
  var regexAddInfo3 = /AI3:\s*(.+)/;
  var regexCategory = /CATEGORY:\s*(.+)/;
  var regexTracking = /TRACKING:\s*(.+)/;
  var regexUpperBound = /UPPER BOUND:\s*(.+)/;
  var regexLowerBound = /LOWER BOUND:\s*(.+)/;
  var regexUpperAvgBound = /UPPER AVERAGE BOUND:\s*(.+)/;
  var regexLowerAvgBound = /LOWER AVERAGE BOUND:\s*(.+)/;

  var lines = input.split("\n");
  var lines_length = lines.length;

  var userSongs = [];
  var bonussongs = [];

  var cleanDecimals = false;
  var printAllScores = null;
  var addHighestLowestAllScores = false;
  var upperBound = 2;
  var lowerBound = 2;
  var upperAverageBound = 0.5;
  var lowerAverageBound = 0.5;
  var positionTrackInterval = 10;
  var positionTrackCounter = 0;

  var allWarnings = [];

  function recordUsername(line) {
    user = regexUsername.exec(line)[1].trim().replace(/_/g, "\\_");
    if (user.startsWith("/u/")) {
      user = user.replace("/u/", "");
    }
    if (user.startsWith("u/")) {
      user = user.replace("u/", "");
    }
    if (user.startsWith("/")) {
      user = user.replace("/", "");
    }
    if (usernames.includes(user)) {
        document.getElementById('output').value = ("Error: User " + user + " appears twice. Exiting program.");
        throw new Error("?")
    }
    usernames.push(user);
    userAllScores[user] = [];
    return user;
  }

  function recordAlbum(line) {
    bonus = false;
    if (hostSet == false) {
      document.getElementById('output').value = ("Error: The HOST line has not been set. The first set of scores must be designated as the host with a line that says \"HOST\" after the username line. Exiting program.");
      throw new Error("?")   
    }
    var regexAlbum = new RegExp(category + ':\\s*([^:]+):?\s*(.+)?');

    if (albumAllScores.length != 0) {
      albumUserAverages[album][username] = ((albumAllScores.reduce((a, b) => a + b, 0)) / Math.max(1, (albumAllScores.length)));
    }
    albumAllScores.splice(0, albumAllScores.length);
    
    var curralbum = regexAlbum.exec(line)[1];
    
    if (regexAlbum.exec(line).length > 2) {
      albumComment = regexAlbum.exec(line)[2];
    }

    if (host) {
      if (!(curralbum in albumOverallAverages)) {
        albumOverallAverages[curralbum] = [];
      }      
      if (!(curralbum in albumUserAverages)) {
        albumUserAverages[curralbum] = {};
      }
      if (albumComment) {
        if (!(curralbum in hostAlbumComments)) {
          hostAlbumComments[curralbum] = [];
        }
        hostAlbumComments[curralbum].push(albumComment);
      }
      if (!(curralbum in albumAllComments)) {
        albumAllComments[curralbum] = [];
      }
    }
    
    else {
      if (albumComment) { 
        albumAllComments[curralbum].push([username, albumComment]);
      }
    }
    
    return curralbum;
  }

  function recordSong(line) {
    var songScore = 200;
    if (hostSet == false) {
      document.getElementById('output').value = ("Error: The HOST line has not been set. The first set of scores must be designated as the host with a line that says \"HOST\" after the username line. Exiting program.");
      throw new Error("?")   
    }
    try {
      var splitline = regexSong.exec(line);
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }

    splitline = regexSong.exec(line);
    if (splitline == null) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }
    
    // Verify the song name is correct, then update everything accordingly
    
    songName = splitline[1];
    try {
      songName = songName.trim();
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }

    if (host) {
      if (hasAlbums) {
        if (!(songName in songAlbumMap)) {
          songAlbumMap[songName] = album;
        }
      }
      if (!(songs.includes(songName))) {
        songs.push(songName);
      }
      if (!(songName in songComments)) {
        songComments[songName] = [];
      }
      if (!(songName in songAvgScores)) {
        songAvgScores[songName] = 0;
      }
      if (!(songName in songAllScores)) {
        songAllScores[songName] = [];
      }
      if (!(songName in songAllScoresWithNames)) {
        songAllScoresWithNames[songName] = {};
      }
      if (!(artist == "")) {
        songArtistMap[songName] = artist;
      }
    }

    if (!(songs.includes(songName))) {
      document.getElementById('output').value = "User '" + username + "' gave a score to an invalid song: " + songName + "\n\nCheck to make sure the spelling and capitalization are corrrect."
      throw new Error("?");
    }

    if (hasAlbums) {
      if (album == "") {
        document.getElementById('output').value = (String("Error: User " + username + " gave a score to " + songName + " without an album/category defined. Either the album or category line is missing, or the \"NO ALBUM\" line is missing. Exiting program."));
        throw new Error("?");
      }
      if (songAlbumMap[songName].localeCompare(album) != 0) {
        document.getElementById('output').value = (String("User " + username + " listed song " + songName + " under the category " + album + " when it should be under " + songAlbumMap[songName] + ". Exiting program."));
        throw new Error("?");
      }
    }

    if (!(host)) {
      if (songs.indexOf(songName) == -1) {
        document.getElementById('output').value = (String("User " + username + " gave a score for a song not included. Triggered for song " + songName));
        throw new Error("?");
      }
    }

    // Now do the same for the song comment

    if (splitline[3]) {
      var songComment = splitline[3].trim('\n').trim().replace("/(n)/g", "\n\n");
    }
    else {
      var songComment = null;
    }

    // And finally the song score

    try {
      songScore = parseFloat(splitline[2].trim('\n').trim().replace("/10",''));
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line + "\n\nAre they missing a score?"
      throw new Error("?")
    }

    if (Number.isNaN(songScore)) {
      document.getElementById('output').value = String("Error: User '" + username + "' gave an invalid score to track " + songName + ". Exiting program.");
      throw new Error("?");
    }

    if (songScore == 200) {
      document.getElementById('output').value = String("Error: User '"+ username + "' did not give a score to track '" + songName + "'. Exiting program.");
      throw new Error("?");
    }

    if ((songScore < 1 && songScore != 0) || (songScore > 10 && songScore != 11)) {
      document.getElementById('output').value = String("Error: User '" + username + "' gave an invalid score of " + String(songScore) + " to track " + songName + ". Exiting program.");
      throw new Error("?");
    }

    if (songScore == 0) {
      if (gaveZero) { 
        document.getElementById('output').value = String("Error: User '" + username + "' gave two zeros. Triggered for song " + songName + ". Exiting program.");
        throw new Error("?");
      }
      else if (require0Comment && (!(songComment))) {
        document.getElementById('output').value = ("Error: User '" + username + "' did not give their 0 a comment. Triggered for song " + songName + ". Exiting program.");
        throw new Error("?");
      }
      else {
        gaveZero = true;
      }
    }

    if (songScore == 11) {
      if (gaveEleven) {
        document.getElementById('output').value = ("Error: User " + username + " gave two elevens. Triggered for song " + songName + ". Exiting program.");
        throw new Error("?");
      }
      else if (require11Comment && (!(songComment))) {
        document.getElementById('output').value = ("Error: User " + username + " did not give their 11 a comment. Triggered for song " + songName + ". Exiting program.");
        throw new Error("?");
      }
      else {
        gaveEleven = true;
      }
    }

    if (songScore.toString().length > 3 && songScore != 11 && songScore != 10) {
      document.getElementById('output').value = ("Error: User " + username + " used more than one decimal point for the song " + songName + ". Score is " + songScore.toString() + ". Exiting program.");
      throw new Error("?"); 
    }
    if ((songScore % 0.5 != 0) && (cleanDecimals)) {
      document.getElementById('output').value = (String("Error: User " + username + " gave an ugly score of " + songScore + " to track " +  songName + ". Exiting program."));
      throw new Error("?");
    }

    var tuple = [username, songScore, songComment]
    if (songComment) {
      songComment = replaceAll(songComment, "(n)", "\n\n")
      if (host) {
        if (!(songName in hostSongComments)) {
          hostSongComments[songName] = [];
        }
        hostSongComments[songName].push(tuple);
      }
      else {
        songComments[songName].push(tuple);
      }
    }
    

    if (hasAlbums) {
      albumOverallAverages[album].push(songScore);
    }
    albumAllScores.push(songScore);
    songAllScores[songName].push(songScore);
    songAllScoresWithNames[songName][username] = songScore;
    userAllScores[username].push(songScore);
    if (songName in userSongs) {
      document.getElementById('output').value = ("Error: User " + username + " gave song " + songName + " two scores. Exiting program.");
      throw new Error("?")      
    }
    else {
      userSongs.push(songName);
    }

  }


  function recordBonusSong(line) {

    var songScore = 200;
    if (hostSet == false) {
      document.getElementById('output').value = ("Error: The HOST line has not been set. The first set of scores must be designated as the host with a line that says \"HOST\" after the username line. Exiting program.");
      throw new Error("?")   
    }
    try {
      var splitline = regexSong.exec(line);
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }

    splitline = regexSong.exec(line);
    if (splitline == null) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }
    songName = splitline[1];
    try {
      songName = songName.trim();
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }

    if (host) {
      if (!(songs.includes(songName))) {
        songs.push(songName);
      }
      if (!(bonussongs.includes(songName))) {
        bonussongs.push(songName);
      }
      if (!(songName in bonusComments)) {
        bonusComments[songName] = [];
      }
      if (!(songName in bonusAvgScores)) {
        bonusAvgScores[songName] = 0;
      }
      if (!(songName in bonusAllScores)) {
        bonusAllScores[songName] = [];
      }
      if (!(songName in bonusAllScoresWithNames)) {
        bonusAllScoresWithNames[songName] = {};
      }
      if (!(artist == "")) {
        songArtistMap[songName] = artist;
      }
    }

    if (!(host)) {
      if (bonussongs.indexOf(songName) == -1) {
        document.getElementById('output').value = (String("User " + username + " gave a score for a song not included. Triggered for song " + songName));
        throw new Error("?");
      }
    }
    
    if (splitline[3]) {
      var songComment = splitline[3].trim('\n').trim().replace("/(n)/g", "\n\n");
    }
    else {
      var songComment = null;
    }

    if (regexSong.exec(line)[2]) {
     songScore = parseFloat(regexSong.exec(line)[2].trim('\n').trim().replace("/10",''));
    }

    if (songScore != 200) {

      if (songScore == 0) {
        document.getElementById('output').value = (String("Error: User " + username + " gave a zero to the bonus track " +  songName + ". Exiting program."));
        throw new Error("?");
      }
      if (songScore == 11) {
        document.getElementById('output').value = (String("Error: User " + username + " gave an eleven to the bonus track " +  songName + ". Exiting program."));
        throw new Error("?");
      }
      if ((songScore < 1) || (songScore > 10)) {
        document.getElementById('output').value = (String("Error: User " + username + " gave an invalid score to track " +  songName + ". Exiting program."));
        throw new Error("?");
      }
      if (songScore.toString().length > 3 && songScore != 11 && songScore != 10) {
        document.getElementById('output').value = ("Error: User " + username + " used more than one decimal point for the song " + songName + ". Score is " + songScore.toString() + ". Exiting program.");
        throw new Error("?"); 
      }
      if ((songScore % 0.5 != 0) && (cleanDecimals)) {
        document.getElementById('output').value = (String("Error: User " + username + " gave an ugly score of " + songScore + " to track " +  songName + ". Exiting program."));
        throw new Error("?");
      }

      if (regexSong.exec(line)[3]) {
          songComment = replaceAll(regexSong.exec(line)[3], "(n)", "\n\n");
          var tuple = [username, songScore, songComment]
          if (host) {
            if (!(songName in hostSongComments)) {
              hostSongComments[songName] = [];
            }
            hostSongComments[songName].push(tuple);
          }
          else {
            bonusComments[songName].push(tuple);
          }
      }

      bonusAllScores[songName].push(songScore);
      bonusAllScoresWithNames[songName][username] = songScore;
    }
  }

  function trackPositions() {

    for (var index in songAvgScores) {
      songAvgScores[index] = parseFloat((songAllScores[index].reduce((a, b) => a + b, 0)) / Math.max((songAllScores[index].length), 1));
    }
    sorted_scores = Object.keys(songAvgScores).sort(function(a,b){return songAvgScores[a]-songAvgScores[b]}).reverse();
    var regular_rank = {};
    var rank = 0;
    var count = 0;
    var prevavg = 200;

    for (var i = 0; i < sorted_scores.length; i++) {

      var currsong = sorted_scores[i]
      count += 1;
      var curravg = songAvgScores[currsong];
      if (Math.abs(curravg - prevavg) >= 0.00001) {
        rank += count;
        prevavg = curravg;
        count = 0;
      }
      regular_rank[currsong] = [rank, curravg];

    }
    for (key in regular_rank) {
      tempRank = regular_rank[key][0];
      tempSongTitle = key;
      if (!(tempSongTitle in ranks)) {
        ranks[tempSongTitle] = [];
      }
      ranks[tempSongTitle].push(tempRank);
    }
    rankIterations.push(usernames.length);

  }


  for (var i = 0; i < lines_length; i++) {

    line = lines[i]
    if (debug) {
      console.log(line);
    }
    if (!!line.trim()) {
      line = line.trim('\n').trim().replace("´", "'");

      if (line.startsWith("Username")) {
        if (username != "") {
          document.getElementById('output').value = ("Error: User " + username + " did not end correctly. Check to make sure there is an \"END\" line after their scores. Exiting program.");
          throw new Error("?");
        }

        // Track positions

        if ((positionTrackCounter % positionTrackInterval == 0) && (positionTrackCounter != 0)) {

          trackPositions();

        }
        positionTrackCounter += 1;
        username = recordUsername(line);
        
      }
      
      else if (line.startsWith("HOST")) {
        host = true;
        hostSet = true;
        if (!(username in hosts)) {
          hosts.push(username);          
        }
      }

      else if (line.startsWith("DEBUG")) {
        if (host) {
          debug = true;
        }
      }

      else if (line.startsWith("CATEGORY")) {
        if (hostSet == false) {
          document.getElementById('output').value = ("Error: The HOST line has not been set. The first set of scores must be designated as the host with a line that says \"HOST\" after the username line. Exiting program.");
          throw new Error("?")   
        }
        if (host) {
          category = regexCategory.exec(line)[1];
        }
      }

      else if (line.startsWith("REQUIRE COMMENT:0")) {
        if (host) {
          require0Comment = true;
        }
      }

      else if (line.startsWith("REQUIRE COMMENT:11")) {
        if (host) {
          require11Comment = true;
        }
      }

      else if (line.startsWith("REQUIRE COMMENT:BOTH")){
        if (host) {
          require0Comment = true;
          require11Comment = true;
        }
      }

      else if (line.startsWith("REQUIRECOMMENT:0")) {
        if (host) {
          require0Comment = true;
        }
      }

      else if (line.startsWith("REQUIRECOMMENT:11")) {
        if (host) {
          require11Comment = true;
        }
      }

      else if (line.startsWith("REQUIRECOMMENT:BOTH")){
        if (host) {
          require0Comment = true;
          require11Comment = true;
        }
      }

      else if (line.startsWith("CLEAN DECIMALS")) {
        if (host) {
          cleanDecimals = true;
        }
      }

      else if (line.startsWith("CLEANDECIMALS")) {
        if (host) {
          cleanDecimals = true;
        }
      }

      else if (line.startsWith("ALL SCORES:ON")) {
        if (host) {
          printAllScores = true;
        }
      }

      else if (line.startsWith("PRINTALLSCORES")) {
        if (host) {
          printAllScores = true;
        }
      }

      else if (line.startsWith("ALL SCORES:OFF")) {
        if (host) {
          printAllScores = false;
        }
      }

      else if (line.startsWith("ADD HIGHEST LOWEST LINES")) {
        if (host) {
          addHighestLowestAllScores = true;
        }
      }

      else if (line.startsWith(category)) {
        if (hasAlbums) {
         album = recordAlbum(line);
        }
      }

      else if (line.startsWith("NO ALBUM")) {
        if (host) {
          hasAlbums = false;
        }
      }
      else if (line.startsWith("END")) {

        if (albumAllScores.length != 0 && hasAlbums) {
          albumUserAverages[album][username] = ((albumAllScores.reduce((a, b) => a + b, 0)) / Math.max(1, albumAllScores.length));
        }
        albumAllScores.splice(0, albumAllScores.length); 

        // Check for missing scores
        var missingSongs = [];
        for (var j = 0; j < songs.length; j++) {
          if (!(userSongs.includes(songs[j])) && (!(bonussongs.includes(songs[j])))) {
            missingSongs.push(songs[j]);
          }
        }
        if (missingSongs.length > 0) {
          document.getElementById('output').value = ("Error: User " + username + " is missing scores for the song(s): " + missingSongs.toString() + ". Exiting program.");
          throw new Error("?");
        }

        username = "";
        artist = "";
        album = "";
        userSongs = [];
        bonus = false;
        gaveZero = false;
        gaveEleven = false;
        host = false;
      }

      else if (line.startsWith("AS:")) {
        if (host) {
          var ASoutput = regexAllScores.exec(line);
          if (ASoutput) {
            hostAllScoresLinks[songName] = ASoutput[1];
          }
          else {
            allWarnings.push(songName + " AS link is invalid");
          }
        }
      }

      else if (line.startsWith("LH:")){
        if (host) {
          var LHoutput = regexListenHere.exec(line);
          if (LHoutput) {
            hostAllListenHereLinks[songName] = LHoutput[1];
          }
          else {
            allWarnings.push(songName + " LH link is invalid");
          }
        }
      }

      else if (line.startsWith("IMAGE:")) {
        if (host) {
          var IMGoutput = regexImage.exec(line);
          if (IMGoutput) {
            hostAllSongImages[songName] = IMGoutput[1];
          }
          else {
            allWarnings.push(songName + " IMAGE link is invalid");
          }
        }
      }

      else if (line.startsWith("AI1:")) {
        if (host) {
          hostAddInfo1[songName] = regexAddInfo1.exec(line)[1];
        }
      }

      else if (line.startsWith("AI2:")) {
        if (host) {
          hostAddInfo2[songName] = regexAddInfo2.exec(line)[1];
        }
      }
      
      else if (line.startsWith("AI3:")) {
        if (host) {
          hostAddInfo3[songName] = regexAddInfo3.exec(line)[1];
        }
      }

      else if (line.startsWith("NF:")) {
        if (host) {
          var NFoutput = regexNameFix.exec(line);
          if (NFoutput) {
            hostNamefix[songName] = NFoutput[1];
          }
          else {
            allWarnings.push(songName + " NF link is invalid");
          }
        }
      }
      
      else if (line.startsWith("ARTIST:")) {
        if (host) {
          var ARTISToutput = regexArtist.exec(line);
          if (ARTISToutput) {
           artist = ARTISToutput[1];
          }
          else {
            allWarnings.push("Invalid ARTIST line is present in user " + username + "'s scores")
          }
        }
      }

      else if (line.startsWith("RESET ARTIST")) {
        if (host) {
          artist = "";
        }
      }

      else if (line.startsWith("BONUS TRACKS")) {
        bonus = true;
        artist = "";
      }

      else if (line.startsWith("UPPER BOUND:")) {
        if (host) {
          var UPPERoutput = regexUpperBound.exec(line);
          if (UPPERoutput) {
            var tempBound = parseFloat(UPPERoutput[1]);
            if (!(isNaN(tempBound))) {
              upperBound = tempBound;
            }
            else {
              allWarnings.push("UPPER BOUND value is invalid");
            }
          }
          else {
            allWarnings.push("UPPER BOUND value is invalid");
          }
        }
      }

      else if (line.startsWith("LOWER BOUND:")) {
        if (host) {
          var LOWERoutput = regexLowerBound.exec(line);
          if (LOWERoutput) {
            var tempBound = parseFloat(LOWERoutput[1]);
            if (!(isNaN(tempBound))) {
              lowerBound = tempBound;
            }
            else {
              allWarnings.push("LOWER BOUND value is invalid");
            }
          }
          else {
            allWarnings.push("LOWER BOUND value is invalid");
          }
        }
      }

      else if (line.startsWith("UPPER AVERAGE BOUND:")) {
        if (host) {
          var UPPERAVGoutput = regexUpperAvgBound.exec(line);
          if (UPPERAVGoutput) {
            var tempBound = parseFloat(UPPERAVGoutput[1]);
            if (!(isNaN(tempBound))) {
              upperAverageBound = tempBound;
            }
            else {
              allWarnings.push("UPPER AVERAGE BOUND value is invalid");
            }
          }
          else {
            allWarnings.push("UPPER AVERAGE BOUND value is invalid");
          }
        }
      }

      else if (line.startsWith("LOWER AVERAGE BOUND:")) {
        if (host) {
          var LOWERAVGoutput = regexLowerAvgBound.exec(line);
          if (LOWERAVGoutput) {
            var tempBound = parseFloat(LOWERAVGoutput[1]);
            if (!(isNaN(tempBound))) {
              lowerAverageBound = tempBound;
            }
            else {
              allWarnings.push("LOWER AVERAGE BOUND value is invalid");
            }
          }
          else {
            allWarnings.push("LOWER AVERAGE BOUND value is invalid");
          }
        }
      }

      else if (line.startsWith("TRACKING:")) {
        if (host) {
          var TRACKINGoutput = regexTracking.exec(line);
          if (TRACKINGoutput) {
            var tempInt = parseInt(TRACKINGoutput[1]);
            if (Number.isInteger(tempInt)) {
              positionTrackInterval = tempInt;
            }
            else {
              allWarnings.push(songName + "TRACKING value is invalid");
            }

          }
          else {
            allWarnings.push(songName + "TRACKING value is invalid");
          }
        }
      }

      else {
        
        if (!(bonus)) {
          recordSong(line);
        }

        else {
          recordBonusSong(line);
        }
      }
    }
  }
  
  if (username != "") {
    document.getElementById('output').value = ("Error: User " + username + " did not end correctly. Check to make sure there is an \"END\" line after their scores. Exiting program.");
    throw new Error("?");
  }

  trackPositions();


// Calculate and pring everything

var mul_hosts = false;

if (hosts.length > 1) {
  mul_hosts = true;
}

for (var index in songAvgScores) {
  songAvgScores[index] = parseFloat((songAllScores[index].reduce((a, b) => a + b, 0)) / Math.max((songAllScores[index].length), 1));
}

for (var index in bonusAvgScores) {
  bonusAvgScores[index] = parseFloat((bonusAllScores[index].reduce((a, b) => a + b, 0)) / Math.max((bonusAllScores[index].length), 1));
}

var numParticipants = usernames.length;
var totalSongs = 1;
var totalBonusSongs = 1;
var leastContSong = ["", 1000];
var mostContSong = ["", -1];
var most11s = ["", -1];
var most0s = ["", -1];

sorted_scores = Object.keys(songAvgScores).sort(function(a,b){return songAvgScores[a]-songAvgScores[b]}).reverse();
bonus_sorted_scores = Object.keys(bonusAvgScores).sort(function(a,b){return bonusAvgScores[a]-bonusAvgScores[b]}).reverse();


if (printAllScores == null) {
  if (numParticipants <= 75) {
    printAllScores = true;
  }
  else {
    printAllScores = false;
  }
}


// Calculate ranks

var regular_rank = {};
var count = 0;
var rank = 0;
var prevavg = 200;
for (var i = 0; i < sorted_scores.length; i++) {

  var currsong = sorted_scores[i]
  count = count + 1;
  var curravg = songAvgScores[currsong];
  if (Math.abs(curravg - prevavg) >= 0.00001) {
    rank = rank + count;
    prevavg = curravg;
    count = 0;
  }
  regular_rank[currsong] = [rank, curravg];

}

var bonus_rank = {};
var count = 0;
var rank = 0;
var prevavg = 200;
for (var i = 0; i < bonus_sorted_scores.length; i++) {

  var currsong = bonus_sorted_scores[i]
  count = count + 1;
  var curravg = bonusAvgScores[currsong];
  if (Math.abs(curravg - prevavg) >= 0.00001) {
    rank = rank + count;
    prevavg = curravg;
    count = 0;
  }
  bonus_rank[currsong] = [rank, curravg];

}

// Print warnings

if (allWarnings.length != 0) {
  buildOutput("Warnings:\n\n")
  for (key in allWarnings) {
    buildOutput(allWarnings[key] + "\n");
  }
  buildOutput("\n")
}

// Print regular track rank

sorted_regular_rank = Object.keys(regular_rank).sort(function(a,b){return regular_rank[a][0] - regular_rank[b][0]});
sorted_bonus_rank = Object.keys(bonus_rank).sort(function(a,b){return bonus_rank[a][0] - bonus_rank[b][0]});

buildOutput(String("Results:\n\n"));
for (var index in sorted_regular_rank) {
  var songtitle = sorted_regular_rank[index];
  var rank = regular_rank[songtitle][0];
  var average = regular_rank[songtitle][1];
  var total = average * usernames.length;
  main_title = songtitle;
  if (songtitle in hostNamefix) {
    main_title = hostNamefix[songtitle];
  }
  if (songtitle in songArtistMap) {
    main_title = songArtistMap[songtitle] + " – " + main_title;
  }
  if (songtitle in hostAllSongImages) {
    main_title = "[" + main_title + "](" + hostAllSongImages[songtitle] + ")";
  }
  buildOutput(String("* #" + rank + ": " + main_title + " | " + average.toFixed(3) + " | " + total.toFixed(1) + "\n"));
}
buildOutput(String("\n"));

// Print bonus track rank

if (Object.keys(bonusAvgScores).length > 0) {
  buildOutput(String("Bonus results:\n\n"));
  for (var index in sorted_bonus_rank) {
    var songtitle = sorted_bonus_rank[index];
    var rank = bonus_rank[songtitle][0];
    var average = bonus_rank[songtitle][1];
    var total = bonusAllScores[songtitle].reduce((a, b) => a + b, 0);
    main_title = songtitle;
    if (songtitle in hostNamefix) {
      main_title = hostNamefix[songtitle];
    }
    if (songtitle in songArtistMap) {
      main_title = songArtistMap[songtitle] + " – " + main_title;
    }
    buildOutput(String("* Bonus #" + rank + ": " + main_title + " | " + average.toFixed(3) + " | " + total.toFixed(1) + "\n"));
  }
  buildOutput(String("\n"));
}  

// Print out all regular tracks in order of score, descending

var controversies = [];
var averages = [];

albumAverageControversy = {};

for (var song in (sorted_scores)) {
  var avg = parseFloat(songAvgScores[sorted_scores[song]]);
  averages.push(avg);
  avg = avg.toFixed(3);
  avg = String(avg);
  var songTotal = (songAllScores[sorted_scores[song]].reduce((a, b) => a + b, 0));
  var songTitle = sorted_scores[song];
  var tempAllScores = songAllScores[songTitle];

  // Calculate how many 11s and 0s, and update vars if needed
  var temp11s = countTotal(tempAllScores, 11);
  var temp0s = countTotal(tempAllScores, 0);

  if (temp11s > most11s[1]) {
    most11s = [songTitle, temp11s];
  }
  else if (temp11s == most11s[1]) {
    most11s = [most11s[0] + ", " + songTitle, temp11s];
  }

  if (temp0s > most0s[1]) {
    most0s = [songTitle, temp0s];
  }
  else if (temp0s == most0s[1]) {
    most0s = [most0s[0] + ", " + songTitle, temp0s];
  }

  // Get song controversy and store it
  var stdDev = StandardDeviation(tempAllScores);

  songAllControversies[songTitle] = stdDev;
  controversies.push(stdDev);
  if (hasAlbums) {
    var newalbum = songAlbumMap[songTitle];
    if (!(newalbum in albumAverageControversy)) {
      albumAverageControversy[newalbum] = [];
    }
    if (!(newalbum in albumSongMap)) {
      albumSongMap[newalbum] = [];
    }
    albumAverageControversy[newalbum].push(stdDev);
    albumSongMap[newalbum].push(songTitle);
  }
  if (stdDev > mostContSong[1]) {
    mostContSong = [songTitle, stdDev];
  } 
  if (stdDev < leastContSong[1]) {
    leastContSong = [songTitle, stdDev];
  }

  var main_title = sorted_scores[song];
  if (songTitle in hostNamefix) {
    main_title = hostNamefix[songTitle];
  }
  if (songTitle in songArtistMap) {
    main_title = songArtistMap[songTitle] + " - " + main_title;
  }
  if (sorted_scores[song] in hostAllSongImages) {
    main_title = "[" + main_title + "](" + hostAllSongImages[songTitle] + ")";
  }

  buildOutput(String("# #" + regular_rank[songTitle][0] + ": " + main_title + "\n\n---\n\n**Average:** " + avg + " **// Total Points:** " + songTotal.toFixed(1) + " **// Controversy:** " + stdDev.toFixed(3)));
  
  if (songTitle in hostAllListenHereLinks) {
    buildOutput(String(" **// [Listen here](" + hostAllListenHereLinks[songTitle] + ")**"));
  }
  if (songTitle in hostAddInfo1) {
    buildOutput(String("\n\n" + replaceAll(hostAddInfo1[songTitle], "(n)", "\n\n")));
  }

  buildOutput("\n\n---");
  if (songTitle in hostAddInfo2) {
    buildOutput(String("\n\n" + replaceAll(hostAddInfo2[songTitle], "(n)", "\n\n") + "\n"));
  }

  if (printAllScores) {
    findAllScores(songAllScoresWithNames[songTitle], parseFloat(avg), addHighestLowestAllScores);
    //throw new Error("TESTING LINE 1088");
  }
  else {
    findHighestLowestScores(songAllScoresWithNames[songTitle], parseFloat(avg), upperBound, lowerBound, upperAverageBound, lowerAverageBound);
  }

  if (songTitle in hostAllScoresLinks) {
    buildOutput(String("**[All scores](" + hostAllScoresLinks[songTitle] + ")**\n\n"));
  }

  buildOutput(String("---\n\n"));
  
  if (songTitle in hostAddInfo3) {
    buildOutput(String(replaceAll(hostAddInfo3[songTitle], "(n)", "\n\n") + "\n\n---\n\n"));
  }
  
  if (songTitle in hostSongComments) {
    if (mul_hosts) {
      for (var tuple in hostSongComments[songTitle].sort(tuple_sorter)) {
        buildOutput("**" + hostSongComments[songTitle][tuple][0] + "** (" + hostSongComments[songTitle][tuple][1] + "): " + replaceAll(hostSongComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n");
      }
    }

    else {
      buildOutput(replaceAll(hostSongComments[songTitle][0][2], "(n)", "\n\n")  + "\n\n");
    }
  }

  buildOutput("---\n\n");
  
  for (var tuple in songComments[songTitle].sort(tuple_sorter)) {
    buildOutput("**" + songComments[songTitle][tuple][0] + "** (" + songComments[songTitle][tuple][1] + "): " + replaceAll(songComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n");
  }
  
  if(!(printAllScores)) {
    buildOutput("All scores:\n");
    scoreDict = songAllScoresWithNames[songTitle];
    sorted_score_dict = Object.keys(scoreDict).sort(function(a, b) {
      if (scoreDict[a] != scoreDict[b]) return scoreDict[a] - scoreDict[b]
      else return -(a.localeCompare(b))});
    if (numParticipants != Object.keys(scoreDict).length) {
      document.getElementById('output').value = String("Error: wrong number of scores for " + String(songTitle) + ". Should be " + String(numParticipants) + " but is actually " + String(Object.keys(scoreDict).length));
      throw new Error("?");
    }
    for (var score in sorted_score_dict.reverse()) {
      var user = sorted_score_dict[score];
      buildOutput(replaceAll(user, "\\_", "\_") + " " + songAllScoresWithNames[songTitle][user] + "\n");
    }
  }

  buildOutput(String("\n"));
}

// Print out all bonus tracks in order of score, descending

if (Object.keys(bonusAvgScores).length > 0) {
  for (var song in (bonus_sorted_scores)) {
      songTitle = bonus_sorted_scores[song];
      var main_title = songTitle;
      if (songTitle in hostNamefix) {
        main_title = hostNamefix[songTitle];
      }      if (songTitle in songArtistMap) {
        main_title = songArtistMap[songTitle] + " - " + main_title;
      }
      if (songTitle in hostAllSongImages) {
        main_title = "[" + main_title + "](" + hostAllSongImages[songTitle] + ")"
      }
      songTotal = (bonusAllScores[songTitle].reduce((a, b) => a + b, 0)).toFixed(1);
      var stdDev = StandardDeviation(bonusAllScores[songTitle]);

      buildOutput(String("# Bonus #" + bonus_rank[songTitle][0] + ": " + main_title + "\n\n---\n\n**Average:** " + parseFloat(bonusAvgScores[songTitle]).toFixed(3) + " **// Total Points:** " + songTotal + " **// Controversy:** " + stdDev.toFixed(3)));
      
      if (songTitle in hostAllListenHereLinks) {
        buildOutput(String(" **// [Listen here](" + hostAllListenHereLinks[songTitle] + ")**"));
      }
      
      if (songTitle in hostAddInfo1) {
        buildOutput(String("\n\n" + replaceAll(hostAddInfo1[songTitle], "(n)", "\n\n")));
      }

      buildOutput("\n\n---");
      if (songTitle in hostAddInfo2) {
        buildOutput(String("\n\n" + replaceAll(hostAddInfo2[songTitle], "(n)", "\n\n") + "\n"));
      }
      
      if (printAllScores) {
        findAllScores(bonusAllScoresWithNames[bonus_sorted_scores[song]], parseFloat(avg), addHighestLowestAllScores);
      }
      else {
        findHighestLowestScores(bonusAllScoresWithNames[bonus_sorted_scores[song]], parseFloat(bonusAvgScores[bonus_sorted_scores[song]]), upperBound, lowerBound, upperAverageBound, lowerAverageBound);
      }

      if (songTitle in hostAllScoresLinks) {
        buildOutput(String("**[All scores](" + hostAllScoresLinks[songTitle] + ")**\n\n"));
      }



      buildOutput("---\n\n");
      
      if (songTitle in hostAddInfo3) {
        buildOutput(String(replaceAll(hostAddInfo3[songTitle], "(n)", "\n\n") + "\n\n---\n\n"));
      }

      if (songTitle in hostSongComments) {
        if (mul_hosts) {
          for (var tuple in hostSongComments[songTitle].sort(tuple_sorter)) {
            buildOutput("**" + hostSongComments[songTitle][tuple][0] + "** (" + hostSongComments[songTitle][tuple][1] + "): " + replaceAll(hostSongComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n");
          }
        }

        else {
          buildOutput(hostSongComments[songTitle][0][2] + "\n\n");
        }
      }

      buildOutput("---\n\n");

      for (var tuple in bonusComments[songTitle].sort(tuple_sorter)) {
        buildOutput("**" + bonusComments[songTitle][tuple][0] + "** (" + bonusComments[songTitle][tuple][1] + "): " + replaceAll(bonusComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n");
      } 
      
      if (!(printAllScores)) {
       buildOutput("All scores:\n");
        scoreDict = bonusAllScoresWithNames[bonus_sorted_scores[song]];
        sorted_score_dict = Object.keys(scoreDict).sort(function(a, b) {
          if (scoreDict[a] != scoreDict[b]) return scoreDict[a] - scoreDict[b]
          else return -(a.localeCompare(b))});
        
        for (var score in sorted_score_dict.reverse()) {
          var user = sorted_score_dict[score];
          buildOutput(replaceAll(user, "\\_", "\_") + " " + bonusAllScoresWithNames[bonus_sorted_scores[song]][user] + "\n");
        }
      }

      buildOutput("\n");
    }
  }

// Print rank info

buildOutput("Ranks for each submission mark:\n(Import this data as a CSV file in Excel or Google Sheets to create a graph.)\n\n")

buildOutput("song," + rankIterations.toString() + "\n");

for (var song in (sorted_scores)) {
  var songTitle = sorted_scores[song];
  buildOutput(songTitle + "," + ranks[songTitle].toString() + "\n")
}
buildOutput("\n")

// Calculate and print album info

if (hasAlbums) {
  buildOutput("Overall " + category + " information\n\n");
  for (var album in albumOverallAverages) {
    buildOutput(String("# " + album + "\n\n---\n\n"));
    var average = (albumOverallAverages[album].reduce((a, b) => a + b, 0)) / (albumOverallAverages[album].length);
    var contavg = (albumAverageControversy[album].reduce((a, b) => a + b, 0)) / (albumAverageControversy[album].length);
    buildOutput(String("**Overall Average**: " + average.toFixed(3) + " **// Average Controversy:** " + contavg.toFixed(3) + "\n\n---\n\n"));
    if (hostAlbumComments[album]) {
      buildOutput(String(hostAlbumComments[album] + "\n\n"));
    }

    for (i in albumSongMap[album]) {
      var tempSongtitle = albumSongMap[album][i]
      var rank = regular_rank[tempSongtitle][0];
      var average = regular_rank[tempSongtitle][1];
      var total = average * usernames.length;
      main_title = tempSongtitle;
      if (tempSongtitle in hostNamefix) {
        main_title = hostNamefix[tempSongtitle];
      }
      if (tempSongtitle in hostAllSongImages) {
        main_title = "[" + main_title + "](" + hostAllSongImages[tempSongtitle] + ")";
      }
      buildOutput(String("* #" + rank + ": " + main_title + " | " + average.toFixed(3) + " | " + total.toFixed(1) + "\n"));
    }
    buildOutput("\n---\n\n")

    sorted_album_comments = albumAllComments[album].sort(function(a, b) { return albumUserAverages[album][a[0]] - albumUserAverages[album][b[0]] }).reverse();
    for (var index in sorted_album_comments) {
      var entry = sorted_album_comments[index];
      var username = entry[0];
      var comment = entry[1];
      var avg = albumUserAverages[album][username].toFixed(3);
      buildOutput("**" + username + "** " + "(" + avg + "): " + comment.trim() + "\n\n");
    }
    buildOutput(String("---\n\n"));
    buildOutput(String("User Averages:\n\n"));
    var sorted_album_scores = (Object.keys(albumUserAverages[album]).sort(function(a,b){return albumUserAverages[album][a]-albumUserAverages[album][b]})).reverse();
    for (var key in sorted_album_scores) {
      var user = sorted_album_scores[key];
      var avg = albumUserAverages[album][user];
      buildOutput(String(replaceAll(user, "\\_", "_")) + ": " + avg.toFixed(3) + "\n");
    }
    buildOutput(String("\n\n---\n\n"));
  }
}

// Print participant info

buildOutput("All participants:\n\n");
for (var username in usernames.sort(function(a, b){return a.localeCompare(b)})) {
  main_string = main_string + replaceAll(String(usernames[username]), "\\_", "_") + "\n"
}

buildOutput("\n");
var overallAverages = {}
buildOutput("Participant overall averages:\n\n");
for (var key in usernames) {
  var username = usernames[key];
  var curr_user_avg = (userAllScores[username].reduce((a, b) => a + b, 0) / sorted_scores.length).toFixed(3);
  overallAverages[username] = curr_user_avg;
}
var sorted_user_averages = (Object.keys(overallAverages).sort(function(a,b){return overallAverages[a]-overallAverages[b]})).reverse();
for (var key in sorted_user_averages) {
  var username = sorted_user_averages[key];
  var avg = overallAverages[username];
  buildOutput(replaceAll(username, "\\_", "_") + ": " + String(avg) + "\n");
}

buildOutput("\n");

// Calculate and print positivity and negativity scores

if (numParticipants != 1) {

  buildOutput("Participant negativity/positivity index:\n\n");
  var troll = {};
  var average_troll = [];
  var biggest_troll = {};

  var positivity = {};
  var average_positivity = [];
  var biggest_positive = {};

  for (var key in usernames) {
    var username = usernames[key];
    var troll_index = 0;
    var positive_index = 0;
    var biggestTroll = [0, null, 0];
    var biggestPositive = [0, null, 10];

    for (var songTitle in regular_rank) {
      var songDuple = regular_rank[songTitle];
      var songRank = songDuple[0]
      var songAvg = songDuple[1]
      var totalSongs = sorted_scores.length;
      var userScore = songAllScoresWithNames[songTitle][username]
      var cont = songAllControversies[songTitle];

      if (songAvg > userScore) {
        var factor = parseFloat(1.0) + parseFloat(parseFloat(totalSongs - songRank) / parseFloat(totalSongs));
        var songContrarian = ((songAvg - userScore) / cont) * factor;
        if (songContrarian > biggestTroll[0]) {
          biggestTroll = [songContrarian, songTitle, userScore];
        }
        troll_index = troll_index + songContrarian;
      }
      if (songAvg <= userScore) {
        var factor = parseFloat(1.0) + parseFloat(parseFloat(songRank) / parseFloat(totalSongs));
        var songPositivity = ((userScore - songAvg) / cont) * factor;
        if (songPositivity > biggestPositive[0]) {
          biggestPositive = [songPositivity, songTitle, userScore];
        }
        positive_index = positive_index + songPositivity;
      }
    }

    troll[username] = troll_index;
    biggest_troll[username] = biggestTroll;
    average_troll.push(troll_index);

    positivity[username] = positive_index;
    biggest_positive[username] = biggestPositive;
    average_positivity.push(positive_index);

  }

  var avgTroll = average_troll.reduce((a, b) => a + b, 0) / average_troll.length;
  var avgPositivity = average_positivity.reduce((a, b) => a + b, 0) / average_positivity.length;

  var sorted_positives = (Object.keys(positivity).sort(function(a,b){return positivity[a]-positivity[b]})).reverse();
  buildOutput("Average positivity: " + String(avgPositivity.toFixed(3)));
  buildOutput("\n\nPositivity score | Most positive take\n\n");
  for (key in sorted_positives) {
    var username = sorted_positives[key];
    var positiveScore = positivity[username];
    var biggestPositiveInfo = biggest_positive[username];
    var positiveSong = biggestPositiveInfo[1];
    var userScore = biggestPositiveInfo[2];
    if (positiveScore == 0) {
      buildOutput(replaceAll(username, "\\_", "_") + ": 0 | None\n");
    }
    else {
      buildOutput(replaceAll(username, "\\_", "_") + ": " + positiveScore.toFixed(3) + " | " + positiveSong + ": " + userScore + "\n");
    }
  }

  buildOutput("\n");

  var sorted_troll = (Object.keys(troll).sort(function(a,b){return troll[a]-troll[b]})).reverse();
  buildOutput("Average negativity: " + String(avgTroll.toFixed(3)));
  buildOutput("\n\nNegativity score | Most negative take\n\n");
  for (key in sorted_troll) {
    var username = sorted_troll[key];
    var trollScore = troll[username];
    var biggestTrollInfo = biggest_troll[username];
    var trolledSong = biggestTrollInfo[1];
    var userScore = biggestTrollInfo[2];
    if (trollScore == 0) {
      buildOutput(replaceAll(username, "\\_", "_") + ": 0 | None\n");
    }
    else {
      buildOutput(replaceAll(username, "\\_", "_") + ": " + trollScore.toFixed(3) + " | " + trolledSong + ": " + userScore + "\n");
    }
  }


  buildOutput("\n");

}

var avgAvg = averages.reduce((a, b) => a + b, 0) / averages.length;
var contAvg = controversies.reduce((a, b) => a + b, 0) / controversies.length;

// Print misc. info

buildOutput(String("Number of participants: " + numParticipants + "\n\n"));
buildOutput(String("Average score: " + avgAvg.toFixed(3) + "\n\n"));
buildOutput(String("Average controversy score: " + contAvg.toFixed(3) + "\n\n"));
buildOutput(String("Highest controversy: " + mostContSong[0] + " (" + mostContSong[1].toFixed(3) + ")\n\n"))
buildOutput(String("Lowest controversy: " + leastContSong[0] + " (" + leastContSong[1].toFixed(3) + ")\n\n"))
buildOutput(String("Most 11s: " + most11s[0] + " (" + most11s[1] + ")\n\n"))
buildOutput(String("Most 0s: " + most0s[0] + " (" + most0s[1] + ")\n\n"))

document.getElementById('output').value = main_string

};