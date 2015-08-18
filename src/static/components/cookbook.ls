cookbook = {}

# ================================================================================
#
#   Model 
#
# ================================================================================
class CookbookItem
    (item) ->
        @name = item.name
        @description = item.description
        @content = item.content

cookbook.vm = do ->
    vm = {}

    vm.init = ! ->
        vm.cookbooks = m.prop {}

    # Get cookbook list
    vm.list = ! ->
        return m.request(
            {
                method: 'GET',
                url: '/cookbooks'
            }
        )
        .then((raw_data) ->
            cookbooks = for index, item of raw_data 
                console.log index, item
                new CookbookItem(item)

            vm.cookbooks(cookbooks)
        )

    vm
# ================================================================================
#
#   View 
#
# ================================================================================

cookbook.view = (ctrl) ->

    generate_buttons = (cookbook) ->
        m "div.buttons" {config: ctrl.button_config} [
            (m "div.button.button-edit" {
                onclick: ctrl.edit_onclick.bind cookbook
            } "Edit")
            (m "div.button.button-brew" {
                onclick: ctrl.brew_onclick.bind cookbook
            } "Brew")
        ]

    generate_card = (cookbook) ->
        m "div.col-xs-12.col-sm-4.col-md-3.col-lg-2", [
            (m "div.card[href='/editor/#{cookbook.name}']",
            {
                config: m.route
                onclick: ctrl.card_onclick
            },
            [
                (m "div.header", cookbook.name)
                (m "div.divider")
                (m "div.description" cookbook.description)
                (generate_buttons cookbook)
            ])
        ]

    new_card = ! ->
        return m "div.col-xs-12.col-sm-4.col-md-3.col-lg-2", [
            (m "div.card[href='/barista/new']",
            {
                onclick: ctrl.new_cookbook_onclick
            },
            [
                (m "div.header", "New")
                (m "div.glyphicon.glyphicon-plus")
            ])
        ]


    cards = (cookbooks) ->
        cookbook_cards = for cookbook in cookbooks
            generate_card(cookbook)

        if cookbook_cards == null
            cookbook_cards = []

        cookbook_cards[*] = new_card!

        m "div", cookbook_cards


    [
        (m "div.row.card-container", [cards(cookbook.vm.cookbooks!)])
    ]

# ================================================================================
#
#   Controller 
#
# ================================================================================
cookbook.controller = ->
    cookbook.vm.init!
    cookbook.vm.list!

    ctrl = {}
    ctrl.card_onclick = (e) !->
        btns = document.getElementsByClassName 'buttons'

        for btn in btns
            btn.style.display = 'none'

        for child in this.children
            if child.className is 'buttons'
                child.style.display = 'flex'

    ctrl.button_config = (element, isInit) !->
        if isInit is false
            element.style.display = 'none'

    ctrl.new_cookbook_onclick = ->
        m.route "/barista/new"

    ctrl.brew_onclick = ->
        m.route "/barista/#{this.name}"

    ctrl.edit_onclick = ->
        m.route "/editor/#{this.name}"

    ctrl

module.exports = cookbook
