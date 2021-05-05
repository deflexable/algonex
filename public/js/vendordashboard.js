var stackIndexArr = ['.main-page-packer'],
    backButtonTimeout = null;

hasGottenProgressScript = true;
themeColorLight = 'blue';
userRefId = '';

if (history.pushState != undefined) {
    history.pushState(null, null, location.href);
}
history.back();
history.forward();
window.onpopstate = function () {
    clearTimeout(backButtonTimeout);
    backButtonTimeout = setTimeout(() => {
        if (stackIndexArr.length > 1) {
            if (stackIndexArr[stackIndexArr.length - 1] == '.seller-guide-packer' && stackIndexArr[stackIndexArr.length - 2] != '.seller-guide-packer') {
                $('.seller-guide-packer').empty();
            }
            downIndex();
        }
        console.log('existing up');
    }, 300);
    console.log('backing up');
    history.go(1);
};

function downIndex() {
    $('.pc-right-packert').children().hide();
    $('.pc-right-packert ' + stackIndexArr[stackIndexArr.length - 2]).show();
    stackIndexArr.pop();
    console.log('going down =' + stackIndexArr);
}
$('.vendor-room-search-con img, #vendor-profile-nav-back-button').click(function () {
    downIndex();
});

function navigateToggle(btnRef, containerRef) {
    $(btnRef).click(function () {
        adjustPageNavigation(containerRef);
    });
}

function adjustPageNavigation(containerRef) {
    stackIndexArr.push(containerRef);
    $('.pc-right-packert').children().hide();
    $(containerRef).show();
    console.log('stack =' + stackIndexArr);
}

const pageContainerRef = [
    ['.vendor-home-nav-btn', '.main-page-packer'],
    ['.my-store-nav-btn', '.my-store-packer'],
    ['.order-section-nav-btn', '.order-history-packer'],
    ['.vendor-room-nav-btn', '.vendor-room-packer'],
    ['.admin-sction-nav-btn', '.admin-section-packer'],
    ['.payment-section-nav-btn', '.payment-setting-con'],
    ['.vendor-nav-list-profile-div', '.vendor-profile-con'],
    ['.settings-section-nav-btn', '.settings-vendor-section-container'],
    ['.sellers-guide-nav-btn', '.seller-guide-packer'],
    ['.vendor-help-center-nav-btn', '.help-center-packer'],
    ['.vendor-product-upload-link', '.product-upload-packer']
];

