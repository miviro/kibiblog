const domain = "https://m1v.es";

function goto (path) {
    fetch(domain + path)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(html => {
        document.getElementById('content').innerHTML = html;
        window.history.pushState({ content: html}, 'miviro', path);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('content').innerHTML = '<h1>404 Not Found</h1>';
    });
}

window.addEventListener('popstate', function (event) {
    if (event.state) {
        document.getElementById("content").innerHTML = event.state.content;
    }
});

document.addEventListener('DOMContentLoaded', function () { goto(window.location.pathname); } );