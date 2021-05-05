/*firebase.database().ref('vendors/' + userId).once('value', function (v) {
    $('.payment-user-img-con img').attr('src', v.child('img').val());
    $('.payment-user-img-con b').text(v.child('fName').val() + ' ' + v.child('lName').val());
});*/

//send http request for verifying acct no.

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userId = user.uid;
        firebase.database().ref('vendorTicket/' + userId).once('value', function (v) {
            $('#payment-ticket-spinner').hide();
            if (v.numChildren() == 0) {
                $('.payment-no-ticket-issue').show();
                $('.payment-no-ticket-issue img').attr('src', 'img/ticket_issue.jpg');
                $('.payment-issue-table').hide();
            } else {
                $('.payment-no-ticket-issue').hide();
                $('.payment-issue-table').show();
                $('.payment-issue-table').empty();
                v.forEach(function (tShot) {
                    const key = tShot.key,
                        title = tShot.child('title').val(),
                        des = tShot.child('des').val(),
                        clearBtnRef = 'ticket-clear-btn-j62bFs' + key,
                        seeDesRef = 'see-ticket-des-s8uj239' + key;

                    var ticketHtml = '<tr><td><div>' + title;
                    if (des != null) {
                        ticketHtml += '<button id="' + seeDesRef + '"> See more</button>';
                    }
                    ticketHtml += '</div></td><td>' + tShot.child('cost').val() + '</td><td>' + key + '</td><td>' + new Date(tShot.child('date').val()).toLocaleString("en-us") + '</td><td><button id="' + clearBtnRef + '">Clear</button></td></tr>';
                    $('.payment-issue-table').append(ticketHtml);

                    if (des != null) {
                        var offlineDes = null,
                            hasShowDes = false;
                        $('#' + seeDesRef).click(function () {
                            if (hasShowDes) {
                                return;
                            }
                            hasShowDes = true;
                            if (offlineDes == null) {
                                firebase.database().ref('ticketDes/' + des).once('value', function (d) {
                                    const fullDes = d.val();
                                    offlineDes = fullDes;
                                    alert(fullDes);
                                    hasShowDes = false;
                                });
                            } else {
                                alert(offlineDes);
                                hasShowDes = false;
                            }
                        });
                    }
                    $('#' + clearBtnRef).click(function () {
                        location.href = 'payment.html?vendorTicketId='+key;
                    });
                });
            }
        });
    }
});