var theButton = document.getElementById("fetchCommits");
theButton.onclick = fetchUserCommitDates;

/*
Main function that makes the API calls and processes response. Input is gitUsername, token and num_commits
*/

/* Approach is outlined here:
  More recently developed, we can use Commit search API and filter by the committer. This is a new API still in Preview mode however this offers a way to retrieve the commits for a user.
  More details: https://docs.github.com/en/rest/reference/search#search-commits
*/
function fetchUserCommitDates() {
  var gitHubUsername = document.getElementById('username').value;
  var accessToken = document.getElementById('token').value;

  var commits = [];
  var num_commits = 60;
  var toDo = 0;
  var done = 0;

  $.ajax({
    url: 'https://api.github.com/search/commits?q=committer:' + gitHubUsername + '&order=desc&per_page=' + num_commits,
    dataType: "json",

    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', accessToken);
      // Search commit API requires media header to be passed.
      xhr.setRequestHeader('Accept', "application/vnd.github.cloak-preview+json");
    },
    success: function(response) { //get commits
      var countDone = 0;
      for (var j = 0; j < num_commits; j++) {
        if (j < response.total_count) {
          var i_commit = response.items[j].commit;
          var date = new Date(i_commit.author.date);
          commits.push(date);
        }
        countDone++;
        if (countDone == num_commits) {
          done++;
        }
      }
      exportFile(commits.join("\n"), 'GitCommits.csv');
    }
  });
}

function exportFile(csv, fileName) {
  console.log('csv is', csv.length);
  var fileType = 'txt/csv;charset=utf-8';
  if (navigator.msSaveBlob) { // IE 
    navigator.msSaveBlob(new Blob([csv], {
      type: fileType
    }), fileName);
  } else {
    var e = document.createElement('a');
    e.setAttribute('href', 'data:' + fileType + ',' + encodeURIComponent(csv));
    e.setAttribute('download', fileName);
    e.style.display = 'none';
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  }
}
