$(document).ready(function () {
    //slide-dot-con
    const tempColors = ['linear-gradient(blue,purple)', 'rgb(255, 136, 0)', 'turquoise', 'cyan', 'rgb(240, 240, 240)', 'white', 'white'];

    var scrollTimeout = null;
    $(".banner-cont").scroll(function () {
        $(".slide-dot-con div").css({
            "filter": "brightness(40%)",
            "opacity": "0.6",
            "backgroundColor": "white"
        });

        const scrollIndex = Math.round($(".banner-cont").scrollLeft() / $(".banner-cont img").width()) * 1;
        $(".slide-dot-con").children().eq(scrollIndex).css({
            "filter": "brightness(none)",
            "opacity": "unset",
            "backgroundColor": "red"
        });
        console.log(scrollIndex * 1);
        $('.top-flex-temp').css('background', tempColors[scrollIndex * 1]);
    });

    function scrollManage(btnIdentifier) {
        var imgPixels = Math.round($(".banner-cont img").width());
        var leftScrollable = ($(".banner-cont").children().length - 1) * imgPixels;
        var leftScroll = $(".banner-cont").scrollLeft() * 1;
        if (btnIdentifier == "+") {
            if (leftScroll + 7 > leftScrollable) {
                $(".banner-cont").scrollLeft(0);
            } else {
                $(".banner-cont").scrollLeft(leftScroll + imgPixels);
            }
        }
    }

    const showCaseArr = ['laptops', 'phones', 'shoes', 'earpods'];

    function showCaseToggle(a) {
        $('.p-show-case-container button').eq(a).click(function () {
            location.href = 'productsearch.html?search=' + showCaseArr[a];
        });
    }
    showCaseArr.forEach(function (element, a) {
        showCaseToggle(a);
    });


    firebase.database().ref('mainCategoryImg').once('value', function (s) {
        $('.prod-cate').empty();
        for (var i = 0; i < cate.length; i++) {
            const a = i,
                img = s.child(cate[a].toLowerCase()).val();

            if (img != null) {
                if (img.startsWith('https://firebasestorage.googleapis.com')) {
                    $('.prod-cate').append('<a href="productsearch.html?category=' + cate[a] + '"><img src="' + img + '" alt="' + cate[a] + '"><span>' + cate[a] + '</span></a>');
                }
            }
        }
    });

    firebase.database().ref('businessIndex').orderByChild('no').startAt(0).endAt(4).once('value', function (s) {
        $('.bis-cate-bucket').empty();
        s.forEach(function (d) {
            searchBuilder(d);
        });
    });

    function searchBuilder(d) {
        const key = d.key;
        var img = d.child('img').val();
        if (img == null) {
            img = 'img/airtel.png';
        }
        firebase.database().ref('businessList/' + key).once('value', function (p) {
            const pNum = p.numChildren();
            var indexHtml = '<a href="businessList.html?category=' + encodeURIComponent(key) + '" class="index-cont"><div class="data-count"><img src="img/user.svg" /><span>' + pNum + '</span></div>' +
                '<div class="index-inner-bone" style="background-image: url(\'' + img + '\');"></div><div class="cont-info"><b>' + limitString(key, 18) + '</b>' +
                '<div class="page-star-con">';
            if (pNum <= 100) {
                indexHtml += getRating(Math.ceil(pNum / 20));
            } else {
                indexHtml += getRating(5);
            }
            indexHtml += '</div></div></a>';
            $('.bis-cate-bucket').append(indexHtml);

            if ($('.bis-cate-bucket').children().length == 5) {
                $('.bis-cate-bucket').append('<a href="businessIndex.html" class="index-cont"><div class="bis-check-more-cont"><img src="img/right-arrow.svg" alt=""><b>Check More</b></div></a>');
            }
        });
    }

    //for handling all homepage products

    setInterval(function () {
        scrollManage("+");
    }, 7000);

    $(window).resize(function () {
    });

    function accessRating(rate) {
        var starHtml = '',
            review = rate;
        if (review == null || review == 0) {
            review = 1;
        }
        for (var r = 0; r < 5; r++) {
            if (review == 0) {
                starHtml += '<img src="img/stargrey.svg" alt="unrated star"/>';
            } else {
                starHtml += '<img src="img/star.svg" alt="rated star"/>';
                --review;
            }
        }
        return starHtml;
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

    const topSellingArr = ['-MROo9B8GG_ngVYk3_3D', '-MScAjtBNVq5Jww1O3-Z', '-MSOtVBhDAGNRKJNxfzG', '-MRP55EhiOKLzEcVJKfG'],
        prodRefArr = ['.prod-elect', '.prod-fashion', '.prod-latest', '.prod-special', '.prod-office'],
        allProdArr = [
            //electronics
            ['-MTL3BmGHQSId_6spO3d', '-MRP55EhiOKLzEcVJKfG', '-MSULhvLobwxuFhxmr0b', '-MT5I5TquRFtP-ucIJxF', '-MRPa4p-EWI8EpCPlGQT', '-MRINXvoQB9SSZZodH2E', '-MRPhY0RaUxf3WrotqW2', '-MT2mAStUBdpAFGl-3_s', '-MRPt11U6ho7qG3h_UlW', '-MSSFgjsGzSPMJnXG0h4', '-MRoME243GeIHYvggetk', '-MSXRPY33BjWICCdxAVp'],
            //fashion
            ['-MTHgyZFFMjdC3wZSbPb', '-MSOqq-XZHNnEifp75tO', '-MTHhTcnmE9aseWl-ZxF', '-MTHtCz-WJ_DfhJgzNoP', '-MTQJEeX1y_datT6MP46', '-MSOvI8yloUTiRk42TYh', '-MTHtfZGOhJjjf2dxQmz', '-MTQK-OAxeU1z2gt88wx', '-MSP3oIUW6bpxpf1mZsc', '-MTQKhB3_JudqMYJZaWp', '-MSP0A7KYvDBLFrJsuaQ', '-MSP26DYmKuM-8mF_ubu'],
            //latest
            ['-MTHQe-InIlWgJYUazLf', '-MSyBX-afj2jukY1EbIU', '-MTHc9Pa6u70dfkX1LvG', '-MTHUkQV3RdcUaotDb8g', '-MSyCYbfNmkQySAbLf61', '-MTHf2X5Z1N_bgdUZCz5', '-MTHdxhV0tIVWl7cAVUg', '-MSclC-dXXZrSCjO4-Xd', '-MTHdH9isgFDiHf_b17x', '-MScnQ3HvNBuVuI1DQ7g', '-MSy7oz6GnjqYUVCv9WT', '-MSyApQU6uzJWHf-ZbGe'],
            //special
            ['-MR8rk7R2pK0jY_5H3iT', '-MScdiU0FL3gpHkxcpH9', '-MR9Wvf160PFp2w1-pK8', '-MRKbOXV1doBy6erzEnP', '-MRKj5Wq4ETv8YnV9cYr', '-MSy7KW9XM4aWK6zmxOA', '-MSCsaaAmCKbQx3zh_lP', '-MSy9szxDbLRgSCBoI4s', '-MSD8lCKXH-rHKdGfIZc', '-MSDFpTIqTS_un_uSW4p', '-MSDIWe8_ATopNvs_K6k', '-MSDLfnRMuq7_eLjx5Et'],
            //office
            ['-MTQOVTyL6bVLSMQU354', '-MSQ14WDUv1p0NYYp1xU', '-MSQ5A9mafBhIA-fILMH', '-MTQPZAnhVCb__5cFp-V', '-MTHpocHAwf_6Gib_h0P', '-MSQ2glQ06DEzesEAfJ_']
        ];

    /* //shoe
     http: //127.0.0.1:5500/onecart.html?productId=-MSQ14WDUv1p0NYYp1xU
         http: //127.0.0.1:5500/onecart.html?productId=-MSQ5A9mafBhIA-fILMH
         http: //127.0.0.1:5500/onecart.html?productId=-MSQ2glQ06DEzesEAfJ_

         http: //127.0.0.1:5500/onecart.html?productId=-MTHpocHAwf_6Gib_h0P
         http: //127.0.0.1:5500/onecart.html?productId=-MTQPZAnhVCb__5cFp-V
         http: //127.0.0.1:5500/onecart.html?productId=-MTQOVTyL6bVLSMQU354*/
    var topSellCount = 0;
    for (var i = 0; i < 4; i++) {
        const a = i;
        stampTopSelling(topSellingArr[a]);
    }

    function stampTopSelling(path) {
        firebase.database().ref('Products/' + path).once('value', function (d) {
            if (topSellCount == 0) {
                $('.top-sale-appender').empty();
            }
            ++topSellCount;
            const topHtml = '<a href="onecart.html?productId=' + d.key + '"><img src="' + d.child('pImg').val() + '" alt="' + d.child('pName').val() + '"><div>' + limitString(d.child('pName').val(), 35) + '</div></a>';
            $('.top-sale-appender').append(topHtml);
        });
    }

    /*stamping all product*/

    allProdArr.forEach(function (arr, a) {
        console.log('arr =' + arr + ' & num=' + a);
        arr.forEach(function (path, i) {
            stampProductInfo(path, prodRefArr[a] + '-' + (i + 1));
        });
    });

    function stampProductInfo(path, ref) {
        firebase.database().ref('Products/' + path).once('value', function (d) {
            var price = d.child('pPrice').val(),
                dis = d.child('discount').val(),
                name = d.child('pName').val(),
                prodHtml = '<img src="' + d.child('pImg').val() + '" class="prod-div-img" alt="' + name + '"><span>' + limitString(name, 40) + '</span><div>$' + numberWithCommas(roundNumTo2(parseFloat(price) - Math.ceil((dis * price) / 100))) + '</div>';
                /*if(price >= 2000){
                    firebase.database().ref('Products/'+path+'/pPrice').set((price/400));
                }
                if(d.child('cate').val().toLowerCase() == 'phone and tablets'){
                    firebase.database().ref('Products/'+path+'/cate').set('Cell Phones');
                    firebase.database().ref('Products/'+path+'/subCate').set('No-Contract Phones');
                }
                if(d.child('cate').val().toLowerCase() == 'home and office'){
                    firebase.database().ref('Products/'+path+'/cate').set('Office Furniture & Storage');
                    firebase.database().ref('Products/'+path+'/subCate').set('Office Chairs');
                }
                if(d.child('cate').val().toLowerCase() == 'fashion'){
                    firebase.database().ref('Products/'+path+'/cate').set('Health, Fitness & Beauty');
                    firebase.database().ref('Products/'+path+'/subCate').set('Personal Care & Beauty');
                }
                if(d.child('cate').val().toLowerCase() == 'electronics'){
                    firebase.database().ref('Products/'+path+'/cate').set('Computers & Tablets');
                    firebase.database().ref('Products/'+path+'/subCate').set('Laptops');
                }*/
            if (dis != null && dis != 0) {
                prodHtml += '<badge style="background-color: ';
                if (dis > 0 && dis < 20) {
                    prodHtml += 'green';
                } else if (dis >= 20 && dis < 40) {
                    prodHtml += 'blue';
                } else if (dis >= 40 && dis < 60) {
                    prodHtml += 'purple';
                } else {
                    prodHtml += 'red';
                }
                prodHtml += ';">-' + dis + '%</badge>';
            }
            prodHtml += '<small>' + accessRating(d.child('rating').val()) + '</small></a>';
            $(ref).html(prodHtml);
            $(ref).attr('href', 'onecart.html?productId=' + path);
        });
    }

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

    /*<a>
          <img src="c/c3.jpg" class="prod-div-img">
          <span>ggf name Lorem, ipsum dolor consectetur...</span>
          <div>#502332</div>
          <del>#6000</del>
          <small>
            <img src="img/star.svg" alt="">
            <img src="img/star.svg" alt="">
            <img src="img/star.svg" alt="">
            <img src="img/stargrey.svg" alt="">
            <img src="img/stargrey.svg" alt="">
          </small>
        </a>*/
});