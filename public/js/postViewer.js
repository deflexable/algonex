$(function () { //when doc has loaded
    var currentCommentRef = null,
        currentUser = null,
        currentCommentReplyId = null;
    transaction

    firebase.auth().onAuthStateChanged(function (userObj) {
        if (userObj) {
            currentUser = userObj.uid;
        } else {
            currentUser = null;
        }
    });

    firebase.database().ref('ForumPosts/' + postId).once('value', function (s) {
        var topic = s.child('topic').val(),
            thumbnail = s.child('thumbnail').val(),
            thumbnailDes = s.child('thumbnailDes').val(),
            date = s.child('date').val(),
            user = s.child('user').val(),
            views = s.child('views').val(),
            commentNum = s.child('comments').val(),
            extUrl = s.child('url').val(),
            userDes = s.child('userDes').val();

        function sg() {
            if (user == 'theGuardian') {
                $('.post-appender img').css({
                    "width": "100%",
                    "height": "auto"
                });
            }
        }

        if (!s.exists()) {
            var params = {
                "show-elements": "all",
                "show-fields": "headline,trailText,bylineHtml,wordcount,thumbnail,shortUrl,body",
                "api-key": "629b0bc6-8f95-4150-828b-d291a53c7f11"
            }
            getDataFromServer('https://content.guardianapis.com/' + postId, params, function (response, status) {
                console.log(JSON.stringify(response));
                const r = JSON.parse(JSON.stringify(response)).response.content;

                if (!r) {
                    sendBack();
                    return;
                }
                extUrl = r.fields.shortUrl;
                topic = r.fields.headline;
                thumbnailDes = r.fields.trailText;
                thumbnail = r.fields.thumbnail;
                date = Date.parse(r.webPublicationDate);
                user = 'theGuardian';
                userDes = r.fields.bylineHtml;
                $('.post-appender').html(r.fields.body.replace(/\"/g, '"').replace(/href="https:\/\/www.theguardian.com\//g, 'href="' + location.origin + location.pathname + '?id='));
                sg();

                firebase.database().ref('theGuardianQueue/' + postId).set(firebase.database.ServerValue.TIMESTAMP).then(function () {
                    setTimeout(() => {

                    }, 10000);
                });
                stampPost();
            }, function () {
                window.open('https://www.theguardian.com/' + postId, '_blank');
                //alert('The requested resource could not be found');
                history.back();
                location.href = 'forum.html';
            });
        } else {
            stampPost();
        }

        function stampPost() {

            $('.post-comment-notify small').text(changeNullToZero(commentNum));
            $('.post-view-cont small').text(changeNullToZero(views));
            $('.post-main-title').text(topic);
            document.title = topic;
            $('.post-user-info-con div small').html(new Date(date).toLocaleString('en-us'));
            if (thumbnail != null && thumbnail) {
                $('.post-thumbnail-con').show();
                if (thumbnailDes != null && thumbnailDes) {
                    $('.post-thumbnail-con div').show();
                    $('.post-thumbnail-con div').html('<small>' + thumbnailDes + '</small>');
                } else {
                    thumbnailDes = topic;
                }
                $('.post-thumbnail-con img').attr('src', thumbnail);
                $('.post-thumbnail-con img').attr('alt', thumbnailDes);
            }

            var comTimeout = null;
            firebase.database().ref('ForumPostComment/' + postId).on('value', function (c) {
                $('.forum-comment-appender').empty();
                console.log('shotting com');

                clearTimeout(comTimeout);

                comTimeout = setTimeout(() => {
                    c.forEach(function (d) {
                        console.log('appending com');
                        const cUser = d.child('user').val();

                        firebase.database().ref('Users/' + cUser).once('value', function (u) {
                            const uName = u.child('name').val();
                            const comHtml = '<div class="user-comment-cont" id="' + d.key + '"><img src="' + formateUserImg(u.child('image').val()) + '" alt="photo of ' + uName + ' "><div><b>' + uName + '</b><small>' + new Date(d.child('date').val()).toLocaleString("en-us") + '</small><span>' + d.child('comment').val() + '</span></div></div>';

                            $('.forum-comment-appender').append(comHtml);
                            $('#' + d.key + ' div').click(function () {
                                currentCommentRef = {
                                    user: cUser,
                                    key: d.key
                                };
                                if (cUser == currentUser) {
                                    $('.forum-user-comment-option-con div b').eq(3).css('display', 'block');
                                } else {
                                    $('.forum-user-comment-option-con div b').eq(3).hide();
                                }
                                $('.forum-user-comment-option-con').show(500);
                            });
                            $('#' + d.key + ' img').click(function () {
                                showFullScreenImage($(this).attr('src'));
                            });
                            console.log('ending com');
                        });
                    });
                }, 500);

            });

            if (extUrl && extUrl != null) {
                $('.external-post-link').css('display', 'block');
                $('.external-post-link').attr('href', extUrl);
            }
            if (userDes && userDes != null) {
                $('.post-user-des-cont').show();
                $('.post-user-des-cont').html('Written by ' + userDes.replace(/\"/g, '"').replace(/href="profile/g, "href=\"https://theguardian.com/profile"));
            }

            if (user == 'theGuardian') {
                $('.user-post-profile-img').attr('src', 'img/theGuardian.jpg');
                $('.user-post-profile-img').attr('alt', 'image of theGuardian');
                $('.post-user-info-con div a').text('The Guardian');
                $('.post-user-info-con div a').attr('href', 'theguardian.com');
                firebase.database().ref('theGuardianFollowers/' + user).once('value', function (s) {
                    $('.post-user-info-con div span i').text(changeNullToZero(s.child('followers').val()) + ' Followers');
                });
                $('.user-post-profile-img').click(function () {
                    showFullScreenImage($(this).attr('src'));
                });
            }

            if (s.exists()) {
                var seenFlag = '9PosterViua8' + postId;
                if (currentUser != null) {
                    seenFlag += currentUser;
                }
                if (!isInLocalStorage(seenFlag)) {
                    firebase.database().ref('ForumPosts/' + postId + '/views').transaction(function (plusCount) {
                        return (plusCount || 0) + 1;
                    }).then(function () {
                        window.localStorage.setItem(seenFlag, 'mafoo');
                    });
                }

                firebase.database().ref('ForumPosts/' + postId + '/likes').on('value', function (l) {
                    $('.post-like-cont small').text(changeNullToZero(l.val()));
                });

                firebase.database().ref('ForumPostDes/' + postId).once('value', function (s) {
                    $('.post-appender').html(s.val().replace(/\"/g, '"').replace(/href="https:\/\/www.theguardian.com\//g, 'href="' + location.origin + location.pathname + '?id='));
                    sg();
                });

                firebase.auth().onAuthStateChanged(function (userObj) {
                    if (userObj) {
                        const userId = userObj.uid;

                        firebase.database().ref('ForumPostLikes/' + postId + '/' + userId).on('value', function (l) {
                            var isLiking = false,
                                a = $('.post-like-cont img');

                            $('.post-like-cont').off('click');
                            if (l.exists()) {
                                isLiking = true;
                                a.attr('src', 'img/thumb_up_active.svg');
                            } else {
                                a.attr('src', 'img/thumbUp.svg');
                            }
                            $('.post-like-cont').click(function () {
                                if (isLiking) {
                                    firebase.database().ref('ForumPostLikes/' + postId + '/' + userId).remove();
                                } else {
                                    firebase.database().ref('ForumPostLikes/' + postId + '/' + userId).set(firebase.database.ServerValue.TIMESTAMP);
                                }
                            });
                        });

                        firebase.database().ref('userFollowers/' + user + '/' + userId).on('value', function (s) {
                            var isFollowing = false,
                                a = $('.post-user-info-con button');
                            a.off('click');
                            if (s.exists()) {
                                isFollowing = true;
                                a.css('backgroundColor', 'crimson');
                                a.html('Following');
                            } else {
                                a.css('backgroundColor', 'green');
                                a.html('Follow');
                            }
                            a.click(function () {
                                if (isFollowing) {
                                    firebase.database().ref('userFollowers/' + user + '/' + userId).remove();
                                } else {
                                    firebase.database().ref('userFollowers/' + user + '/' + userId).set(firebase.database.ServerValue.TIMESTAMP);
                                }
                            });
                        });
                    } else {
                        $('.post-like-cont, .post-user-info-con button').click(function () {
                            redirectToSignIn();
                        });
                    }
                });

                if (user != 'theGuardian') {
                    firebase.database().ref('Users/' + user).once('value', function (s) {
                        const name = s.child('name').val();
                        $('.post-user-info-con div a').text(name);
                        $('.post-user-info-con div span i').text(changeNullToZero(s.child('followers').val()) + ' Followers');
                        $('.user-post-profile-img').attr('src', s.child('image').val());
                        $('.user-post-profile-img').attr('alt', 'image of ' + name);
                        $('.post-user-info-con div a').attr('href', 'profile.html?id=' + user);
                        $('.user-post-profile-img').click(function () {
                            showFullScreenImage($(this).attr('src'));
                        });
                    });
                }
            } else {}

            $('.post-comment-flexer button').click(function () {
                if (currentUser != null) {
                    var txt = $('#comment-section-textarea').val().trim(),
                        commentPackage = {
                            user: currentUser,
                            comment: txt,
                            date: firebase.database.ServerValue.TIMESTAMP
                        };
                    if (txt == '') {
                        alert('Comment can\'t be empty');
                        return;
                    }
                    if (currentCommentReplyId != null) {
                        commentPackage.replyTo = currentCommentReplyId;
                    }

                    firebase.database().ref('ForumPostComment/' + postId).push().update(commentPackage);

                    if () {
                        firebase.database().ref('ForumNotifier/' + postId + '/' + currentUser).set(0);
                    }
                } else {
                    redirectToSignIn();
                }
            });

            $('.forum-user-comment-option-con').click(function () {
                $(this).hide(700)
            });

            for (var i = 0; i < 4; i++) {
                const a = i;
                $('.forum-user-comment-option-con div b').eq(a).click(function () {
                    switch (a) {
                        case 0:
                            if (currentUser != null) {
                                currentCommentReplyId = currentCommentRef.key;
                                $('#comment-reply-display').html($('#' + currentCommentRef.key).html());
                                $('.comment-reply-container').show(700);
                                location.href = '#comment-reply-display';
                            }
                            break;
                        case 1:
                            if (currentUser != null) {
                                accessMessageDialog(currentCommentRef.user);
                            } else {
                                redirectToSignIn();
                            }
                            break;
                        case 2:
                            copyToClipBoard($('#' + currentCommentRef.key + ' span').text());
                            break;
                        case 3:
                            if (confirm('Do you want to delete this comment')) {
                                firebase.database().ref('ForumPostComment/' + postId + '/' + currentCommentRef.key).remove();
                            }
                            break;

                    }
                });
            }
            $('#clear-comment-reply-btn').click(function () {
                currentCommentReplyId = null;
                $('.comment-reply-container').hide(700);
            });
            $('.flag-as-spam').show();
            $('.flag-as-spam').click(function () {
                var report = confirm('Do you wish to spam this post, spaming this post will notify us about this post containing inAppropriate content such as abusive words, nudity, copyright violention, e.t.c');
                if (report) {
                    firebase.database().ref('userReport').push().update({
                        date: firebase.database.ServerValue.TIMESTAMP,
                        user: user.uid,
                        reported_link: location.href
                    });
                }
            });
        }
    });
});