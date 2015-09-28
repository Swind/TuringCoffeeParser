#Vendor 
require! {
    "react": React
    "react": {Component, PropTypes}
    "redux": {createStore}
    "react-redux": {Provider, connect}
}

# JS modules
require! {
    "./components/cookbook": cookbook
    "./components/barista": barista
}

# CSS
require! {
    "./scss/coffee.scss": coffee-css
}

{div, a, header, main, span, nav} = React.DOM

root-elem = document.getElementById "body"
React.render (div {}, ["Hello World!"]), root-elem
