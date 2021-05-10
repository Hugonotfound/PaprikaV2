var user = document.currentScript.getAttribute('user');
var allGithubWidj = document.currentScript.getAttribute('allwidgets');

function getGithub(WidgetNumber) {
    
    const Name = document.getElementById('GithubName-' + WidgetNumber);
    const Location = document.getElementById('GithubLoc-' + WidgetNumber);
    const ProfilImage = document.getElementById('GitIcon-' + WidgetNumber);
    const Viewers = document.getElementById('GithubViewers-' + WidgetNumber);
    const Projets = document.getElementById('GithubProjets-' + WidgetNumber);
    const Desc = document.getElementById('GithubDesc-' + WidgetNumber);
    
    var userSearch = document.getElementById('GithubSearchName-' + WidgetNumber).value;
    
    const link = "https://cors-anywhere.herokuapp.com/https://api.github.com/users/" + userSearch;

    fetch(link).then(function(response) {
        return response.json();
    }).then(function(data) {
        Name.textContent = data.login;
        ProfilImage.setAttribute("src", data.avatar_url);
        Projets.textContent = "Public Repos: " + data.public_repos;
        Viewers.textContent = "Followers: " + data.followers;
        Location.textContent = (data.location == null ? "Nowhere" : data.location) + " - " + data.company;
        Desc.textContent = data.bio;
    }).catch(function(error) {
        console.log(error);
    });
}

function StartGithubUpdate() {
    var githubWidj = JSON.parse(allGithubWidj);

    githubWidj.forEach(function(widget) {
        setInterval(getGithub(widget.position), widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    StartGithubUpdate();
});