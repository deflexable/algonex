$(document).ready(function () {

    if (isInLocalStorage('naijaBDeivAddr9wq')) {
        $('#address').val(window.localStorage.getItem('naijaBDeivAddr9wq'));
    }

    //for validations
    function g(ref) {
        $(ref).css('display', 'none');
    }

    function sh(ref) {
        $(ref).css('display', 'block');
    }

    function s(ref) {
        return $(ref).val().trim();
    }

    function initRad(ref, errorTxt) {
        $('input[name=' + ref + ']').change(function () {
            const r = $('input[name=' + ref + ']:checked').val();
            if (ref == 'deliv-rad') {
                deliveryMethod = r;
            } else {
                paymentMethod = r;
            }
            if (!r) {
                sh('#' + ref + '-error');
                $('#' + ref + '-error').html('Please pick a ' + errorTxt);
                console.log('bad rad =' + r);
            } else {
                console.log('good rad =' + r);
                g('#' + ref + '-error');
            }
        });
    }

    function validateSelect(ref, errorTxt) {
        $(ref).change(function () {
            const i = $(ref).val();
            if (ref == '#state') {
                state = i;
            } else {
                localGov = i;
            }
            if (i == 'none') {
                sh(ref + '-error');
                $(ref + '-error').html(errorTxt + ' is required');
            } else {
                g(ref + '-error');
            }
        });
    }

    function v(ref, errorTxt, expectedLength, exceededLength) {
        document.querySelector(ref).oninput = function () {
            const i = s(ref);
            switch (ref) {
                case '#postal-code-input':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        postalCode = i;
                    } else {
                        postalCode = '';
                    }
                    break;
                case '#address':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        address = i;
                    } else {
                        address = '';
                    }
                    break;
            }
            if (i.length < expectedLength) {
                sh(ref + '-error');
                $(ref + '-error').html(errorTxt + ' must contain at least ' + expectedLength + ' characters');
            } else if (i.length > exceededLength) {
                sh(ref + '-error');
                $(ref + '-error').html(errorTxt + ' must not exceed ' + exceededLength + ' characters');
            } else {
                g(ref + '-error');
            }
        };
    }

    var deliveryMethod = '',
        paymentMethod = '',
        postalCode = '',
        state = 'none',
        localGov = 'none',
        address = '',
        checkoutBucket = null,
        deliveryRate = 0,
        isWindowPc = false,
        isCartEmpty = true,
        currentCartCount = 'off';

    v('#postal-code-input', 'Postal code', 3, 15);
    v('#address', 'Residential adress', 9, 250);
    validateSelect('#localGov', 'Local goverment');

    initRad('deliv-rad', 'delivery method');
    initRad('pay-rad', 'payment method');

    $('#checkout-btn-pc').click(function () {
        $('.delivery-info-con input, .delivery-info-con textarea').trigger('oninput');
        $('.delivery-info-con input, #localGov').trigger('change');
        console.log('devm =' + deliveryMethod + '& paym=' + paymentMethod + '& postc=' + postalCode + ' &state=' + state + ' & lg=' + localGov + ' & addr=' + address);
        if (deliveryMethod && paymentMethod && postalCode != '' && state != 'none' && localGov != 'none' && address != '') {
            if (deliveryRate != null && checkoutBucket != null) {
                location.href = 'payment.html?checkoutBucket=' + encodeURIComponent(checkoutBucket) + '&devm=' + deliveryMethod + '&paym=' + paymentMethod + '&pcode=' + postalCode + '&state=' + state + '&localG=' + localGov;
                window.localStorage.setItem('naijaBDeivAddr9wq', address);
            } else {
                alert('Please wait while we estimate your cart items, you can refresh the page if estimation takes too long');
            }
        } else {
            alert('Please fill the required fields');
        }
        if (state == 'none') {
            $('#state-error').show();
            $('#state-error').html('State of residence is required');
        }
    });

    const stateArr = getState(),
        localGovtArr = getLocalGovt();
    var stateHtml = '<option value="none">Select Residential State</option>';
    for (i = 0; i < stateArr.length; i++) {
        stateHtml += '<option value="' + stateArr[i] + '">' + stateArr[i] + '</option>';
    }

    $('#localGov').change(function () {
        localGov = $(this).val();;
    });

    function stack99(input) {
        if (input >= 1000)
            return '99+';
        else
            return input;
    }
    //for queries calculation
    var currentState = 'none',
        productId = getUrlParam('productId');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userId = user.uid;
            var rp = userId;
            if (productId != null) {
                rp = userId + '/' + productId;
            }
            var cartCalRef = firebase.database().ref('cart/' + rp);
            cartCalRef.off('value');

            $('#state').html(stateHtml);
            $('#state').off('change');
            $('#state').change(function (e) {
                const cs = $(this).val();

                if (cs == 'none') {
                    $('#localGov').html('<option value="none">Select Local Government</option>');
                    deliveryRate = 0;
                    cartCalRef.off('value');
                    initializeCartLayout();
                    estimateCartCost();
                } else {
                    if (currentState != cs) {
                        console.log('get delivery rate ' + cs);
                        deliveryRate = null;
                        cartCalRef.off('value');
                        firebase.database().ref('deliveryRate/' + cs.toLowerCase()).once('value', function (d) {
                            deliveryRate = d.val();
                            console.log('set delivery rate ' + deliveryRate);
                            initializeCartLayout();
                            estimateCartCost();
                        });
                    }
                    currentState = cs;
                    state = cs;
                    const v = e.target.selectedIndex - 1;
                    var sub = '<option value="none">Select Local Government</option>';
                    for (i = 0; i < localGovtArr[v].length; i++) {
                        sub += '<option value="' + localGovtArr[v][i] + '">' + localGovtArr[v][i] + '</option>';
                    }
                    $('#localGov').html(sub);
                }
            });
            validateSelect('#state', 'State of residence');

            function initializeCartLayout() {
                $('.cart-item-spin-loader').show();
                cartCalRef.once('value', function (shot) {
                    $('.cart-content-appender').empty();

                    if (productId == null) {
                        shot.forEach(function (d) {
                            stampItems(d);
                        });
                    } else {
                        stampItems(shot);
                    }
                    $('.cart-item-spin-loader').hide();

                    function stampItems(d) {
                        var cartNum = d.val();
                        if ((cartNum == null || cartNum == 0) && productId != null) {
                            firebase.database().ref('cart/' + rp).set(1);
                            cartNum = 1;
                        }
                        if (cartNum != 0) {
                            const contKey = d.key;
                            firebase.database().ref('Products/' + contKey).once('value', function (p) {
                                const name = p.child('pName').val(),
                                    price = p.child('pPrice').val(),
                                    dis = p.child('discount').val(),
                                    deliveryCost = (Math.ceil((deliveryRate * price) / 100) * cartNum);

                                var img = p.child('pImg').val(),
                                    disPrice = price;

                                if (dis != null) {
                                    disPrice = (parseFloat(price) - Math.ceil((dis * price) / 100));
                                }

                                var cartHtml = '<div class="cart-item-cont" id="cartItemContRef' + contKey + '"><div class="cart-img-con"><div class="item-cart-count">' + stack99(cartNum) + '</div><img src="' +
                                    img + '" alt="failed to load image" class="cart-prod-img" /></div>' +
                                    '<div class="cart-info" ><div class="item-name">' + name + '</div><b>&#8358;' + numberWithCommas(disPrice) + '</b><div class="delivery-cost">Delivery cost: &#8358;' + deliveryCost + '</div>' +
                                    '<div class="item-cost">Cost: &#8358;' + numberWithCommas(((cartNum * disPrice) + parseFloat(deliveryCost)) + parseFloat(deliveryCost)) + '</div></div></div><div class="cart-stripe"></div>';
                                $('.cart-content-appender').append(cartHtml);

                                const id = '#cartItemContRef' + contKey,
                                    costTxt = $(id + " .item-cost");
                                var cartRef = firebase.database().ref('cart/' + userId + '/' + contKey);
                                cartRef.off('value');

                                cartRef.on('value', function (calShot) {
                                    const cp = calShot.val();
                                    if (cp != null) {
                                        costTxt.html("Cost: &#8358;" + numberWithCommas((cp * disPrice) + parseFloat(deliveryCost)));
                                    } else {
                                        $(id).slideToggle(700);
                                        setTimeout(() => {
                                            $(id).remove();
                                        }, 1000);
                                    }
                                });
                            });
                        }
                    }

                });
            }
            initializeCartLayout();

            function estimateCartCost() {
                checkoutBucket = null;
                cartCalRef.on('value', function (shot) {
                    $('.calc-content').html('<div class="total-cart-body"><span>Items cost</span><b>.</b></div><div class="total-cart-body"><span>Discount</span><b>.</b></div><div class="total-cart-body">' +
                        '<span>Delivery cost</span><b>.</b></div><div class="total-cart-body total-cart-body-sum"><span>Total amount</span><b>.</b></div><img src="img/spinner.gif" alt="">');

                    var totalDiscount = 0,
                        realAmount = 0,
                        deliveryCost = 0,
                        indexCount = 0,
                        cartBucket = '',
                        indexInnerCount = 0;

                    const cartCount = shot.numChildren();
                    var cartCountIte = cartCount;

                    if (productId != null) {
                        cartCountIte = 1;
                    }
                    if (currentCartCount != 'off' && currentCartCount != cartCount) {
                        initializeCartLayout();
                    }
                    currentCartCount = cartCount;
                    if (productId == null) {
                        shot.forEach(function (d) {
                            stampCalculations(d);
                        });
                    } else {
                        stampCalculations(shot);
                    }

                    function stampCalculations(d) {
                        var cartNum = d.val();
                        if ((cartNum == null || cartNum == 0) && productId != null) {
                            firebase.database().ref('cart/' + rp).set(1);
                            cartNum = 1;
                        }
                        if (cartNum != 0) {
                            ++indexCount;
                            const cKey = d.key;
                            cartBucket += cKey + '*|>' + cartNum;
                            if (indexCount != cartCountIte) {
                                cartBucket += ',';
                            }
                            firebase.database().ref('Products/' + cKey).once('value', function (p) {
                                const price = p.child('pPrice').val();
                                var dis = p.child('discount').val();
                                if (dis == null) {
                                    dis = 0;
                                }
                                totalDiscount += (Math.ceil((dis * price) / 100) * cartNum);
                                realAmount += (parseFloat(price) * cartNum);
                                deliveryCost += (Math.ceil((deliveryRate * price) / 100) * cartNum);
                                ++indexInnerCount;
                                if (indexInnerCount == cartCountIte) {
                                    const calcHtml = '<div class="total-cart-body"><span>Items cost</span><b>&#8358;' + numberWithCommas(realAmount) + '</b></div><div class="total-cart-body"><span>Discount</span><b>- &#8358;' + numberWithCommas(totalDiscount) + '</b></div>' +
                                        '<div class="total-cart-body"><span>Delivery cost</span><b>+ &#8358;' + deliveryCost + '</b></div><div class="total-cart-body total-cart-body-sum"><span>Total amount</span><b>&#8358;' +
                                        numberWithCommas((realAmount - totalDiscount) + deliveryCost) + '</b></div>';
                                    $('.calc-content').html(calcHtml);
                                    $('.checkout-splitter').html('Cart item (' + indexInnerCount + ')');
                                    document.title = 'Checking out '+indexInnerCount+' item';
                                }
                            });
                        }
                    }

                    if (indexCount == 0) {
                        isCartEmpty = true;
                        $('.no-cart-temp').show();
                        $('body').css('backgroundColor', 'white');
                        $('.padder').hide();
                        $('.checkout-butt').hide();
                        document.title = 'Sorry, your Cart is currently empty';
                    } else {
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
                    checkoutBucket = cartBucket;
                });
            }
            estimateCartCost();
        } else {
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
});