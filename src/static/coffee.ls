#Vendor 
require! {
    "jquery": jquery
    "materialize-css": materialize 
    "holderjs": holderjs
    "mithril": mithril
}

# JS modules
require! {
    "./components/cookbook": cookbook
    "./components/barista": barista
}

# CSS
require! {
    "./scss/barista.scss": barista-css 
    "./scss/coffee.scss": coffee-css
    "./scss/cookbook.scss": cookbook-css
}

m.route (document.getElementById "wrapper"), "/", {
    "/": cookbook
    "/barista/:name": barista
}
