$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDvYN58aKhJWxK0Fz1CTWx_i20Gjf4YPWw",
        authDomain: "algonex-7.firebaseapp.com",
        databaseURL: "https://algonex-7-default-rtdb.firebaseio.com",
        projectId: "algonex-7",
        storageBucket: "algonex-7.appspot.com"
    };
    firebase.initializeApp(config);

    function g(ref) {
        $(ref).css('display', 'none');
    }

    function sh(ref) {
        $(ref).css('display', 'block');
    }

    function s(ref) {
        return $(ref).val().trim();
    }

    function setButtonState(ref, text, disabled, load) {
        var txt = text;
        if (load == 'yes') {
            txt += ' <img src="img/progressDots.gif">';
        }
        $(ref).html(txt);
        $(ref).attr('disabled', disabled);
    }

    function getUrlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURIComponent(results[1]) || 0;
    }
    const interroption = getUrlParam('i');
    var reDirect = '';
    if (interroption != null) {
        reDirect = '?i=' + interroption;
    }

    function readyNextPage(userId) {
        if (userId != null) {
            firebase.database().ref('Users/' + userId).once('value', function (shot) {
                if (!shot.child('name').exists() || !shot.child('phone').exists() || !shot.child('gender').exists()) {
                    location.href = 'signupload.html' + reDirect;
                } else {
                    if (interroption != null) {
                        location.href = interroption;
                    } else {
                        location.href = 'index.html';
                    }
                }
            });
        } else {
            location.href = 'signin.html';
        }
    }

    $('.google-btn').click(function () {
        console.log('google auth started');
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            readyNextPage(result.user.uid);
        }).catch(function (error) {
            alert(error.message);
        });
    });

    $('.phone-btn').click(function () {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().useDeviceLanguage();
        console.log('win =' + $('body').width());
        if ($('body').width() >= 600) {
            console.log('pc');
            firebase
                .auth()
                .signInWithPopup(provider)
                .then((result) => {
                    readyNextPage(result.user.uid);
                })
                .catch((error) => {
                    alert(error.message);
                });
        } else {
            console.log('phone');
            firebase.auth().signInWithRedirect(provider);
            firebase.auth()
                .getRedirectResult()
                .then((result) => {
                    readyNextPage(result.user.uid);
                }).catch((error) => {
                    alert(error.message);
                });
        }
    });

    //reset password
    $("#reset-btn").click(function () {
        var email = $("#email").val();
        setButtonState('#reset-btn', 'Resetting', true, 'yes');
        firebase.auth().sendPasswordResetEmail(email.toLowerCase())
            .then(function () {
                alert("Password reset link has be sent successfully, follow the link to reset your account");
                location.href = "signin.html" + reDirect;
            }).catch(function (error) {
                setButtonState('#reset-btn', 'Reset', false);
                alert(error.message);
            });
    });

    var email = '',
        pin = '',
        phoneNo = '',
        gender = '',
        name = '',
        hasTryToSubmit = false;

    function validateSelect(ref, errorTxt) {
        $(ref).change(function () {
            const i = $(ref).val();
            if (ref == '#gender') {
                gender = i;
            }
            if (hasTryToSubmit) {
                if (i == 'none') {
                    sh(ref + '-error');
                    $(ref + '-error').html(errorTxt + ' is required');
                } else {
                    g(ref + '-error');
                }
            }
        });
    }

    function v(ref, errorTxt, expectedLength, exceededLength) {
        document.querySelector(ref).oninput = function () {
            const i = s(ref);
            switch (ref) {
                case '#email':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        email = i;
                    } else {
                        email = '';
                    }
                    break;
                case '#pin':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        pin = i;
                    } else {
                        pin = '';
                    }
                    break;
                case '#name':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        name = i;
                    } else {
                        name = '';
                    }
                    break;
                case '#phone':
                    if (i.length > expectedLength && i.length < exceededLength) {
                        phoneNo = i;
                    } else {
                        phoneNo = '';
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

    $("#signin-btn").click(function () {
        if (!hasTryToSubmit) {
            v('#email', 'Email address', 4, 100);
            v('#pin', 'Password', 7, 70);
        }
        hasTryToSubmit = true;
        $('#signin-container input').trigger('oninput');
        if (email != '' && pin != '') {
            setButtonState('#signin-btn', 'logging in', true, 'yes');
            firebase.auth().signInWithEmailAndPassword(email.toLowerCase(), pin)
                .then(function (user) {
                    readyNextPage(user.uid);
                }).catch(function (error) {
                    alert(error.message);
                    setButtonState('#signin-btn', 'log in', false);
                });
        } else {
            alert('Fill out the required fields');
        }
    });

    //signup
    $("#signup-btn").click(function () {
        if (!hasTryToSubmit) {
            v('#email', 'Email address', 4, 100);
            v('#pin', 'Password', 7, 70);
        }
        hasTryToSubmit = true;
        $('#signup-container input').trigger('oninput');

        if (email != '' && pin != '') {
            setButtonState('#signup-btn', 'signing up', true, 'yes');
            firebase.auth().createUserWithEmailAndPassword(email.toLowerCase(), pin).then(function (user) {
                user.sendEmailVerification().then(function () {
                    readyNextPage(user.uid);
                    alert('A link has been sent to ' + email + ' for verification purposes');
                }).catch(function () {
                    readyNextPage(user.uid);
                });
                console.log(user);
            }).catch(function (error) {
                setButtonState('#signup-btn', 'sign up', false);
                alert(error.message);
            });
        }
    });

    var compressImg = '',
        hasPhoneInDatabase = false;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            firebase.database().ref('Users/' + user.uid + '/phone').on('value', function (g) {
                if (g.exists()) {
                    hasPhoneInDatabase = true;
                    $('#phone-con').hide();
                } else {
                    hasPhoneInDatabase = false;
                    $('#phone-con').show();
                }
            });
        }
    });

    function uploadProfile(userId, imgUrl) {
        var profileForm = {
            name: name.toLowerCase(),
            gender: gender.toLowerCase()
        };
        if (!hasPhoneInDatabase) {
            profileForm.phone = phoneNo;
        }
        if (imgUrl != 'none') {
            profileForm.image = imgUrl;
        }
        var occupation = $('#occupation').val();
        if (occupation != 'none') {
            profileForm.work = occupation.toLowerCase();
        }
        firebase.database().ref("Users/" + userId).update(profileForm).then(function (error) {
            if (error) {
                alert('An unexpected error occurred');
                $('.progress-con').hide();
            } else {
                readyNextPage(userId);
            }
        });
    }

    function uploadUserImg() {
        $('.progress-con').show();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (hasPhoneInDatabase) {
                    proceed();
                } else {
                    firebase.database().ref('Users').orderByChild('phone').equalTo(phoneNo).once('value', function (g) {
                        if (g.numChildren() == 0) {
                            proceed();
                        } else {
                            alert('Phone number you input is already associated with another account');
                            $('.progress-con').hide();
                        }
                    });
                }

                function proceed() {
                    if (compressImg != '') {
                        var storageRef = firebase.storage().ref('Users/' + user.uid + '/profile.png'),
                            uploadTask = storageRef.put(compressImg);

                        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (s) {
                            const progress = (s.bytesTransferred / s.totalBytes) * 100;
                            $('.progress-con b').html('Uploading profile image ' + Math.round(progress) + '%');
                        }, function () {
                            uploadProfile(user.uid, 'none');
                        }, function () {
                            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {
                                uploadProfile(user.uid, downloadURl);
                            });
                        });
                    } else {
                        uploadProfile(user.uid, 'none');
                    }
                }
            } else {
                location.href = 'signin.html';
            }
        });
    }

    $('#uImgFile').change(function (e) {
        if (e.target.files.length == 0) {
            return;
        }
        compressImg == '';
        var profileImg = e.target.files[0],
            realImgReader = new FileReader();
        realImgReader.readAsDataURL(profileImg);

        realImgReader.onload = function (r) {
            $('#userImg').attr('src', r.target.result);
        };

        new Compressor(profileImg, {
            quality: 0.3,
            convertSize: 30000,
            success(result) {
                compressImg = result;
                console.log('compress success');
            },
            error(err) {
                console.log('compress failed');
            },
        });

    });

    if (document.title == 'User data form') {
        firebase.database().ref('businessIndex').orderByChild('no').once('value', function (r) {
            var workHtml = '<option value="none">Select your Occupation</option>';
            r.forEach(function (d) {
                const key = d.key;
                workHtml += '<option value="' + key + '">' + key + '</option>';
            });
            $('#occupation').html(workHtml);
        });
    }

    $('#uploadBtn').click(function () {
        if (!hasTryToSubmit) {
            v('#name', 'Name', 2, 70);
            v('#phone', 'Phone number', 7, 15);
            validateSelect('#gender', 'Gender');
        }
        hasTryToSubmit = true;
        $('#signUploadCon input').trigger('oninput');
        $('#signUploadCon select').trigger('change');
        console.log('clikced');
        if (name != '' && (phoneNo != '' || hasPhoneInDatabase) && gender != 'none') {
            uploadUserImg();
        }
    });

});