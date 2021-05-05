$(document).ready(function () {

    var isWindowPc = false,
        isCartEmpty = true,
        currentCartCount = 'off';
        
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userId = user.uid;

            function initializeCartLayout() {
                firebase.database().ref('cart/' + userId).once('value', function (shot) {
                    $('.cart-content-appender').empty();
                    shot.forEach(function (d) {
                        const contKey = d.key,
                            cartNum = d.val();
                        firebase.database().ref('Products/' + contKey).once('value', function (p) {
                            const name = p.child('pName').val(),
                                price = p.child('pPrice').val(),
                                dis = p.child('discount').val(),
                                stock = p.child('stock').val();
                            var img = p.child('pImg').val(),
                                disPrice = price;

                            if(dis != null){
                                disPrice = (parseFloat(price) - Math.ceil((dis * price) / 100));
                            }

                            var cartHtml = '<div class="cart-item-cont" id="cartItemContRef' + contKey + '"><div class="cart-img-con"><img src="' + img + '" alt="failed to load image" class="cart-prod-img" /><img src="img/deleteRed.svg" alt="delete" class="remove-cart-btn"></div>'
                                + '<div class="cart-info" ><div class="item-name">' + name + '</div><b>&#8358;' + numberWithCommas(disPrice) + '</b>';
                            if (dis != null) {
                                cartHtml += '<del>&#8358;' + numberWithCommas(price) + '</del>';
                            }
                            cartHtml += '<div class="item-avail"><span>Available in stock</span><div>' + stock + '</div></div><div class="quan-div"><span>Quantity</span><div class="minus-quan">-</div>'
                                + '<input type="number" placeholder="1" value="' + cartNum + '"><div class="plus-quan">+</div></div><div class="item-cost">Cost: &#8358;' + numberWithCommas(cartNum * disPrice) + '</div></div></div><div class="cart-stripe"></div>';
                            $('.cart-content-appender').append(cartHtml);

                            const id = '#cartItemContRef' + contKey,
                                costTxt = $(id + " .item-cost");
                            var cartRef = firebase.database().ref('cart/' + userId + '/' + contKey);
                            cartRef.off('value');

                            $(id + ' .cart-prod-img').click(function () {
                                document.location.href = 'onecart.html?productId=' + contKey;
                            });
                            $(id + ' .remove-cart-btn').click(function () {
                                if(confirm('Do you want to remove this item from your cart')){
                                    cartRef.remove();
                                }
                            });

                            function prodCal(btnIdentifier) {
                                var q = $(id + ' input').val().trim();
                                if (btnIdentifier == "+") {
                                    if (q.length == 0) {
                                        q = 1;
                                    } else {
                                        ++q;
                                    }
                                } else if (btnIdentifier == "-") {
                                    if (q != 0) {
                                        --q;
                                    }
                                    if (q.length == 0) {
                                        q = 1;
                                    }
                                }
                                costTxt.html("Loading...");
                                if (q.length == 0) {
                                    cartRef.set(0);
                                } else {
                                    $(id + ' input').val(q);
                                    cartRef.set(q);
                                }
                            }

                            document.querySelector(id + ' input').oninput = function () {
                                prodCal("key");
                            };
                            //handling button
                            $(id + " .minus-quan").click(function () {
                                prodCal("-");
                            });

                            $(id + " .plus-quan").click(function () {
                                prodCal("+");
                            });
                            cartRef.on('value', function (calShot) {
                                const cp = calShot.val();
                                if (cp != null) {
                                    costTxt.html("Cost: &#8358;" + numberWithCommas(cp * disPrice));
                                } else {
                                    $(id).slideToggle(700);
                                    setTimeout(() => {
                                        $(id).remove();
                                    }, 1000);
                                }
                            });
                        });
                    });
                    $('.page-spinner-notify').hide();
                });
            }
            initializeCartLayout();

            firebase.database().ref('cart/' + userId).on('value', function (shot) {
                $('.calc-content').html('<div class="total-cart-body"><span>Items cost</span><b>.</b></div><div class="total-cart-body"><span>Discount</span><b>.</b></div><div class="total-cart-body">'
                    + '<span>Delivery cost</span><b>.</b></div><div class="total-cart-body total-cart-body-sum"><span>Total amount</span><b>.</b></div><img src="img/spinner.gif" alt="">');

                var totalDiscount = 0,
                    realAmount = 0,
                    index = 0;
                const cartCount = shot.numChildren();
                if (currentCartCount != 'off' && currentCartCount != cartCount) {
                    initializeCartLayout();
                }
                currentCartCount = cartCount;
                if (cartCount == 0) {
                    isCartEmpty = true;
                    $('.no-cart-temp').show();
                    $('body').css('backgroundColor', 'white');
                    $('.padder').hide();
                    $('.checkout-butt').hide();
                    document.title = 'Sorry, your Cart is currently empty';
                } else {
                    document.title = 'Cart has '+cartCount+' item';
                    isCartEmpty = false;
                    $('.no-cart-temp').hide();
                    $('.padder').show();
                    if (isWindowPc) {
                        $('body').css('backgroundColor', 'rgb(242, 242, 242)');
                        $('.checkout-butt').hide();
                    } else {
                        $('body').css('backgroundColor', 'white');
                        $('.checkout-butt').css('display', 'flex');
                    }
                }

                shot.forEach(function (d) {
                    const cartNum = d.val();
                    firebase.database().ref('Products/' + d.key).once('value', function (p) {
                        const price = p.child('pPrice').val();
                        var dis = p.child('discount').val();

                        if (dis == null) {
                            dis = 0;
                        }

                        totalDiscount += (Math.ceil((dis * price) / 100) * cartNum);
                        realAmount += (parseFloat(price) * cartNum);
                        ++index;
                        if (index == cartCount) {
                            const calcHtml = '<div class="total-cart-body"><span>Items cost</span><b>&#8358;' + numberWithCommas(realAmount) + '</b></div><div class="total-cart-body"><span>Discount</span><b>- &#8358;' + numberWithCommas(totalDiscount) + '</b></div>'
                                + '<div class="total-cart-body"><span>Delivery cost</span><b>Not included yet</b></div><div class="total-cart-body total-cart-body-sum"><span>Total amount</span><b>&#8358;'
                                + numberWithCommas(realAmount - totalDiscount) + '</b></div>';
                            $('.calc-content').html(calcHtml);
                        }
                    });
                });
            });
        }else{
            redirectToSignIn();
        }
    });

    $(window).resize(function () {
        if ($(this).width() >= 800) {
            isWindowPc = true;
            $('.checkout-butt').hide();
        } else {
            isWindowPc = false;
            if (isCartEmpty) {
                $('.checkout-butt').hide();
            } else {
                $('.checkout-butt').css('display', 'flex');
            }
        }
    });
    $(window).resize();

    $('#checkout-btn, #checkout-btn-pc').click(function(){
        location.href = 'checkout.html';
    });

});