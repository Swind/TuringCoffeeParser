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
    "./scss/coffee.scss": coffee-css
}

navbar = !->
    return m \div.navbar-fixed,
                m \nav, 
                    m \div.nav-wrapper,
                        m \a.button-collapse, {href: "#", data-activates:"mobile-nav"},
                            m \i.material-icons, \menu

                        m \ul.right.hide-on-med-and-down,
                           * m \li,
                                 m \a, 
                                     m \i.material-icons, \view_modules

                        m \ul.side-nav#mobile-nav,
                            m \li,
                                m \a, \item1


sidebar = !->
    return m \ul,
                * m \li.logo,
                      m \a.brand-logo, {href: "#"} 

                * m \li.bold,
                      m \a, {href: "#"}, \Cookbooks

                * m \li.bold,
                      m \a, {href: "#"}, \Printer

                * m \li.bold,
                      m \a, {href: "#"}, \Config

layout = !->
    return m \div.row,
                * m \div.col.s3, sidebar! 
                * m \div.col.s9, \main

m.render document.body, [
    navbar!
    layout!
]

$(document).ready !->
    $(".button-collapse").sideNav!

/*
m.route (document.getElementById "body"), "/", {
    "/": cookbook
    "/barista/:name": barista
}
*/
