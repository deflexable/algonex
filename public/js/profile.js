themeColorLight = 'blue';

$(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        var userId = getUrlParam('id'),
            iAmCurrentUser = false;

        if (userId == null) {
            if (user) {
                iAmCurrentUser = true;
                userId = user.uid;
                $('.temp-opt-con div').eq(1).hide();
                $('.follow-user-temp').hide();
                $('.wallet-container').show();
                $('.edit-pro-info-btn').show();
                $('.add-pro-img-btn').show();
                $('.temp-cen').prepend('<label for="change-profile-img-input"></label>');

                $('#change-profile-img-input').change(function (e) {
                    if (e.target.files.length == 0) {
                        return;
                    }
                    new Compressor(e.target.files[0], {
                        quality: 0.3,
                        convertSize: 30000,
                        success(result) {
                            var storageRef = firebase.storage().ref('Users/' + user.uid + '/profile.png'),
                                uploadTask = storageRef.put(result);
                            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (s) {
                                const progress = (s.bytesTransferred / s.totalBytes) * 100;
                                $('.temp-cen red').html('Uploading image ' + Math.round(progress) + '%');
                            }, function () {
                                alert('Failed to upload profile image');
                                $('.temp-cen red').empty();
                            }, function () {
                                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {
                                    firebase.database().ref('Users/' + userId + '/image').set(downloadURl);
                                    $('.temp-cen red').empty();
                                });
                            });
                        },
                        error(err) {
                            alert('Invalid image format');
                        },
                    });
                });

                firebase.database().ref('Users/' + userId + '/balance').once('value', function (b) {
                    var balance = b.val();
                    if (balance == null) {
                        balance = '0';
                    }
                    $('.wallet-body-con div h2').html('&#8358;' + balance);
                });
                $('#withdraw-wallet-btn').click(function () {
                    alert('Sorry, this service is currently unavailable');
                });
            } else {
                alert('Error, No user found');
                redirectToSignIn();
                return;
            }
        } else {
            $('.follow-user-temp').show();
        }

        if (user) {
            $('.temp-mes-flex a:last-child').click(function () {
                accessMessageDialog(userId);
            });
            $('.temp-opt-con div').eq(1).click(function () {
                var report = prompt('Report User', 'Write your report here');
                if (report != null) {
                    firebase.database().ref('userReport').push().update({
                        report: report,
                        date: firebase.database.ServerValue.TIMESTAMP,
                        user: user.uid,
                        reported_user: userId
                    });
                }
            });
            if (userId != user.uid) {
                firebase.database().ref('userFollowers/' + userId + '/' + user.uid).on('value', function (s) {
                    var isFollowing = false,
                        a = $('.follow-user-temp');

                    a.off('click');
                    if (s.exists()) {
                        isFollowing = true;
                        a.css('backgroundColor', 'pink');
                        a.html('Unfollow');
                    } else {
                        a.css('backgroundColor', 'yellow');
                        a.html('Follow');
                    }
                    a.click(function () {
                        if (isFollowing) {
                            firebase.database().ref('userFollowers/' + userId + '/' + user.uid).remove();
                        } else {
                            firebase.database().ref('userFollowers/' + userId + '/' + user.uid).set(firebase.database.ServerValue.TIMESTAMP);
                        }
                    });
                });
            }
        } else {
            $('.temp-opt-con div').eq(1).click(function () {
                redirectToSignIn();
            });
            $('.temp-mes-flex a:last-child, .follow-user-temp').click(function () {
                redirectToSignIn();
            });
        }
        $('.temp-opt').click(function (e) {
            e.stopPropagation();
            $('.temp-opt-con').slideToggle(500);
        });
        $('body').click(function () {
            $('.temp-opt-con').hide(500);
        });
        $('.temp-opt-con div').eq(0).click(function () {
            copyToClipBoard(location.href);
        });
        $('.info-bord a').attr('target', '_blank');

        function setupUserInfo(ref, n, node) {

            var data = n.child(ref).val(),
                link = '';

            if (data == null) {
                data = '';
            }

            if (ref == 'email') {
                link = 'mailto:'
            } else if (ref == 'phone') {
                link = 'tel:';
            } else if (ref == 'whatsapp') {
                if (!data.startsWith('https://')) {
                    link = 'https://wa.me/';
                }
            } else {
                if (!data.startsWith('https://')) {
                    link = 'https://';
                }
            }

            if (data == '') {
                link = '';
            }

            link += data;
            if (ref == 'whatsapp' && data != '') {
                link += '/?text=' + encodeURI('Hi, i followed you on Algonex.\n How\'s your day going');
            }
            $('#' + ref + '-cont div span').html(data);
            if (data != '') {
                $('#' + ref + '-cont a').attr('href', link);
            }

            $('#' + ref + '-cont .edit-pro-info-btn').off('click');
            $('#' + ref + '-cont .edit-pro-info-btn').click(function () {
                const change = prompt('Change of ' + ref);
                if (change != null) {
                    firebase.database().ref(node + '/' + userId + '/' + ref).set(change);
                }
            });
            $('#' + ref + '-cont').show();
        }

        firebase.database().ref('Users/' + userId).on('value', function (p) {
            var img = p.child('image').val(),
                name = p.child('name').val(),
                phone = p.child('phone').val();

                document.title = name+ ' profile';

            $('.temp-cen div small').text(changeNullToZero(p.child('followers').val()) + ' Followers, ' + changeNullToZero(p.child('following').val()) + ' Following');

            setupUserInfo('name', p, 'Users');
            setupUserInfo('phone', p, 'Users');
            setupUserInfo('work', p, 'Users');
            setupUserInfo('gender', p, 'Users');
            setupUserInfo('email', p, 'Users');

            if (img == null) {
                img = 'img/user.png';
            }
            $('.temp-cen h2').text(name);
            $('.user-temp-profile-pic').attr('src', img);

            if (!iAmCurrentUser) {
                $('.user-temp-profile-pic').off('click');
                $('.user-temp-profile-pic').click(function () {
                    showFullScreenImage(img);
                });
            }
            $('.temp-mes-flex a:first-child').attr('href', 'tel:' + phone);
            var status = p.child('status').val();
            if (status != 'online') {
                status = 'Last seen on' + new Date(status).toLocaleString("en-us");
            }
            $('.temp-cen i').text(status);
        });

        firebase.database().ref('UsersMetaData/' + userId).on('value', function (p) {
            const a = 'UsersMetaData';
            setupUserInfo('facebook', p, a);
            setupUserInfo('instagram', p, a);
            setupUserInfo('twitter', p, a);
            setupUserInfo('whatsapp', p, a);
            setupUserInfo('youtube', p, a);
        });

        if (iAmCurrentUser) {
            firebase.database().ref('wishlist/' + userId).once('value', function (p) {

                if (p.numChildren() == 0) {
                    $('#no-wishlist-found').show();
                }
                var wIte = 0;
                $('.wishlist-appender').empty();
                p.forEach(function (d) {
                    firebase.database().ref('Products/' + d.key).once('value', function (k) {
                        var pName = k.child('pName').val(),
                            price = k.child('pPrice').val(),
                            dis = k.child('discount').val(),
                            id = k.key,
                            img = k.child('pImg').val(),
                            searchTable = '';
                        ++wIte;
                        if (wIte >= 2) {
                            searchTable += '<div class="stripe"></div>';
                        }

                        searchTable += '<a href="onecart.html?productId=' + id + '" class="result-cont"><img src="' + img + '" alt="' + pName + '" class="p-img"><div class="prod-info"><div class="p-name">' +
                            pName + '</div><div class="p-price">&#8358;' + numberWithCommas((parseFloat(price) - Math.ceil((dis * price) / 100))) + '</div>';
                        if (dis != null && dis != 0) {
                            searchTable += '<div class="dis-div"><del>&#8358;' + price + '</del><div style="background-color: ';
                            if (dis > 0 && dis < 20) {
                                searchTable += 'green';
                            } else if (dis >= 20 && dis < 40) {
                                searchTable += 'blue';
                            } else if (dis >= 40 && dis < 60) {
                                searchTable += 'purple';
                            } else {
                                searchTable += 'red';
                            }
                            searchTable += ';">-' + dis + '%</div></div>';
                        }
                        searchTable += '<div class="add-cart-bone"></div><small>Added ' + timeSince(d.val()) + '</small></div></a>';
                        $('.wishlist-appender').append(searchTable);
                    });
                });
            });
        } else {
            $('#no-wishlist-found').show();
            $('#no-wishlist-found b').html('Failed To Get Wishlist');
            $('.wishlist-appender').hide();
        }

    });

    var isPreviewVisible = true;

    $('.v-card-toggler').click(function(){
        if (!isPreviewVisible) {
            isPreviewVisible = true;
            $(this).html('Hide Cards');
        } else {
            isPreviewVisible = false;
            $(this).html('Show Cards');
        }
        $('.virtual-card-packer').slideToggle(700);
    });
});