for (var i = 0; i < pageContainerRef.length; i++) {
    const a = i;
    navigateToggle(pageContainerRef[a][0], pageContainerRef[a][1]);
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userId = user.uid;
        userRefId = userId;
        firebase.database().ref('vendors/' + userId).once('value', function (v) {
            const status = v.child('status').val();

            function sendBack() {
                history.back();
                location.href = "index.html";
            }
            if (status == 'pending') {
                alert('Your request as a seller is pending, Please check back later');
                sendBack();
            } else if (status == 'declined') {
                alert('Your request as a vendor has being declined');
                sendBack();
            } else if (status == 'suspended') {
                alert('Access denied!, your account has been suspended');
                sendBack();
            } else if (status == null) {
                alert('Access denied!, no resgistered vendors account found for this user');
                sendBack();
            }
            $('.initial-loader-con').hide();

            $('.vendors-profile-image-global').attr('src', v.child('img').val());
            $('.vendors-full-name-global').text(v.child('fName').val() + ' ' + v.child('lName').val());
            $('.vendors-email-global').text(v.child('email').val());
            $('#my-store-live-mode').click(function () {
                location.href = 'productsearch.html?sellerId=' + userId;
            });
            $('.vendors-profile-image-global, .vendor-profile-user-img').click(function () {
                showFullScreenImage($(this).attr('src'));
            });
        });
        firebase.database().ref('transactionInfo').orderByChild('response').equalTo('pending' + userId).once('value', function (p) {
            firebase.database().ref('transactionInfo').orderByChild('response').equalTo('delivered' + userId).once('value', function (dev) {
                var pendingCount = p.numChildren(),
                    delivered = dev.numChildren();
                if (pendingCount == 0) {
                    $('.order-spot-notifier').hide();
                } else {
                    $('.order-spot-notifier').show();
                    $('.order-spot-notifier').text(pendingCount);
                }
                $('.pending-order-temp-txt').text(pendingCount);

                var sProgress = 0;
                if (pendingCount >= delivered) {
                    sProgress = pendingCount * 7;
                    if (sProgress >= 73) {
                        sProgress = 73;
                    }
                } else {
                    sProgress = delivered * 7;
                    if (sProgress >= 100) {
                        sProgress = 100;
                    }
                }
                if (sProgress <= 13) {
                    sProgress = 13;
                }
                new CircleProgress('.sellProgress', {
                    max: 100,
                    value: sProgress,
                    textFormat: 'percent',
                });
            });
        });

        firebase.database().ref('Products').orderByChild('sellerId').equalTo(userId).once('value', function (s) {
            $('.total-product-temp-txt').text(s.numChildren());
        });
        firebase.database().ref('countFactory/vendorTicket/' + userId).once('value', function (t) {
            $('.ticket-temp-txt').text(changeNullToZero(t.val()));
        });
        firebase.database().ref('Users/' + userId).once('value', function (uShot) {
            $('.temp-head span').text(changeNullToZero(uShot.child('followers').val()) + ' followers');
            $('.available-balance-txt').text(changeNullToZero(uShot.child('balance').val()));
            if (uShot.child('isAdmin').exists()) {
                $('.admin-sction-nav-btn').css('display', 'flex');
                $('.admin-nav-stripe').css('display', 'block');
            } else {
                $('.admin-sction-nav-btn').hide();
                $('.admin-nav-stripe').hide();
            }
        });
    } else {
        alert('Access denied!, no login user found');
        setTimeout(() => {
            redirectToSignIn();
            console.log('redirecting');
        }, 700);
        //location.href = "index.html";
    }
});
var hasLoadedVendorsGuide = false,
    hasStampVendorsGuide = false;
$('.sellers-guide-nav-btn').click(function () {
    if (!hasLoadedVendorsGuide) {
        var guideTrigger = function () {
            hasStampVendorsGuide = true;
        }
        getAccessToScript(guideTrigger, 'js/vendorsGuideTxt.js');
    }
    if (hasStampVendorsGuide) {
        $('.seller-guide-packer').html(vendorGuideTxtPack);
    }
    hasLoadedVendorsGuide = true;
});

$('#p-upload-vendor-doc-link').click(function () {
    $('.sellers-guide-nav-btn').trigger('click');
});



//vendor room
var currentVendorRef = null,
    hasAttachVendorSearch = false,
    vendorsSearchTimeout = null,
    hasVendorRoomInitialize = false,
    vendorRoomQueryCount = 0,
    appendedVendorCount = 0,
    isLoadingVendorRoom = false;

$('.vendor-room-nav-btn').click(function () {
    if (!hasVendorRoomInitialize) {
        hasVendorRoomInitialize = true;
        currentVendorRef = firebase.database().ref('vendors').orderByChild('status').equalTo('approved');
        appendVendorsList(currentVendorRef);
    }
});

