if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// adding eventlisteners to remove btns, input, addToCart btns
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

// StripeCheckout is an obj from the stripe lib
// .configure() initializes the payment window
// creating a handler obj
var stripeHandler = StripeCheckout.configure({
    key: stripePubKey,  // this key was in the server -> sent to frontend js, now we're using it here
    locale: 'auto',  // display language for the popup when hit purchase 

    // hit purchase, info sent to stripe, stripe send us a token obj
    // this obj has all the info and an id. with id and the secKey we can charge the user
    token: function (token) {
        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]  // this is the input element
            var quantity = quantityElement.value  // this gets the value
            var id = cartRow.dataset.itemId
            // add this to items
            items.push({
                id: id,
                quantity: quantity
            })
        }

        // now send info to server, and get the response - fetch
        fetch('/purchase', {
            method: 'POST',  // post request: send info to server and let server do stuff
                            // get request: send info to server and get back info
            headers: {
                'Content-Type': 'application/json',   // send json
                'Accept': 'application/json'  // receive json

            },
            body: JSON.stringify({  // make json into string
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            alert('data.message')
            var cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
        }).catch(function(error) {
            console.error(error)
        })
    }
})

// call stripe
function purchaseClicked() {
    // alert('Thank you for your purchase')
    
    var priceEle = document.getElementsByClassName('cart-total-price')[0]  // we want the 1st in this arr
    // stripe expect cents
    var price = parseFloat(priceEle.innerText.replace('$', '')) * 100
    stripeHandler.open({
        amount: price
    })
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imgSrc = shopItem.getElementsByClassName('shop-item-img')[0].src
    // dataset access all attributes beginning with 'data-'
    // ours is called data-item-id, but js uses camelcase so itemId
    var id = shopItem.dataset.itemId
    addItemToCart(title, price, imgSrc, id)
    updateCartTotal()
}

function addItemToCart(title, price, imgSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id   // now row has id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added in the cart')
            return
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column cart-column-item">
        <img class="cart-img" src="${imgSrc}">
        <span class="cart-item-title"> ${title} </span>
    </div>
    <span class="cart-price cart-column cart-column-price">${price}</span>
    <div class="cart-quantity cart-column cart-column-quantity">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger btn-primary" type="button">Remove</button>
    </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}


