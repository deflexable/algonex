function getUrlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURIComponent(results[1]) || 0;
}

function isInLocalStorage(key) {
    if (window.localStorage.getItem(key) === null)
        return false;
    else
        return true;
}

function limitString(value, limit) {
    if (value.length <= limit)
        return value;
    else
        return value.substring(0, limit) + '...';
}

function backToSender(message) {
    if (message) {
        alert(message);
    } else {
        alert('Invalid response recieved');
    }
    history.back();
    location.href = 'index.html';
}

/*{"status":"successful","customer":{"name":"Onabanjo ademola","email":"deflexable@gmail.com","phone_number":"09019445081"},"transaction_id":1786237,"tx_ref":"DEFLEXZAHpz5t8nJK5i9tkw6Ifcn0","flw_ref":"FLW137151608622435222","currency":"NGN","amount":119580}*/

//'http://127.0.0.1:5500/payment.html?checkoutBucket=-MNE8F8vOUG3YIYVdSbjFLEXEQ3,&devm=station&paym=wallet&pcode=54746546&state=Adamawa&localG=Ganaye'
var cartBucket = getUrlParam('checkoutBucket'),
    localGov = getUrlParam('lg'),
    deliveryMethod = getUrlParam('devm'),
    paymentMethod = getUrlParam('paym'),
    postalCode = getUrlParam('pcode'),
    deliveryPerState = null,
    totalCost = null,
    paymentDes = '',
    paymentTitle = '',
    state = getUrlParam('state'),
    address = '';

if (state != null) {
    state = state.toLowerCase();
}
if (paymentMethod == null) {
    paymentMethod = 'bank';
}

if (isInLocalStorage('naijaBDeivAddr9wq')) {
    address = window.localStorage.getItem('naijaBDeivAddr9wq');
}

