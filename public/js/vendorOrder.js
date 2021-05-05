$(document).ready(function () {

    const storeScroll = $('#order-history-flex-container'),
        scrollWidth = $('.order-history-packer').width();

    function setTab(position) {
        $('#order-history-tab th').css('backgroundColor', 'rgb(61, 61, 61)');
        $('#order-history-tab th').eq(position).css('backgroundColor', 'blue');
    }

    function limitString(value, limit) {
        if (value.length <= limit)
            return value;
        else
            return value.substring(0, limit) + '...';
    }

    var mainCurrentPage = 1,
        midCurrentPage = 1,
        thirdCurrentPage = 1,
        hasInitiatedOrderStore = false;

    var expiryTimeout = [];

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userId = user.uid;
            setUpStoreTable(0, 'pending-order', 'pending');
            setUpStoreTable(1, 'rejected-order', 'rejected');
            setUpStoreTable(2, 'delivered-order', 'delivered');

            $('.order-section-nav-btn').click(function(){
                if(!hasInitiatedOrderStore){
                    $('#order-history-tab th').eq(0).trigger('click');
                }
                hasInitiatedOrderStore = true;
              });

            function setUpStoreTable(tabIndex, sectionPrefix, queryParam) {
                $('#order-history-tab th').eq(tabIndex).off('click');
                $('#order-history-tab th').eq(tabIndex).click(function () {
                    setTab(tabIndex);
                    storeScroll.scrollLeft(tabIndex * scrollWidth);
                    $('#order-history-flex-container').children().css('height', '0px');
                    $('#order-history-flex-container').children().eq(tabIndex).css('height', 'initial');

                    const mainSpin = $('#' + sectionPrefix + '-section-spinner'),
                        mainTemp = $('#' + sectionPrefix + '-not-found-temp'),
                        mainBox = $('#' + sectionPrefix + '-page-box'),
                        mainTable = $('#' + sectionPrefix + '-table');

                    mainSpin.css('display', 'block');
                    mainTemp.css('display', 'none');
                    mainTable.html('');
                    firebase.database().ref('transactionInfo').orderByChild('status').equalTo(queryParam+userId).once('value', function (shot) {
                        mainSpin.css('display', 'none');

                        var shotNum = shot.numChildren();

                        if (shotNum == 0) {
                            mainTemp.css('display', 'block');
                            mainBox.css('display', 'none');
                        } else {
                            mainTemp.css('display', 'none');
                            mainBox.css('display', 'block');
                            mainBox.empty();

                            for (var i = 1; i <= Math.ceil(shotNum / 20); i++) {
                                const a = i;
                                mainBox.append('<b>' + i + '</b>');
                                mainBox.children().eq(a - 1).off('click');
                                mainBox.children().eq(a - 1).click(function () {
                                    pageStoreRecord(a);
                                });
                            }

                            if (sectionPrefix == 'pending-order') {
                                pageStoreRecord(mainCurrentPage);
                            } else if (sectionPrefix == 'rejected-order') {
                                pageStoreRecord(midCurrentPage);
                            } else {
                                pageStoreRecord(thirdCurrentPage);
                            }

                            function pageStoreRecord(page) {
                                mainBox.children().css('backgroundColor', 'green');
                                mainBox.children().eq(page - 1).css('backgroundColor', 'blue');

                                var thirdIndex = 'Date',
                                    fourthIndex = 'Status';

                                if (sectionPrefix == 'pending-order') {
                                    mainCurrentPage = page;
                                    thirdIndex = 'Expiry';
                                    fourthIndex = 'Toggle';

                                    for (var i = 0; i < expiryTimeout.length; i++) {
                                        clearInterval(expiryTimeout[i]);
                                    }
                                } else if (sectionPrefix == 'rejected-order') {
                                    midCurrentPage = page;
                                } else {
                                    thirdCurrentPage = page;
                                }

                                mainTable.html('<tr class="p-head"><th>Info</th> <th>Qty</th><th>' + thirdIndex + '</th><th>' + fourthIndex + '</th></tr>');
                                var index = 0;

                                firebase.database().ref('/.info/serverTimeOffset').once('value').then(function (data) {
                                    const serverTimeStamp = data.val() + Date.now();

                                    shot.forEach(function (t) {
                                            if (index >= (page - 1) * 20 && index < page * 20) {
                                                const orderDate = t.child('date').val();

                                                firebase.database().ref('Products/' + d.child('product').val()).once('value', function (d) {
                                                    var pImg = 'img/airtel.png',
                                                        take = false;
                                                    d.child('img').forEach(function (imgShot) {
                                                        if (!take) {
                                                            take = true;
                                                            pImg = imgShot.val();
                                                        }
                                                    });
                                                    const pName = d.child('pName').val(),
                                                        pPrice = d.child('pPrice').val(),
                                                        key = t.key;

                                                    var condition = d.child('condition').val(),
                                                        discount = d.child('discount').val(),
                                                        formatDate = 'Loading',
                                                        toggleHtml = '<button class="admin-preview-vendor-request-btn" style="background-color: red;">Reject</button>';

                                                    if (discount == null) {
                                                        discount = 0;
                                                    }
                                                    if (condition == 'new') {
                                                        condition = '<span style="background-color: green;">New</span>';
                                                    } else {
                                                        condition = '<span style="background-color: orangered;">Used</span>';
                                                    }

                                                    if (queryParam != 'pending') {
                                                        formatDate = new Date(orderDate).toLocaleString('en-us');
                                                        if (queryParam == 'rejected') {
                                                            if (t.child('timeout').val() == null) {
                                                                toggleHtml = '<div class="p-store-status" style="color: red;">Rejected</div>';
                                                            } else {
                                                                toggleHtml = '<div class="p-store-status" style="color: orange;">Expired</div>';
                                                            }
                                                        } else {
                                                            toggleHtml = '<div class="p-store-status" style="color: green;">Delivered</div>';
                                                        }
                                                    }

                                                    const rowRef = sectionPrefix + 'orderSectRowRef8hd3GZ' + key;

                                                    var tableHtml = '<tr><td><div class="p-store-info"><img src="' + pImg + '" class="p-store-img" /><a href="onecart.html" class="p-store-name">' + limitString(pName, 40) + '</a><div class="p-store-price">' + pPrice + '</div><div class="p-store-discount"><div>Discount:</div><span>' + discount + '%</span></div><div class="condition-p-store"><div>Condition:</div>' + condition + '</div><div class="condition-p-store"><b>Date:</b><i>' + new Date(orderDate).toLocaleString("en-us") + '</i></div><div class="condition-p-store"><b>From:</b><i>' + t.child("state").val() + ', ' + t.child("localGovt").val() + '</i></div></div></td><td><div class="p-store-created-on">' + t.child("qty").val() + '</div></td><td class="pending-order-interval-count-td">' + formatDate + '</td><td>' + toggleHtml + '</td></tr>';
                                                    mainTable.append(tableHtml);

                                                    if (queryParam == 'pending') {
                                                        var offlineServerTime = serverTimeStamp;
                                                        const timeLimit = orderDate + 259200000; // after 3 days

                                                        expiryCount = setInterval(() => {
                                                            offlineServerTime += 1000;
                                                            const timeOffSet = timeLimit - offlineServerTime,
                                                                hr = Math.floor((timeOffSet % (86400000) / (3600000))),
                                                                min = Math.floor((timeOffSet % (3600000) / (60000))),
                                                                sec = Math.floor((timeOffSet % (60000) / (1000)));

                                                            if (offlineServerTime >= timeLimit) {
                                                                (rowRef + ' .pending-order-interval-count-td').text('<span style="color: red;">00h:00m:00s</span>');
                                                                clearInterval($(this));
                                                            } else {
                                                                (rowRef + ' .pending-order-interval-count-td').text(hr + 'h:' + min + 'm:' + sec + 's');
                                                            }
                                                        }, 1000);
                                                        expiryTimeout.push(expiryCount);
                                                        $(rowRef + ' .admin-preview-vendor-request-btn').click(function () {
                                                            if (confirm('By rejecting, you confirmed the inability to deliver this product')) {
                                                                firebase.database().ref('transactionInfo/' + key + '/response').set('rejected');
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            ++index;
                                    });
                                });
                            }
                        }

                    });
                });
            }
        }
    });

});