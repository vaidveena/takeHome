var theButton = document.getElementById("fetchCommits");
theButton.onclick = fetchUserCommitDates;

/*
Main function that makes the API calls and processes response. Input is gitUsername, token
*/
function fetchUserCommitDates() {

  var gitHubUsername = document.getElementById('username').value;
  var accessToken = document.getElementById('token').value;

  console.log('user inputs are', gitHubUsername, accessToken);

  /*
  Function to Sort dates
  */
  var sort_asc = function(commit1, commit2) {
    console.log('commit1 is', commit1);
    console.log('commit2 is', commit2);
    if (commit1.date < commit2.date) return 1;
    if (commit1.date > commit2.date) return -1;
    return 0;
  };

  var commits = [];
  var done = 0;
  var countToDo = 0;
  var num_commits = 60; //per Problem Description
  try {

  /* Approach is outlined here:
  Get the repositories of the user, and get the names of the repository in an array.
  		Call to API Link - api.github.com/users/:user/repos
  For each repository, get the list of commits authored by that user.
			api.github.com/repos/:user/{repo}/commits?author=:user.
  Since Github APIs return only 30 rows, I'm using query_param per_page to ask the API to fetch 100 rows. This could be changed to   60 for our use case..
  */
    $.ajax({
      url: 'https://api.github.com/users/' + gitHubUsername + '/repos' + '?per_page=100',
      dataType: "json",

      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', accessToken);
      },
      success: function(response) { //get repos
        countToDo = response.length;

        for (var i = 0; i < response.length; i++) {
          //code for each repo
          var repo = response[i].url;
          // Pagination using per_page to get 60 records in descending order
          var commit_url = repo + "/commits?" + 'author=' + gitHubUsername + '&order=desc&per_page=60';
          $.ajax({
            url: commit_url,
            dataType: "json",
            beforeSend: function(xhr) {
              xhr.setRequestHeader('Authorization', accessToken);
            },
            success: function(commit_response) {
              var commitCount = 0;
              // num_commits is 60 to get the last 60 commits
              for (var j = 0; j < num_commits; j++) {
                if (j < commit_response.length) {
                  var i_commit = commit_response[j].commit;
                  //Get the author and date. We use only dates.
                  var date = i_commit.committer.date;
                  var author = i_commit.author.name;
                  commits.push(date);
                }
                commitCount++;
                if (commitCount == num_commits) {
                  done++;
                }
              }
              --countToDo;

              if (countToDo == 0) {
                console.log('commits is', commits);
                // Sort dataset by dates 
                commits.sort(sort_asc);
                // Store result in Csv.
                exportFile(commits.join("\n"), 'GitCommits.csv');
                //Calculate Mean Time
                calculateMeanTime(commits);
              }
            }
          });
        } //end of for loop
      }
    })
  } catch (e) {
    console.log(e.constructor)
  }
}

/*
Export result as CSV.
*/
function exportFile(csv, fileName) {
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


/*
Takes an array of dates as input and calculates the cumulative diff in days between two pairs of dates. Finally compute the average.
*/
function calculateMeanTime(commits)
{
  var sum = 0;
  var prevdate = false;
  for(var k in commits) {
    var thedate = moment(commits[k], "YYYY-MM-DDTHH:mm:ssZ");
    if(prevdate) {
      sum += Math.abs(prevdate.diff(thedate, 'days'));
    }
    prevdate = thedate;
  }
  var avg = (sum / (commits.length - 1));
  console.log('calculateMeanTime', avg);
  return avg;
}