$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDvYN58aKhJWxK0Fz1CTWx_i20Gjf4YPWw",
        authDomain: "algonex-7.firebaseapp.com",
        databaseURL: "https://algonex-7-default-rtdb.firebaseio.com",
        projectId: "algonex-7",
        storageBucket: "algonex-7.appspot.com"
    };
    firebase.initializeApp(config);

    function sendBack() {
        alert("Badly Formatted Url Request");
        history.back();
        location.href = "index.html";
    }

    function g(ref) {
        $(ref).css('display', 'none');
    }

    function sh(ref) {
        $(ref).css('display', 'block');
    }

    function s(ref) {
        return $(ref).val().trim();
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var email = "",
        fName = "",
        phoneNo = "";

    function v(ref, errorTxt, expectedLength, exceededLength) {
        document.querySelector(ref).oninput = function () {
            const i = s(ref);
            switch (ref) {
                case '#f-name':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        fName = i;
                    } else {
                        fName = '';
                    }
                    break;
                case '#phoneNo':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        phoneNo = i;
                    } else {
                        phoneNo = '';
                    }
                    break;
                case '#email':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        email = i;
                    } else {
                        email = '';
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
    var isListeningToInput = false;

    function readyInput() {
        if (!isListeningToInput) {
            isListeningToInput = true;
            v('#f-name', 'Your name', 7, 27);
            v('#phoneNo', 'Phone number', 10, 15);
            v('#email', 'Email', 7, 130);
        }
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            function initializePayment() {
                $('#payBtn').html('Pay $' + numberWithCommas(totalCost));
                readyInput();
                $('#payBtn').click(function () {
                    $('.form-div input').trigger('oninput');
                    //url trigger = https://us-central1-algonex-500d9.cloudfunctions.net/payment?queryType=cartItem&state=
                    if (fName != '' && phoneNo != '' && email != '') {
                        var callBackTrigger = function (response) {
                            console.log(JSON.stringify(response));
                            alert(response);
                        };
                        makePayment(callBackTrigger);
                    } else {
                        alert('Please fill the required fields');
                    }
                });
                document.title = paymentDes
            }

            if (cartBucket != null && state) {
                const cartArr = cartBucket.split(',');
                firebase.database().ref('deliveryRate/' + state).once('value', function (delivShot) {
                    deliveryPerState = delivShot.val();
                    if (deliveryPerState != null) {
                        totalCost = 0;
                        paymentDes = 'Paying for ';
                        console.log('retrieving!');
                        var iteCount = 0;
                        for (var i = 0; i < cartArr.length; i++) {
                            const a = i,
                                node = cartArr[a].split('*|>')[0],
                                value = cartArr[a].split('*|>')[1];

                            console.log('nd=' + node + ' &val=' + value + ' &a=' + a);

                            firebase.database().ref('Products/' + node).once('value', function (p) {
                                const price = p.child('pPrice').val();
                                var dis = p.child('discount').val();
                                paymentDes += p.child('pName').val() + ' (' + value + ') ';
                                console.log('backing up n=' + node + ' &v=' + value + ' &d=' + deliveryPerState + ' &cb=' + cartBucket);

                                if (price == null) {
                                    sendBack();
                                    return;
                                }
                                if (dis == null) {
                                    dis = 0;
                                }
                                const deliv = (Math.ceil((deliveryPerState * price) / 100) * value),
                                    discount = (Math.ceil((dis * price) / 100) * value);
                                totalCost += ((parseFloat(price) * value) - discount + deliv);
                                ++iteCount;
                                if (iteCount == cartArr.length) {
                                    if (iteCount == 1) {
                                        paymentTitle = limitString(p.child('pName').val(), 35) + ' (' + value + ')';
                                    } else {
                                        paymentTitle = 'Paying for ' + iteCount + ' items';
                                    }
                                    paymentDes += 'by ' + user.uid;
                                    initializePayment();
                                }
                            });
                        }
                    } else {
                        console.log('backing up');
                        sendBack();
                    }
                });
            } else {
                backToSender();
            }

            /* var serviceId = serviceId,
                 billersCode = billersCode,
                 amount = amount,
                 variationCode = variationCode,
                 phone = phone,
                 insuredName = params.insuredName,
                 engineNo = params.engineNo,
                 chasisNo = params.chasisNo,
                 plateNo = params.plateNo,
                 carMake = params.carMake,
                 carColor = params.carColor,
                 carModel = params.carModel,
                 yrMake = params.yrMake,
                 contactAddress = params.contactAddress;*/

            function getRandomString(length) {
                var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var result = '';
                for (var i = 0; i < length; i++) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                return result;
            }

            function makePayment() {
                const ref = 'DEFLEX' + getRandomString(25);

                var triggerService = function (data) {
                    alert('Done');
                    console.log(data);
                    return;
                    var addMessage = firebase.functions().httpsCallable('payment'),
                        serviceObj = {
                            amount: totalCost,
                            phone: phoneNo
                        };
                    if (cartBucket != null && state) {
                        serviceObj.cart = cartBucket;
                        serviceObj.devm = deliveryMethod;
                        serviceObj.paym = paymentMethod;
                        serviceObj.pcode = postalCode;
                        serviceObj.addr = address;
                        serviceObj.ref = ref;
                        serviceObj.localG = localGov;
                        serviceObj.state = state;
                    }
                    addMessage(serviceObj).then((result) => {
                        console.log(JSON.stringify(result));
                    }).catch((error) => {
                        console.log('error =' + JSON.stringify(error));
                    });
                }

                if (paymentMethod == 'wallet') {
                    console.log('going wallet');
                    triggerService();
                    return;
                }

                var paymentObj = {
                    public_key: "FLWPUBK-8aac40af5dea00f0a16de2dec6df04c9-X",
                    tx_ref: ref,
                    amount: totalCost,
                    currency: "NGN",
                    country: "NG",
                    payment_options: "card,mobilemoney,ussd",
                    customer: {
                        email: email,
                        phone_number: phoneNo,
                        name: fName,
                    },
                    meta: {
                        user: user.uid,
                    },
                    callback: function (data) {
                        console.log('flutting ' + data);
                        triggerService(data);
                    },
                    onclose: function () {
                        alert('Failed to initialize payment');
                    },
                    customizations: {
                        title: paymentTitle,
                        description: paymentDes,
                        logo: "https://algonex-500d9.web.app/img/logo.png",
                    },
                };

                if (cartBucket != null && state) {
                    paymentObj.meta.address = address;
                    paymentObj.meta.postalCode = postalCode;
                    paymentObj.meta.state = state;
                    paymentObj.meta.localGovt = localGov;
                    paymentObj.meta.deliveryMethod = deliveryMethod;
                    paymentObj.meta.cart = cartBucket;
                }
                FlutterwaveCheckout(paymentObj);
            }
        } else {
            alert("You must have an account before making payment");
            location.href = 'signin.html?i=' + encodeURIComponent(location.href);
        }
    });
});