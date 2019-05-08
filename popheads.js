var main_string = "";

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

function findAllScores(scores) {
  var sorted_scores = Object.keys(scores).sort(function(a,b){
    if (scores[a] == scores[b]) {
      return b.localeCompare(a);
    }
    else {
      return scores[a] - scores[b];
    }
  }).reverse();
  curr_score = 500;
  for (var key in sorted_scores) {
    var c_user = sorted_scores[key];
    var c_score = scores[c_user];
    if (curr_score == c_score) {
      main_string = main_string + ", " + c_user;
    }
    else {
      var total = countTotal(scores, c_score);
      if (Number.isInteger(c_score)) {
        main_string = main_string + String("\n\n(" + c_score + " x" + total + ") ");
      }
      else {
        main_string = main_string + String("\n\n(" + c_score.toFixed(1) + " x" + total + ") ");
      }
      main_string = main_string + c_user;
      curr_score = c_score;
    }
  }
  main_string = main_string + String("\n\n");
  //throw new Error("");
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

function findHighestLowestScores(scores, average, string) {
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
    else if (((highestScore - score) < 2) && ((score - 0.5 > average))) {
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
    else if (((score - lowestScore) < 2) && ((score + 0.5 < average))) {
      if (!(score in lowest)) {
        lowest[score] = [];
      }
      lowest[score].push(name);
    }
  }


  main_string = main_string + String("\n\n**Highest scores:**\n\n");
  var sorted = Object.keys(highest).sort(sorter).reverse();

  for (var key in (sorted)) {
    var score = key;
    score = parseFloat(score);
    if (Number.isInteger(score)) {
      var length = highest[sorted[key]].length;
      main_string = main_string + String("(" + sorted[score] + " x" + length + ") ");
    }
    else {
      var length = highest[sorted[key]].length;
      score.toFixed(1);
      main_string = main_string + String("(" + sorted[score] + " x" + length + ") ");
    }
    lastusername = highest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)}).slice(-1)[0];
    for (var username in highest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)})) {
      var user = highest[sorted[key]][username];
      main_string = main_string + String(user);
      if (user === lastusername) {
        main_string = main_string + String("\n\n");
      }
      else {
        main_string = main_string + String(", ");
      }
    }
  }

  var sorted = Object.keys(lowest).sort(sorter).reverse();

  main_string = main_string + String("\n**Lowest Scores:**\n\n");
  for (var key in sorted) {
    var score = key;
    if (Number.isInteger(score)) {
      var length = lowest[sorted[key]].length;
      main_string = main_string + String("(" + sorted[score] + " x" + length + ") ");
    }
    else {
      var length = lowest[sorted[key]].length;
      score = parseFloat(score);
      score.toFixed(1);
      main_string = main_string + String("(" + sorted[score] + " x" + length + ") ");
    }
    lastusername = lowest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)}).slice(-1)[0];
    for (var username in lowest[sorted[key]].sort(function(a, b) {return a.localeCompare(b)})) {
      var user = lowest[sorted[key]][username];
      main_string = main_string + String(user);
      if (user === lastusername) {
        main_string = main_string + String("\n\n");
      }

      else {
        main_string = main_string + String(", ");
      }
    }
  }
  main_string = main_string + String("\n");
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
  var user = escape(String(document.getElementById('username').value));
  var body = escape(String(document.getElementById('msginput').value));
  var subject = escape(String(document.getElementById('subject').value));
  document.getElementById("msgoutput").value = String("https://www.reddit.com/message/compose?to=" + user + "&subject=" + subject + "&message=" + body);
  
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

  var usernames = [];
  var songs = [];
  var bonusSongs = [];
  var albums = [];

  var songComments = {};
  var songAvgScores = {};
  var songAllScores = {};
  var songAllScoresWithNames = {};
  var songAllControversies = {};

  var hostSet = false;

  var bonusComments = {};
  var bonusAvgScores = {};
  var bonusAllScores = {};
  var bonusAllScoresWithNames = {};

  var albumOverallAverages = {};
  var albumUserAverages = {};
  var albumAllComments = {};

  var hostSongComments = {};
  var hostAlbumComments = {};
  var hostAllScoresLinks = {};
  var hostAllListenHereLinks = {};
  var hostAllSongImages = {};
  var hostNamefix = {};
  var hosts = [];

  var hostInfo1 = {};
  var hostInfo2 = {};
  var hostInfo3 = {};

  var songArtistMap = {};
  var userAllScores = {};

  var hasAlbums = true;
  var category = "Album";
  var ranks = {};

  var gaveZero = false;
  var gaveEleven = false;
  var bonus = false;
  var host = false;
  var username = "";
  var artist = "";
  var album = "";
  var albumAllScores = [];
  var songAlbumMap = {};

  var hostAddInfo1 = {};
  var hostAddInfo2 = {};
  var hostAddInfo3 = {};

  var require11Comment = false;
  var require0Comment = false;

  var regexSong = /(.+?):\s*([\d\.\/10]+)?\s*(.+)?/;
  var regexUsername = /Username:\s*(.+)/;
  var regexAllScores = /AS:\s*(.+)/;
  var regexListenHere = /LH:\s*(.+)/;
  var regexImage = /IMAGE:\s*(.+)/;
  var regexArtist = /ARTIST:\s*(.+)/;
  var regexAddInfo1 = /AI1:\s*(.+)/;
  var regexAddInfo2 = /AI2:\s*(.+)/;
  var regexAddInfo3 = /AI3:\s*(.+)/;
  var regexCategory = /CATEGORY:\s*(.+)/;
  var regexNameFix = /NF:\s*(.+)/;

  var lines = input.split("\n");
  var lines_length = lines.length;

  var userSongs = [];
  var bonussongs = [];

  var cleanDecimals = false;
  var printAllScores = false;

  function recordUsername(line) {
    user = regexUsername.exec(line)[1].trim().replace(/_/g, "\\_");
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
    try {
      var splitline = regexSong.exec(line);
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }

    splitline = regexSong.exec(line);
    
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

    if (hasAlbums) {
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

    if (songScore == 200) {
      document.getElementById('output').value = String("Error: User '"+ username + "' did not give a score to track '" + songName + "'. Exiting program.");
      throw new Error("?");
    }

    if ((songScore < 1 && songScore != 0) || (songScore > 10 && songScore != 11)) {
      document.getElementById('output').value = String("Error: User " + username + " gave an invalid score of " + String(songScore) + " to track " + songName + ". Exiting program.");
      throw new Error("?");
    }

    if (songScore == 0) {
      if (gaveZero) { 
        document.getElementById('output').value = String("Error: User " + username + " gave two zeros. Triggered for song " + songName + ". Exiting program.");
        throw new Error("?");
      }
      else if (require0Comment && (!(songComment))) {
        document.getElementById('output').value = ("Error: User " + username + " did not give their 0 a comment. Triggered for song " + songName + ". Exiting program.");
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

    try {
      var splitline = regexSong.exec(line);
    }
    catch(err) {
      document.getElementById('output').value = "Following line under user '" + username + "' throws error: \n" + line;
      throw new Error("?");
    }

    splitline = regexSong.exec(line);

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
      if (songs.indexOf(songName) == -1) {
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

  for (var i = 0; i < lines_length; i++) {

    line = lines[i]
    if (!!line.trim()) {
      line = line.trim('\n').trim()
      console.log(line)

      if (line.startsWith("Username")) {
        username = recordUsername(line);
      }
      
      else if (line.startsWith("HOST")) {
        host = true;
        hostSet = true;
        if (!(username in hosts)) {
          hosts.push(username);          
        }
      }

      else if (line.startsWith("CATEGORY")) {
        if (host) {
          category = regexCategory.exec(line)[1];
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

      else if (line.startsWith("CLEANDECIMALS")) {
        if (host) {
          cleanDecimals = true;
        }
      }

      else if (line.startsWith("PRINTALLSCORES")) {
        if (host) {
          printAllScores = true;
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
            console.log(missingSongs);
            console.log(j);
            console.log(songs[j]);
            missingSongs.push(songs[j]);
          }
        }
        if (missingSongs.length > 0) {
          console.log(songs);
          document.getElementById('output').value = ("Error: User " + username + " is missing scores for the song(s): " + missingSongs.toString() + ". Exiting program.");
          throw new Error("?");
        }
        username = "";
        artist = "";
        userSongs = [];
        bonus = false;
        gaveZero = false;
        gaveEleven = false;
        host = false;
      }

      else if (line.startsWith("AS:")) {
        if (host) {
          hostAllScoresLinks[songName] = regexAllScores.exec(line)[1];
        }
      }

      else if (line.startsWith("LH:")){
        if (host) {
          hostAllListenHereLinks[songName] = regexListenHere.exec(line)[1];
        }
      }

      else if (line.startsWith("IMAGE:")) {
        if (host) {
          hostAllSongImages[songName] = regexImage.exec(line)[1];
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
          hostNamefix[songName] = regexNameFix.exec(line)[1];
        }
      }
      
      else if (line.startsWith("ARTIST:")) {
        if (host) {
          artist = regexArtist.exec(line)[1];
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

      else {

        if (hostSet == false) {
          host = true;
        }
        
        if (!(bonus)) {
          recordSong(line);
        }

        else {
          recordBonusSong(line);
        }
      }
    }
  }

// Time to print everything!

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
sorted_scores = Object.keys(songAvgScores).sort(function(a,b){return songAvgScores[a]-songAvgScores[b]}).reverse();
bonus_sorted_scores = Object.keys(bonusAvgScores).sort(function(a,b){return bonusAvgScores[a]-bonusAvgScores[b]}).reverse();

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

// Regular track rank

sorted_regular_rank = Object.keys(regular_rank).sort(function(a,b){return regular_rank[a][0] - regular_rank[b][0]});
sorted_bonus_rank = Object.keys(bonus_rank).sort(function(a,b){return bonus_rank[a][0] - bonus_rank[b][0]});

main_string = main_string + String("Results:\n\n");
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
  main_string = main_string + String("* #" + rank + ": " + main_title + " | " + average.toFixed(3) + " | " + total.toFixed(1) + "\n");
}
main_string = main_string + String("\n");

// Bonus track rank

if (Object.keys(bonusAvgScores).length > 0) {
  main_string = main_string + String("Bonus results:\n\n");
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
    main_string = main_string + String("* #" + rank + ": " + main_title + " | " + average.toFixed(3) + " | " + total.toFixed(1) + "\n");
  }
  main_string = main_string + String("\n");
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
  songTotal = (songAllScores[sorted_scores[song]].reduce((a, b) => a + b, 0));
  songTitle = sorted_scores[song];

  var stdDev = StandardDeviation(songAllScores[songTitle]);
  controversies.push(stdDev);
  if (hasAlbums) {
    var newalbum = songAlbumMap[songTitle];
    if (!(newalbum in albumAverageControversy)) {
      albumAverageControversy[newalbum] = [];
    }
    albumAverageControversy[newalbum].push(stdDev);
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

  main_string = main_string + String("# #" + regular_rank[songTitle][0] + ": " + main_title + "\n\n---\n\n**Average:** " + avg + " **// Total Points:** " + songTotal.toFixed(1) + " **// Controversy:** " + stdDev.toFixed(3));
  
  if (songTitle in hostAllListenHereLinks) {
    main_string = main_string + String(" **// [Listen here](" + hostAllListenHereLinks[songTitle] + ")**");
  }
  if (songTitle in hostAddInfo1) {
    main_string = main_string + String("\n\n" + replaceAll(hostAddInfo1[songTitle], "(n)", "\n\n"));
  }

  main_string = main_string + ("\n\n---");
  if (songTitle in hostAddInfo2) {
    main_string = main_string + String("\n\n" + replaceAll(hostAddInfo2[songTitle], "(n)", "\n\n") + "\n");
  }

  if (printAllScores) {
    findAllScores(songAllScoresWithNames[songTitle]);
  }
  else {
    findHighestLowestScores(songAllScoresWithNames[songTitle], parseFloat(avg));
  }

  if (songTitle in hostAllScoresLinks) {
    main_string = main_string + String("**[All scores](" + hostAllScoresLinks[songTitle] + ")**\n\n")
  }

  main_string = main_string + String("---\n\n")
  
  if (songTitle in hostAddInfo3) {
    main_string = main_string + String(replaceAll(hostAddInfo3[songTitle], "(n)", "\n\n") + "\n\n---\n\n");
  }
  
  if (songTitle in hostSongComments) {
    if (mul_hosts) {
      for (var tuple in hostSongComments[songTitle].sort(tuple_sorter)) {
        main_string = main_string + "**" + hostSongComments[songTitle][tuple][0] + "** (" + hostSongComments[songTitle][tuple][1] + "): " + replaceAll(hostSongComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n";
      }
    }

    else {
      main_string = main_string + hostSongComments[songTitle][0][2] + "\n\n";
    }
  }

  main_string = main_string + "---\n\n"

  for (var tuple in songComments[songTitle].sort(tuple_sorter)) {
    main_string = main_string + "**" + songComments[songTitle][tuple][0] + "** (" + songComments[songTitle][tuple][1] + "): " + replaceAll(songComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n";
  }
  main_string = main_string + ("All scores:\n");
  scoreDict = songAllScoresWithNames[songTitle];
  sorted_score_dict = Object.keys(scoreDict).sort(function(a, b) {
    if (scoreDict[a] != scoreDict[b]) return scoreDict[a] - scoreDict[b]
    else return -(a.localeCompare(b))});
  if (numParticipants != Object.keys(scoreDict).length) {
    document.getElementById('output').value = String("Error: wrong number of scores for " + String(songTitle) + ". Should be " + String(numParticipants) +" but is actually " + String(Object.keys(scoreDict).length));
    throw new Error("?");
  }
  for (var score in sorted_score_dict.reverse()) {
    var user = sorted_score_dict[score];
    main_string = main_string + replaceAll(user, "\\_", "\_") + " " + songAllScoresWithNames[songTitle][user] + "\n";
  }
  main_string = main_string + String("\n")
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

      main_string = main_string + String("# #" + bonus_rank[songTitle][0] + ": " + main_title + "\n\n---\n\n**Average:** " + parseFloat(bonusAvgScores[songTitle]).toFixed(3) + " **// Total Points:** " + songTotal + " **// Controversy:** " + stdDev.toFixed(3));
      
      if (songTitle in hostAllListenHereLinks) {
        main_string = main_string + String(" **// [Listen here](" + hostAllListenHereLinks[songTitle] + ")**");
      }
      
      if (songTitle in hostAddInfo1) {
        main_string = main_string + String("\n\n" + replaceAll(hostAddInfo1[songTitle], "(n)", "\n\n"));
      }

      main_string = main_string + ("\n\n---");
      if (songTitle in hostAddInfo2) {
        main_string = main_string + String("\n\n" + replaceAll(hostAddInfo2[songTitle], "(n)", "\n\n") + "\n");
      }
      
      if (printAllScores) {
        findAllScores(bonusAllScoresWithNames[bonus_sorted_scores[song]]);
      }
      else {
        findHighestLowestScores(bonusAllScoresWithNames[bonus_sorted_scores[song]], parseFloat(bonusAvgScores[bonus_sorted_scores[song]]));
      }

      if (songTitle in hostAllScoresLinks) {
        main_string = main_string + String("**[All scores](" + hostAllScoresLinks[songTitle] + ")**\n\n")
      }



      main_string = main_string + String("---\n\n")
      
      if (songTitle in hostAddInfo3) {
        main_string = main_string + String(replaceAll(hostAddInfo3[songTitle], "(n)", "\n\n") + "\n\n---\n\n");
      }

      if (songTitle in hostSongComments) {
        if (mul_hosts) {
          for (var tuple in hostSongComments[songTitle].sort(tuple_sorter)) {
            main_string = main_string + "**" + hostSongComments[songTitle][tuple][0] + "** (" + hostSongComments[songTitle][tuple][1] + "): " + replaceAll(hostSongComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n";
          }
        }

        else {
          main_string = main_string + hostSongComments[songTitle][0][2] + "\n\n";
        }
      }

      main_string = main_string + "---\n\n"

      for (var tuple in bonusComments[songTitle].sort(tuple_sorter)) {
        main_string = main_string + "**" + bonusComments[songTitle][tuple][0] + "** (" + bonusComments[songTitle][tuple][1] + "): " + replaceAll(bonusComments[songTitle][tuple][2], "(n)", "\n\n") + "\n\n";
      } 
      
      main_string = main_string + ("All scores:\n");
      scoreDict = bonusAllScoresWithNames[bonus_sorted_scores[song]];
      sorted_score_dict = Object.keys(scoreDict).sort(function(a, b) {
        if (scoreDict[a] != scoreDict[b]) return scoreDict[a] - scoreDict[b]
        else return -(a.localeCompare(b))});
      
      for (var score in sorted_score_dict.reverse()) {
        var user = sorted_score_dict[score];
        main_string = main_string + replaceAll(user, "\\_", "\_") + " " + bonusAllScoresWithNames[bonus_sorted_scores[song]][user] + "\n";
      }
      main_string = main_string + ("\n");
    }
  }

// Album info

if (hasAlbums) {
  main_string = main_string + ("Overall " + category + " information\n\n");
  for (var album in albumOverallAverages) {
    main_string = main_string + String("# " + album + "\n\n---\n\n");
    var average = (albumOverallAverages[album].reduce((a, b) => a + b, 0)) / (albumOverallAverages[album].length);
    var contavg = (albumAverageControversy[album].reduce((a, b) => a + b, 0)) / (albumAverageControversy[album].length);
    main_string = main_string + String("**Overall Average**: " + average.toFixed(3) + " **// Average Controversy:** " + contavg.toFixed(3) + "\n\n---\n\n");
    if (hostAlbumComments[album]) {
      main_string = main_string + String(hostAlbumComments[album] + "\n\n---\n");
    }

    sorted_album_comments = albumAllComments[album].sort(function(a, b) { return albumUserAverages[album][a[0]] - albumUserAverages[album][b[0]] }).reverse();
    for (var index in sorted_album_comments) {
      var entry = sorted_album_comments[index];
      var username = entry[0];
      var comment = entry[1];
      var avg = albumUserAverages[album][username].toFixed(3);
      main_string = main_string + "**" + username + "** " + "(" + avg + "): " + comment.trim() + "\n\n";
    }
    main_string = main_string + String("---\n\n");
    main_string = main_string + String("User Averages:\n\n");
    var sorted_album_scores = (Object.keys(albumUserAverages[album]).sort(function(a,b){return albumUserAverages[album][a]-albumUserAverages[album][b]})).reverse();
    for (var key in sorted_album_scores) {
      var user = sorted_album_scores[key];
      var avg = albumUserAverages[album][user];
      main_string = main_string + String(replaceAll(user, "\\_", "_")) + ": " + avg.toFixed(3) + "\n";
    }
    main_string = main_string + String("\n\n---\n\n");
  }
}

// Participant info

main_string = main_string + ("All participants:\n\n");
for (var username in usernames.sort(function(a, b){return a.localeCompare(b)})) {
  main_string = main_string + replaceAll(String(usernames[username]), "\\_", "_") + "\n"
}

main_string = main_string + "\n";

var avgAvg = averages.reduce((a, b) => a + b, 0) / averages.length;
var contAvg = controversies.reduce((a, b) => a + b, 0) / controversies.length;

// Misc. info

main_string = main_string + String("Number of participants: " + usernames.length + "\n\n");
main_string = main_string + String("Average score: " + avgAvg.toFixed(3) + "\n\n");
main_string = main_string + String("Average controversy score: " + contAvg.toFixed(3) + "\n\n");

document.getElementById('output').value = main_string

};
