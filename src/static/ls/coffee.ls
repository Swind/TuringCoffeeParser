require! {
    "components/cookbook.js": cookbook
}

m.route (document.getElementById "wrapper"), "/", {
    "/": cookbook
}