$(window).scroll(function () {
    if (($(this).scrollTop() + $(this).height()) >= ($('body').prop('scrollHeight') - $(this).height() * 2) && !isLoadingVendorRoom && appendedVendorCount != vendorRoomQueryCount && $('.vendor-room-packer').css('display') == 'block') {
        console.log('accepting scrolling');
        addMoreToVendorList(currentVendorRef);
    }
});
document.querySelector('.vendor-room-search-con input').oninput = function () {
    currentVendorRef.off('value');
    $('.vendor-room-count-txt').hide();
    $('.vendor-room-appender').html('');
    $('.vendor-room-spinner').css('display', 'block');
    const search = $(this).val().trim();

    if (hasAttachVendorSearch) {
        clearTimeout(vendorsSearchTimeout);
    }
    if (isNumber(search)) {
        if (search.length > 7 && search.length < 16) {
            hasAttachVendorSearch = true;
            vendorsSearchTimeout = setTimeout(() => {
                currentVendorRef = firebase.database().ref('vendors').orderByChild('phone').startAt(search).endAt(search + '\uf8ff')
                appendVendorsList(currentVendorRef);
            }, 1500);
        } else {
            $('.vendor-room-spinner').hide();
            $('.vendor-room-count-txt').show();
            $('.vendor-room-count-txt').text('Phone number must be at least 7 digits')
            $('.vendor-room-count-txt').css('color', 'red');
        }
    } else {
        if (search.length != 0) {
            var childQuery = 'fName';
            if (search.includes('@') || search.includes('.') || search.includes('.com')) {
                childQuery = 'email';
            }
            hasAttachVendorSearch = true;
            vendorsSearchTimeout = setTimeout(() => {
                currentVendorRef = firebase.database().ref('vendors').orderByChild(childQuery).startAt(search).endAt(search + '\uf8ff')
                appendVendorsList(currentVendorRef);
            }, 1500);
        } else {
            $('.vendor-room-spinner').hide();
            $('.vendor-room-count-txt').show();
            $('.vendor-room-count-txt').text('Search can\'t be empty');
            $('.vendor-room-count-txt').css('color', 'red');
        }
    }
}

function appendVendorsList(query) {
    query.once('value', function (v) {
        vendorRoomQueryCount = v.numChildren();
        $('.vendor-room-count-txt').show();
        if (vendorRoomQueryCount == 0) {
            $('.vendor-room-count-txt').text('No result found');
            $('.vendor-room-count-txt').css('color', 'red');
        } else {
            $('.vendor-room-count-txt').text(vendorRoomQueryCount + ' vendors found');
            $('.vendor-room-count-txt').css('color', 'grey');
        }
        appendedVendorCount = 0;
        $('.vendor-room-spinner').hide();
        addMoreToVendorList(query);
    });
}

function addMoreToVendorList(query) {
    $('.load-more-vendor-room').css('display', 'block');
    isLoadingVendorRoom = true;
    query.limitToLast((appendedVendorCount + 15)).once('value', function (v) {
        var vendorsHtml = '',
            ite = 0,
            indexer = 0;
        v.forEach(function (d) {
            ++indexer;
            if (indexer >= appendedVendorCount) {
                const name = d.child('fName').val() + ' ' + d.child('lName').val(),
                    location = d.child('localGovt').val() + ', ' + d.child('state').val(),
                    vUser = d.key;
                vendorsHtml += '<div class="vendor-friend-cont"><img src="' + d.child('img').val() + '" class="vendor-friend-img"><div class="venor-friend-info"><div class="vendor-room-name">' + name + '</div><div class="vendor-room-location"><img src="img/google-maps.svg" alt=""><div>' + location + '</div></div><div class="vendor-room-total-sold">Status: <b>Approved</b></div><div class="vendor-room-date"><img src="img/calendar.svg" alt=""><div>Joined on: ' + new Date(d.child('date').val()).toLocaleString("en-us") + '</div></div><div class="vendor-room-deal"><b>Deals in:</b>' + limitString(d.child('sellList').val(), 80) + '</div><table><tr><td value="' + vUser + '">Check Store</td><td value="' + vUser + '">Message</td></tr></table></div></div><div class="vendor-room-stripe"></div>';
                ++ite;
            }
        });
        $('.vendor-room-appender').append(vendorsHtml);
        appendedVendorCount += ite;
        isLoadingVendorRoom = false;
        $('.load-more-vendor-room').hide();

        $('.vendor-friend-img').off('click');
        $('.vendor-friend-cont table tr td:first-child').off('click');
        $('.vendor-friend-cont table tr td:last-child').off('click');

        $('.vendor-friend-img').click(function () {
            showFullScreenImage($(this).attr('src'));
        });
        $('.vendor-friend-cont table tr td:first-child').click(function () {
            location.href = 'productsearch.html?sellerId=' + $(this).attr('value');
        });
        $('.vendor-friend-cont table tr td:last-child').click(function () {
            accessMessageDialog($(this).attr('value'));
        });
    });
}