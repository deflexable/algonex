$(document).ready(function () {

  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.product-div-breadcrum-pc').show(700);
    } else {
      $('.product-div-breadcrum-pc').hide(700);
    }
  });

  //slide-dot-con
  $(".slider-flex").scroll(function () {
    $(".slide-dot-con div").css({
      "filter": "brightness(40%)",
      "opacity": "0.6",
      "backgroundColor": "white"
    });
    $(".slide-dot-con").children().eq(Math.round($(".slider-flex").scrollLeft() / $(".slider-flex img").width())).css({
      "filter": "brightness(none)",
      "opacity": "unset",
      "backgroundColor": "red"
    });
  });

  $('.seller-img').click(function (e) {
    showFullScreenImage($(this).attr('src'));
    e.preventDefault();
  });

  setTimeout(() => {
    $(".slide-btn").hide(1000);
  }, 3000);

  $(".slider-con").on({
    mouseenter: function () {
      $(".slide-btn").show(1000);
    },
    mouseleave: function () {
      $(".slide-btn").hide(1000);
    }
  })

  function scrollManage(btnIdentifier) {
    var imgPixels = Math.round($(".slider-flex img").width());
    var leftScrollable = ($(".slider-flex").children().length - 1) * imgPixels;
    var leftScroll = $(".slider-flex").scrollLeft();
    if (btnIdentifier == "+") {
      if (leftScroll + 7 > leftScrollable) {
        $(".slider-flex").scrollLeft(0);
      } else {
        $(".slider-flex").scrollLeft(leftScroll + imgPixels);
      }
    } else {
      if (leftScroll == 0) {
        $(".slider-flex").scrollLeft(leftScrollable);
      } else {
        $(".slider-flex").scrollLeft(leftScroll - imgPixels);
      }
    }
  }

  $("#slider-left").click(function (e) {
    e.stopPropagation();
    scrollManage("-");
  });
  $("#slider-right").click(function (e) {
    e.stopPropagation();
    scrollManage("+");
  });

  var userId = '';
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userId = user.uid;
    }
  });
  //for offline and firebase quan calculation
  var costTxt = $("#cost-txt"),
    priceTxt = 0,
    disGlob = 0;

  function prodCal(btnIdentifier) {
    var q = $("#quan-input").val().trim();
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
    if (q.length == 0) {
      costTxt.text("Please input quantity");
      if (userId != '') {
        firebase.database().ref('cart/' + userId + '/' + productId).remove();
      }
    } else {
      $("#quan-input").val(q);
      if (userId != '') {
        firebase.database().ref('cart/' + userId + '/' + productId).set(q);
      }
      costTxt.html(" <small> Total Cost (Excluding shipping) </small> : &#8358;" + numberWithCommas((parseFloat(priceTxt) - Math.ceil((disGlob * priceTxt) / 100)) * q));
    }
  }

  document.querySelector("#quan-input").oninput = function () {
    prodCal("key");
  };
  //handling button
  $("#minus-quan").click(function () {
    prodCal("-");
  });

  $("#plus-quan").click(function () {
    prodCal("+");
  });

  $("#similar-locator").click(function () {
    location.href = "#find-simi";
  });

  $(".star-review-zoom-close").click(function () {
    $('.star-review-zoom').slideToggle(700);
  });

  function retrieveRatings(shot) {
    if (shot.exists()) {
      var starArr = [0, 0, 0, 0, 0];
      shot.forEach(function (rateSnap) {
        switch (rateSnap.child('rate').val()) {
          case 1:
            ++starArr[0];
            break;
          case 2:
            ++starArr[1];
            break;
          case 3:
            ++starArr[2];
            break;
          case 4:
            ++starArr[3];
            break;
          case 5:
            ++starArr[4];
            break;
        }
      });
      var totalRating = starArr[0] + starArr[1] + starArr[2] + starArr[3] + starArr[4],
        aggregatedRating = (starArr[0] * 1) + (starArr[1] * 2) + (starArr[2] * 3) + (starArr[3] * 4) + (starArr[4] * 5);
      const averageRating = aggregatedRating / totalRating;
      return getRating(Math.ceil(averageRating));
    } else {
      return getRating(1);
    }
  }

  function getRating(rate) {
    var starHtml = '',
      review = rate;
    for (var r = 0; r < 5; r++) {
      if (review == 0) {
        starHtml += '<img src="img/stargrey.svg"/>';
      } else {
        starHtml += '<img src="img/star.svg"/>';
        --review;
      }
    }
    return starHtml;
  }

  function getDaySuffix(t) {
    var input = t.toString();
    if (input.endsWith('1')) {
      return input + '<sup>st</sup>';
    } else if (input.endsWith('2')) {
      return input + '<sup>nd</sup>';
    } else if (input.endsWith('3')) {
      return input + '<sup>rd</sup>';
    } else {
      return input + '<sup>th</sup>';
    }

  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function getDeliveryPeriod() {
    firebase.database().ref('/.info/serverTimeOffset').once('value').then(function (data) {

      const serverTimeStamp = (data.val() + Date.now()),
        currentTime = new Date(serverTimeStamp + 172800000),
        extendedTime = new Date(serverTimeStamp + 432000000), //between 2days and 5days
        deliveryPeriod = days[currentTime.getDay()] + ' ' + getDaySuffix(currentTime.getDate()) + ' ' + months[currentTime.getMonth()] + ' ' + currentTime.getFullYear() + ' to ' + days[extendedTime.getDay()] + ' ' + getDaySuffix(extendedTime.getDate()) + ' ' + months[extendedTime.getMonth()] + ' ' + extendedTime.getFullYear();

      $('.delivery-info-txt').html('This products will be delivered to you within ' + deliveryPeriod);
    });
  }
  getDeliveryPeriod();

  function formateUserImg(img) {
    if (img == null)
      return 'img/user.png';
    else
      return img;
  }

  function limitString(value, limit) {
    if (value.length <= limit)
      return value;
    else
      return value.substring(0, limit) + '...';
  }

  $('#share-prod-td').click(function () {
    copyToClipBoard(location.href);
  });

  firebase.database().ref("Products/" + productId).once('value', function (s) {
    if (!s.exists()) {
      sendBack();
    }
    var sliderHtml = '',
      sliderDots = '<div></div>';

    const pName = s.child('pName').val(),
      pVid = s.child("pVid").val(),
      pPrice = s.child('pPrice').val(),
      pDis = s.child('discount').val(),
      condVal = s.child("condition").val(),
      pRemain = s.child("stock").val(),
      fault = s.child("defect").val(),
      brand = s.child('brand').val(),
      pCate = s.child('cate').val(),
      subCate = s.child('subCate').val(),
      sellerId = s.child("sellerId").val();
    priceTxt = pPrice;
    document.title = pName;

    var pRate = s.child('rate').val();

    if(pRate == null){
      pRate = 0;
    }
    $('.star-div').html(getRating(pRate));
    firebase.database().ref('Products/' + productId + '/views').transaction(function (plusCount) {
      return (plusCount || 0) + 1;
    });
    $('.prod-update-txt').html('Updated on: ' + new Date(s.child('date').val()).toLocaleString("en-us"));

    //$('.p-des-txt').html(s.child('des').val());

    /*firebase.database().ref("Products").once('value', function (g) {
      g.forEach(function(v){
        firebase.database().ref('ProductDes/' + v.key).set(v.child('des').val());
      });
    });*/
    firebase.database().ref('ProductDes/' + productId).once('value', function (ds) {
      const pDes = ds.val();
      if (pDes != null) {
        $('.p-des-txt').html(pDes);
      } else {
        $('.p-des-txt').html('Not Given');
      }
    });

    $('.product-div-breadcrum-pc').html('<a href="productsearch.html?queryType=product">Products</a> <c> > </c><a href="productsearch.html?category=' + encodeURIComponent(pCate) + '" target="_blank" >' + pCate + '</a> <c> > </c><a href="productsearch.html?subCategory=' + encodeURIComponent(subCate) + '" target="_blank">' + subCate + '</a> <c> > </c><b>' + limitString(pName, 33) + '</b> ');

    if (pVid != null) {
      sliderDots += '<div></div>';
      if (pVid.startsWith('https://firebasestorage.googleapis.com')) {
        sliderHtml += '<video controls> <source src="' + pVid + '" type="video/mp4"> <source src="' + pVid + '" type="video/ogg"> </video>';
      } else {
        //https://www.youtube.com/embed/wyIUihw37ew
        console.log('pVid =' + pVid);
        var frameSrc = '',
          rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        if (pVid.includes('https') || pVid.includes('www.youtu')) {
          frameSrc = pVid.match(rx)[1];
        } else {
          frameSrc = pVid;
        }
        console.log(frameSrc);
        sliderHtml += '<iframe src="https://www.youtube.com/embed/' + purifyHtml(frameSrc) + '" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }
    }

    sliderHtml += '<img src="' + s.child('pImg').val() + '" alt="' + pName + '" >';
    s.child('img').forEach(function (i) {
      sliderHtml += '<img src="' + i.val() + '" alt="' + pName + '" >';
      sliderDots += '<div></div>';
    });
    $(".slider-flex").html(sliderHtml);
    $('.slide-dot-con').html(sliderDots);

    $(".slider-flex img").css('minHeight', '' + ($(".slider-flex img").eq(0).css('width') * 0.7));

    $('.slider-flex img').click(function () {
      showFullScreenImage($(this).attr('src'));
    });

    $('.p-name').html(pName);
    if (pDis != null && pDis != 0) {
      disGlob = pDis;
      $('.p-price').html('&#8358;' + numberWithCommas((parseFloat(pPrice) - Math.ceil((pDis * pPrice) / 100)).toFixed(2)));
      $('.discount').html('&#8358;' + numberWithCommas(pPrice.toFixed(2)));
    } else {
      disGlob = 0;
      $('.p-price').html('&#8358;' + numberWithCommas(pPrice.toFixed(2)));
      $('.discount').css('display', 'none');
    }
    $("#condition").html("condition:<div>" + condVal + "</div>");
    var cond = $("#condition div");
    if (condVal == "used") {
      cond.css("backgroundColor", "orangered");
    } else {
      cond.css("backgroundColor", "green");
    }
    $("#p-remain").html("Available in stock: <div>" + pRemain + "</div>");
    costTxt.html("<small> Total Cost (Excluding shipping) </small> : &#8358;" + numberWithCommas((parseFloat(priceTxt) - Math.ceil((disGlob * priceTxt) / 100)).toFixed(2) * 1));

    if (fault != null) {
      $("#prod-fault-con").css('display', 'block');
      $("fault div").text(fault);
    } else {
      $("#prod-fault-con").hide();
    }
    var ial = 0;
    s.child('prodTemp').forEach(function (i) {
      $('.manual-img-temp').append('<img src="' + i.val() + '" alt="' + pName + ' ' + ial + '" />');
      ++ial;
    });
    $('.manual-img-temp img').click(function () {
      showFullScreenImage($(this).attr('src'));
    });

    if (s.hasChild('properties')) {
      var propHtml = '<caption>Products Properties</caption>';
      s.child('properties').forEach(function (propShot) {
        propHtml += '<tr><td>' + propShot.key.replace(/<>/g, '#') + '</td><td>' + propShot.val() + '</td></tr>';
      });
      if (brand != null) {
        propHtml += '<tr><td>Product Brand</td><td>' + brand + '</td></tr>';
      }
      $('.p-manual').html(propHtml);
    } else {
      $('.p-manual').css('display', 'none');
      $('.des-more').hide();
    }

    if (s.hasChild('inBox')) {
      $('.in-box').show();
      s.child('inBox').forEach(function (b) {
        $('.in-box ol').append('<li>' + b.val() + '</li>');
      });
    } else {
      $('.in-box').hide();
    }

    //if user is found check for user add
    firebase.auth().onAuthStateChanged(function (user) {
      $(".buy-btn, .buy-pc, .post-comment-flexer button").off('click');

      if (user) {
        userId = user.uid;
        $(".buy-btn, .buy-pc").click(function () {
          if (pRemain <= 0) {
            alert('This item is out of stock');
            return;
          }
          location.href = 'checkout.html?productId=' + productId;
        });
        firebase.database().ref('transactionInfo').orderByChild('productId').equalTo(productId).once('value', function (uc) {
          $('.post-comment-flexer button').click(function () {
            if (uc.numChildren() > 0 || true) {
              const i = $('.post-comment-flexer textarea').val().trim();
              if (i.length == 0) {
                toast('Comment can\'t be empty');
              } else {
                $(".star-review-zoom").show();
                $('.star-review-zoom span').html('Click star to rate');
                $(".star-review-zoom div img").attr('src', 'img/star-border.svg');
                $('.star-review-zoom-close').css('display', 'block');
              }
            } else {
              alert('Only user that bought this product can review');
            }
          });
        });

        firebase.database().ref('vendors/' + userId + '/status').once('value', function (sc) {
          const status = sc.val();
          if (status == 'suspended') {
            alert('Sorry, this item has been suspended');
            sendBack();
          }
        });
        if (!s.child('status').val().startsWith('approved') && userId != sellerId) {
          alert('Access denied, this product is not yet approved');
          sendBack();
        }
        if (userId == sellerId) {
          $('.sell-chat-btn').hide();
        } else {
          firebase.database().ref('userFollowers/' + sellerId + '/' + userId).on('value', function (s) {
            var isFollowing = false;
            if (s.exists()) {
              isFollowing = true;
              $('.sell-chat-btn').css('backgroundColor', 'orange');
              $('.sell-chat-btn').html('Following');
            } else {
              $('.sell-chat-btn').css('backgroundColor', 'crimson');
              $('.sell-chat-btn').html('Follow');
            }
            $('.sell-chat-btn').off('click');
            $('.sell-chat-btn').click(function (e) {
              if (isFollowing) {
                firebase.database().ref('userFollowers/' + sellerId + '/' + userId).remove();
              } else {
                firebase.database().ref('userFollowers/' + sellerId + '/' + userId).set(firebase.database.ServerValue.TIMESTAMP);
              }
              e.preventDefault();
            });
          });
        }

        firebase.database().ref('wishlist/' + userId + '/' + productId).on('value', function (wishShot) {
          var src = 'img/wishlist.png',
            color = 'initial';

          $('#wishList').off('click');
          if (wishShot.exists()) {
            src = 'img/love.svg';
            color = 'red';
            $('#wishList').click(function () {
              firebase.database().ref('wishlist/' + userId + '/' + productId).remove();
            });
          } else {
            $('#wishList').click(function () {
              firebase.database().ref('wishlist/' + userId + '/' + productId).set(firebase.database.ServerValue.TIMESTAMP);
            });
          }
          $('#wishList img').attr('src', src);
          $('#wishList span').css('color', color);
        });
      } else {
        $(".buy-btn, .buy-pc, .post-comment-flexer button, .sell-chat-btn, #wishList").off('click');
        $(".buy-btn, .buy-pc, .post-comment-flexer button, .sell-chat-btn, #wishList").click(function () {
          redirectToSignIn();
        });
      }
    });

    var isSubmittingReview = false;

    firebase.database().ref("vendors/0XWIVTfROBXR3BvxQAG06f5zxaO2").once('value', function (v) {
      const img = formateUserImg(v.child('img').val());
      $('.seller-img').attr('src', img);
      $('.sell-name').html(v.child('fName').val() + ' ' + v.child('lName').val());
      $('.sell-live div').html('Lived At: ' + v.child('localGovt').val() + ' ' + v.child('state').val());


      $('.sell-info i').html(v.child('storeDes').val());
    });

    function submitReview(pos) {
      $(".star-review-zoom div img").eq(pos).click(function () {
        if (isSubmittingReview) {
          return;
        }
        isSubmittingReview = true;
        for (var i = 0; i <= pos; i++) {
          $(".star-review-zoom div img").eq(i).attr('src', 'img/star.svg');
        }
        $('.star-review-zoom span').html('Processing...');
        $('.star-review-zoom-close').css('display', 'none');
        firebase.database().ref('pReviews/' + productId).push().set({
          review: $('.post-comment-flexer textarea').val().trim(),
          sender: userId,
          rate: pos + 1,
          date: firebase.database.ServerValue.TIMESTAMP
        }).then(function (err) {
          isSubmittingReview = false;
          if (err) {
            alert('Failed to upload review');
          } else {
            if ($('#comment-recieve-noti-checkbox').prop('checked')) {
              firebase.database().ref('product_Review_Notifier/' + productId + '/' + userId).set(0);
            }
            $('.post-comment-flexer textarea').val('');
          }
          $(".star-review-zoom").hide();
        });
      });
    }

    for (var i = 0; i < 5; i++) {
      submitReview(i)
    }

    //querying similar products
    firebase.database().ref('Products').orderByChild('subCate').equalTo(subCate).limitToLast(15).once('value', function (cateShot) {
      if (cateShot.numChildren() > 7) {
        cateShot.forEach(function (d) {
          stampSimiCon(d);
        });
        $('.simi-progress-notify').hide();
      } else {
        firebase.database().ref('Products').orderByChild('cate').equalTo(pCate).limitToLast(15).once('value', function (subCateShot) {
          if (subCateShot.numChildren() != 0) {
            subCateShot.forEach(function (d) {
              stampSimiCon(d);
            });
          } else {
            $('.simi-not-found-temp').show();
            $('.simi-not-found-temp').attr('src', 'img/not-found.jpg');
          }
          $('.simi-progress-notify').hide();
        });
      }
    });

    function stampSimiCon(d) {
      const name = d.child('pName').val(),
        dis = d.child('discount').val(),
        price = d.child('pPrice').val(),
        image = d.child('pImg').val(),
        key = d.key;
      var dect = dis;
      if (dis == null) {
        dect = 0;
      }
      var rate = d.child('rate').val();

      if(rate == null){
        rate = 0;
      }
      var simiHtml = '<a href="onecart.html?productId=' + key + '" class="simi-cont"><img src="img/logoPlain.gif" alt="' + name + '" class="simi-cont-img" id="simpimg92'+key+'" />';
      if (dis != null && dis != 0) {
        simiHtml += '<div class="simi-dis-per-temp">-' + dis + '%</div>'
      }
      simiHtml += '<div class="simi-p-name">' + name + '</div><div class="simi-price">&#8358;' + numberWithCommas((parseFloat(price) - Math.ceil((dect * price) / 100)).toFixed(2)) + '</div><div class="simi-star">' +
        getRating(rate) + '</div></a>';
      $('.simi-appender').append(simiHtml);

      try {
        prepareProductImg('https://obscure-taiga-70753.herokuapp.com/' + image, '#simpimg92' + key);
      } catch (e) {
        $('#simpimg92' + key).attr('src', image);
      }
    }
  });

  var isLoadingReviews = false,
    reviewTimeout = null;

  firebase.database().ref("pReviews/" + productId).on('value', function (comShot) {
    clearTimeout(reviewTimeout);

    reviewTimeout = setTimeout(() => {

      firebase.database().ref('/.info/serverTimeOffset').once('value').then(function (data) {
        const serverTime = (data.val() + Date.now()),
          moreRevBtn = $('.loading-comment-notify');

        function mT(color, html) {
          moreRevBtn.css('color', color);
          moreRevBtn.html(html);
        }
        $('.forum-comment-appender').show();
        $('.forum-comment-appender').html('<img src="img/progressDots.gif" alt="" style="display: block;margin: 15vh auto;height: 10px;">');
        moreRevBtn.off('click');

        if (comShot.exists()) {
          $('.no-review-found-con').css('display', 'none');
          $('.rating-div-flex').children().css('visibility', 'visible');
          var starArr = [0, 0, 0, 0, 0];

          comShot.forEach(function (rateSnap) {
            switch (rateSnap.child('rate').val()) {
              case 1:
                ++starArr[0];
                break;
              case 2:
                ++starArr[1];
                break;
              case 3:
                ++starArr[2];
                break;
              case 4:
                ++starArr[3];
                break;
              case 5:
                ++starArr[4];
                break;
            }
          });

          var totalRating = starArr[0] + starArr[1] + starArr[2] + starArr[3] + starArr[4],
            aggregatedRating = (starArr[0] * 1) + (starArr[1] * 2) + (starArr[2] * 3) + (starArr[3] * 4) + (starArr[4] * 5);

          const averageRating = aggregatedRating / totalRating;

          $('.rating-point span').text(Math.round((averageRating + Number.EPSILON) * 100) / 100);
          $('.rating-point div').html(getRating(Math.ceil(averageRating)));
          $('.rating-point small').text(totalRating);

          var percentProgressHtml = '';
          for (var i = 4; i >= 0; i--) {
            const a = i,
              b = a + 1;
            var percent = ((b * starArr[a]) / aggregatedRating) * 100;
            percentProgressHtml += '<div><span>' + b + '</span><progress min="0" max="100" value="' + percent + '"></progress></div>'
          }
          $('.rating-progress').html(percentProgressHtml);

          const reviewNum = comShot.numChildren();
          var loadedComments = 0;
          console.log('review count  = ' + reviewNum);

          moreRevBtn.off('click');
          moreRevBtn.click(function () {
            if (isLoadingReviews) {
              return;
            }
            isLoadingReviews = true;
            console.log('review click running...');
            mT('black', 'Please wait <img src="img/progressDots.gif" alt="">');
            if (loadedComments != reviewNum) {
              firebase.database().ref('pReviews/' + productId).orderByChild('date').limitToLast((loadedComments + 10)).once('value', function (revFilt) {
                $('.forum-comment-appender').empty();
                var index = 0;
                loadedComments = revFilt.numChildren();
                console.log('filt children  =' + index + ' && loadedCom  =' + loadedComments);
                revFilt.forEach(function (d) {
                  ++index;
                  const reviewKey = d.key,
                    reviewPack = d.val(),
                    a = index;

                  console.log('message from func =' + d.child('review').val());
                  firebase.database().ref('Users/' + reviewPack.sender).once('value', function (uc) {
                    const comKey = reviewKey,
                      sender = reviewPack.sender,
                      message = reviewPack.review,
                      date = reviewPack.date,
                      review = reviewPack.rate,
                      name = uc.child('name').val(),
                      reviewImg = formateUserImg(uc.child('image').val());

                    var comHtml = '';
                    if (sender == userId) {
                      comHtml += '<div class="user-comment-cont" id="' + comKey + '"><comment>';
                    } else {
                      comHtml += '<div class="user-comment-cont"><comment>';
                    }
                    comHtml += '<img src="' + reviewImg + '" alt="' + name + 'profile image" class="review-user-img">';
                    comHtml += '<div><b>' + name + '</b><small>' + timeSince(date, serverTime) + '</small><revstar>' + getRating(review) + '</revstar><span>' + message + '</span></div></comment></div>';
                    $('.forum-comment-appender').append(comHtml);
                    console.log('reviewHtml@ ');
                    $('#' + comKey).off('click');
                    $('#' + comKey).click(function () {
                      if (confirm('Are you sure you want to delete your review')) {
                        firebase.database().ref('pReviews/' + productId + '/' + comKey).remove();
                      }
                    });
                    $('.review-user-img').off('click');
                    $('.review-user-img').click(function (e) {
                      e.stopPropagation();
                      showFullScreenImage($(this).attr('src'));
                    });
                    if (a == loadedComments) {
                      console.log('fin loadedCOm =' + loadedComments + ' && reviewNum =' + reviewNum);
                      if (loadedComments == reviewNum) {
                        moreRevBtn.hide();
                      } else {
                        moreRevBtn.show();
                        if (reviewNum - loadedComments >= 10) {
                          mT('blue', 'Load 10 more comment..');
                        } else {
                          mT('blue', 'Load ' + (reviewNum - loadedComments) + ' more comment..');
                        }
                      }
                      isLoadingReviews = false;
                    }
                  });
                });

                /*for ( i = 0; i <= (reviewPack.length - 1); i++) {
                  ++loadedComments;
                  const a = i;
                  console.log('for loop message =' + a + reviewPack[i].review); 
                }*/
              });
            }
          });
          moreRevBtn.trigger('click');
        } else {
          moreRevBtn.hide();
          $('.forum-comment-appender').hide();
          $('.star-div').html(getRating(Math.ceil(1)));
          $('.no-review-found-con').css('display', 'block');
          $('.rating-div-flex').children().css('visibility', 'visible');
        }
      });
    }, 1000);
  });

  function prepareProductImg(src, imgRef) {
    var imgAccessor = new Image();
    imgAccessor.setAttribute('crossOrigin', 'anonymous');
    imgAccessor.onload = function (r) {
      const resizedImg = getEqualizedImage(src, imgAccessor);
      $(imgRef).attr('src', resizedImg);
    }
    imgAccessor.src = src;
  }

  function getEqualizedImage(imgUrl, loadedImg) {
    const imgWidth = loadedImg.width,
      imgHeight = loadedImg.height;

    if (imgWidth == imgHeight) {
      return imgUrl;
    }
    var maxLength = imgWidth,
      canvas = document.createElement('canvas');

    if (imgWidth < imgHeight) {
      maxLength = imgHeight;
    }

    canvas.setAttribute('width', maxLength);
    canvas.setAttribute('height', maxLength);
    var ctx = canvas.getContext('2d'),
      widthDiff = 0,
      heightDiff = 0;

    if (imgWidth < imgHeight) {
      widthDiff = (imgHeight - imgWidth) / 2;
    } else {
      heightDiff = (imgWidth - imgHeight) / 2;
    }
    ctx.drawImage(loadedImg, widthDiff, heightDiff, imgWidth, imgHeight);
    ctx.fillStyle = 'white';
    //sidebar
    ctx.fillRect(0, 0, widthDiff, maxLength);
    //leftbar
    ctx.fillRect(maxLength - widthDiff, 0, widthDiff, maxLength);
    //topbar
    ctx.fillRect(0, 0, maxLength, heightDiff);
    //bottombar
    ctx.fillRect(0, maxLength - heightDiff, maxLength, heightDiff);
    return canvas.toDataURL();
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
});
