var accessVendorProfilePage = null;
$(document).ready(function () {
    var currentProfileRef = null,
        hasStampProfileAlready = false;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userId = user.uid;


            accessVendorProfilePage = function (path) {
                if (hasStampProfileAlready) {
                    currentProfileRef.off('value');
                }
                const infoTable = $('.vendor-profile-info-table'),
                    spinner = $('.vendor-profile-section-spinner'),
                    proAdminTab = '.admin-vendor-profile-approve-tab',
                    proImgCon = '.vendor-profile-img-con';

                $('#admin-vendor-profile-chat-btn-tab button').val(path);

                spinner.css('display', 'block');
                infoTable.hide();
                $(proAdminTab).hide();

                firebase.database().ref('Users/' + userId + '/isAdmin').once('value', function (adminShot) {
                    if (adminShot.exists()) {
                        if (path == userId) {
                            $(proAdminTab).hide();
                        } else {
                            $(proAdminTab).show();
                        }
                    } else {
                        $(proAdminTab).hide();
                    }
                });

                function approveToggle(index, flag) {
                    $(proAdminTab + ' tr th').eq(index).click(function () {
                        firebase.database().ref('vendors/' + path + '/status').set(flag);
                    });
                }
                
                $(proAdminTab + ' tr th').eq(0).off('click');
                $(proAdminTab + ' tr th').eq(0).click(function(){
                    accessMessageDialog(path);
                });

                firebase.database().ref('vendors/' + path + '/status').on('value', function (verifyShot) {
                    $(proAdminTab + ' tr th').eq(1).off('click');
                    $(proAdminTab + ' tr th').eq(2).off('click');

                    var v = verifyShot.val();
                    if (v == 'pending') {
                        $(proImgCon + ' div').html('<span style="color: orange;">Pending</span>');
                        $(proAdminTab + ' tr th').eq(1).css('backgroundColor', 'green');
                        $(proAdminTab + ' tr th').eq(2).css('backgroundColor', 'crimson');
                        approveToggle(1, 'approved');
                        approveToggle(2, 'declined');
                    } else if (v == 'declined') {
                        $(proImgCon + ' div').html('<span style="color: red;">Declined</span>');
                        $(proAdminTab + ' tr th').eq(1).css('backgroundColor', 'green');
                        $(proAdminTab + ' tr th').eq(2).css('backgroundColor', 'grey');
                        approveToggle(1, 'approved');
                    } else {
                        $(proImgCon + ' div').html('<img src="img/verified.svg"><span>Verified</span>');
                        $(proAdminTab + ' tr th').eq(1).css('backgroundColor', 'grey');
                        $(proAdminTab + ' tr th').eq(2).css('backgroundColor', 'crimson');
                        approveToggle(2, 'declined');
                    }
                });

                function checkNull(value) {
                    if (value == null)
                        return 'Not Given';
                    else
                        return value;
                }

                function tdEdit(id) {
                    return ' id="vendor-seller-profile-info-' + id + '-edit-td"';
                }

                function profileEdit(id, title, node, editType) {
                    $('#vendor-seller-profile-info-' + id + '-edit-td img').off('click');
                    $('#vendor-seller-profile-info-' + id + '-edit-td img').click(function () {
                        var editedValue = prompt('Edit your ' + title, $('#vendor-seller-profile-info-' + id + '-edit-td').text());
                        if (editedValue != null) {
                            if (editType == 'number') {
                                if (!isNumber(editedValue)) {
                                    alert('New stock must be a number');
                                    return;
                                }
                            }
                            firebase.database().ref('vendors/' + path + '/' + node).set(editedValue);
                        }
                    });
                }

                currentProfileRef = firebase.database().ref('vendors/' + path);
                currentProfileRef.on('value', function (d) {
                    const phone2 = checkNull(d.child('phone2').val()),
                        taxNo = checkNull(d.child('tin').val()),
                        regNo = checkNull(d.child('regNo').val()),
                        fName = d.child('fName').val(),
                        lName = d.child('lName').val();
                    var status = d.child('status').val();

                    $('.vendor-profile-user-img').attr('src', d.child('img').val());
                    $('.vendor-profile-img-con b').text(fName + ' ' + lName);
                    if (status == 'pending') {
                        status = 'style="color: orange; font-weight: bold; font-size: 17px;">' + status;
                    } else if (status == 'declined') {
                        status = 'style="color: red; font-weight: bold; font-size: 17px;">' + status;
                    } else {
                        status = 'style="color: green; font-weight: bold; font-size: 17px;">' + status;
                    }

                    $('.vendor-profile-img-con b').text(fName + ' ' + lName);

                    const vendorProHtml = '<caption>Seller Information</caption><tr><td>First Name</td><td>' + fName + '</td></tr><tr><td>Last Name</td><td>' + lName + '</td></tr><tr><td>Date Of Birth</td>' +
                        '<td>' + d.child('dob').val() + '</td></tr><tr><td>Gender</td><td>' + d.child('gender').val() + '</td></tr><tr><td>Email Address</td><td' + tdEdit('email') + '>' +
                        d.child('email').val() + '<img src="img/edit.png" alt="edit-button"></td></tr><tr><td>Phone Number 1</td><td' + tdEdit('phone1') + '>' + d.child('phone').val() + '<img src="img/edit.png" alt="edit-button"></td></tr><tr><td>Phone Number 2</td><td' + tdEdit('phone2') + '>' +
                        phone2 + '<img src="img/edit.png" alt="edit-button"></td></tr><tr><td>Store Name</td><td>' + d.child('storeName').val() + '</td></tr><tr><td>Store Description</td><td' + tdEdit('storeDes') + '>' +
                        d.child('storeDes').val() + '<img src="img/edit.png" alt="edit-button"></td></tr>' +
                        '<tr><td>Joined on</td><td>' + new Date(d.child('date').val()).toLocaleString("en-us") + '</td></tr><tr><td>State</td><td>' + d.child('state').val() + '</td></tr><tr><td>Local Govt</td><td>' +
                        d.child('localGovt').val() + '</td></tr><tr><td>Residential Address</td><td' + tdEdit('address') + '>' + d.child('address').val() + '</td></tr><tr>' +
                        '<td>Bank Account No.</td><td' + tdEdit('accountNo') + '>' + d.child('accountNo').val() + '<img src="img/edit.png" alt="edit-button"></td></tr><tr><td>Seller Status</td><td ' +
                        status + '</td></tr><tr><td>Tax Identification Number</td><td' + tdEdit('taxNo') + '>' + taxNo + '<img src="img/edit.png" alt="edit-button"></td></tr><tr><td>Business Registration No</td><td' + tdEdit('regNo') + '>' +
                        regNo + '<img src="img/edit.png" alt="edit-button"></td></tr>';

                    infoTable.css('display', 'table');
                    infoTable.html(vendorProHtml);
                    profileEdit('email', 'email address', 'email');
                    profileEdit('phone1', 'first phone number', 'phone');
                    profileEdit('phone2', 'second phone number', 'phone2');
                    profileEdit('storeDes', 'store description', 'storeDes');
                    profileEdit('address', 'residential address', 'address');
                    profileEdit('accountNo', 'bank account number', 'accountNo');
                    profileEdit('taxNo', 'tax identification number', 'tin');
                    profileEdit('regNo', 'business registration number', 'regNo');

                    spinner.css('display', 'none');
                });
                hasStampProfileAlready = true;
            }

            $('.vendor-nav-list-profile-div').click(function () {
                console.log('am click vendor profile');
                accessVendorProfilePage(userId, false);
            });

        }
    });
});