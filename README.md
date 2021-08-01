# compass-takeHome

Screenshot of program taking username and token as input. Output is stored in GitCommits.csv file.

Steps to run this program:

In JsFiddle, copy the GetUserInput.html in the Html portion of fiddle. This presents the UI to take inputs from user (gitUserName and token)
Core logic resides in fetchUserCommitDates.js file. When user clicks fetch commits button, the GitHub API calls to repos and commits are performed and result set is sorted and dates are returned in CSV file.
Another approach to use Search Commit API is coded in SearchCommitAPI.js.


<img width="1618" alt="Screen Shot 2021-08-01 at 4 07 45 PM" src="https://user-images.githubusercontent.com/9029916/127788006-ac6051be-37eb-4a78-a2ce-5a833f312794.png">


Approach 1:

Take github username and token as input.

Make a call to api.github.com/users/username/repos and get the names of the repository.

For each repository, get the list of commits authored by that user.
To do this, make a call to api.github.com/repos/username/{repo}/commits?author=username.

Please note the filter author=username in the above call to filter only this users' commit.

Get the commit date and add to commits array.

Since Github APIs return only 30 rows, I'm using query_param per_page to ask the API to fetch 60 rows. This code block is enclosed in try catch block to deal with exceptions such as empty Git repos.

Sort the list of commits from all repositories and build the final resultset of dates.

Export it to CSV calling exportFile function. Result with dates are downloaded in GitCommits.csv file.

Call calculateMeanTime and pass the array of dates as input. This function cumulatively calculates the difference between each pair of dates and computes the final average which gives the mean # of days.

Approach 2:

Upon further reading, I came across Search Commit API which is a more recent offering by GitHub where all commits for a user can be retrieved. This is a cleaner approach however this is in Preview mode. Since Github APIs return only 30 rows, I'm using query_param per_page to ask the API to fetch 60 rows. 

Here's a sample call to retrieve all commits made by the gituser.
https://api.github.com/search/commits?q=committer:' + gitHubUsername + '&order=desc&per_page=' + num_commits,

Using this we can retrieve the 60 commits made by this gitUser. Parse the resultset to get the dates and download it GitCommits.csv.
