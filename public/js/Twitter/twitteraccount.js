var Twitteruser = document.currentScript.getAttribute('user');
var TwitterallCurencyWidgets = document.currentScript.getAttribute('allwidgets');

const TWITTER_CONSUMER_KEY = "8ugmsNBY66k75Amqdhva8xfZb";
const TWITTER_CONSUMER_SECRET = "QoYsf4NdDn874r3ISdXNWSOiUpYr7xL2roUBXlRRyIZCtT2w9G";
const TWITTER_CONSUMER_BEARER = "AAAAAAAAAAAAAAAAAAAAAL1LKAEAAAAAP8zqbyuvdsOD6H%2FqUwf0UVmAN1U%3DCTcZJClJ4LRIVVxQRIk5YWLmPeyuGycxKh7sfuVOzwIPUbqdS1"

function getTwitter(widget, Theuser) {
    const Follow = document.getElementById('Follow-' + widget.position);
    const Icon = document.getElementById('TwitterIcon-' + widget.position);
    const Followers = document.getElementById('Followers-' + widget.position);
    const TwitterName = document.getElementById('TwitterName-' + widget.position);
    const TwitterDiscriminator = document.getElementById('TwitterDiscriminator-' + widget.position);

    fetch(link).then(function(response) {
        return response.json();
    }).then(function(data) {
        TwitterName.textContent = Theuser.twitterjson.displayName;
        Follow.textContent = Theuser.twitterjson._json.friends_count;
        Followers.textContent = Theuser.twitterjson._json.followers_count;
        TwitterDiscriminator.textContent = "@" + Theuser.twitterjson.username;
    }).catch(function(error) {
        console.log(error);
    });
}

function StartTwitterUpdate() {
    var myuser = JSON.parse(Twitteruser);
    var currencyWidg = JSON.parse(TwitterallCurencyWidgets);

	currencyWidg.forEach(function(widget) {
        setInterval(getTwitter(widget, myuser), widget.param1);
	})
}

document.addEventListener('DOMContentLoaded', function() {
    StartTwitterUpdate();
});