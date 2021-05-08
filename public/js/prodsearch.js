var queryAppender = {},
    flagST = '',
    emt = null,
    accessAppendedQuery = null,
    snappedQueryTimeout = null,
    reloadSnapFlagger = null;

$(document).ready(function () {

    function goTo(page, title, url) {
        if ("undefined" !== typeof history.pushState) {
            history.pushState({
                page: page
            }, title, url);
        } else {
            window.location.assign(url);
        }
    }

    $('.noFind button').click(function () {
        $('.noFind').hide(700);
        $('.filter-con').show(700);
    });

    $('#index-dismisser').click(function () {
        $('.noFind').show(700);
        $('.filter-con').hide(700);
    });

    $('#filter-sub-cate').change(function (e) {
        const v = $(this).val();
        if (v == 'none') {
            delete queryAppender.subCategory;
        } else {
            reloadSnapFlagger = 'yes';
            queryAppender = {};
            queryAppender.subCategory = $(this).val();
        }
        accessAppendedQuery();
    });
    $('#filter-condition').change(function (e) {
        const v = $(this).val();
        if (v == 'none') {
            delete queryAppender.condition;
        } else {
            queryAppender.condition = $(this).val();
        }
    });

    $('#filterReset').click(function () {
        $('input[name="ship-filter-name"], .filter-con-padder input[type="checkbox"]').prop('checked', false);
        $('.filter-con-padder select').val('none');
        queryAppender = {};
        reloadSnapFlagger = 'yes';
        accessAppendedQuery();
    });

    var windowSizeFlag = 0;
    $(window).resize(function () {
        if ($(this).width() >= 1230) {
            if (windowSizeFlag <= 1230) {
                $('.filter-con').show();
                $('.noFind').hide();
            }
        } else {
            if (windowSizeFlag >= 1230) {
                $('.filter-con').hide();
                $('.noFind').show();
            }
        }
        windowSizeFlag = $(this).width();
    });
    $(window).resize();

    var cateSelectHtml = '<option value="none">Select Product Category</option>';
    for (i = 0; i < cate.length; i++) {
        cateSelectHtml += '<option value="' + cate[i] + '">' + cate[i] + '</option>';
    }

    $('#filter-cate').html(cateSelectHtml);
    $('#filter-cate').change(function (e) {
        if ($(this).val() == 'none') {
            $('#filter-sub-cate').html('<option value="none">Select Product Sub-Category</option>');
            $('.filter-search-cate').hide();
            delete queryAppender.category;
        } else {
            queryAppender = {};
            queryAppender.category = $(this).val();
            reloadSnapFlagger = 'yes';
            $('.filter-search-cate').show();
            const v = e.target.selectedIndex - 1;
            var sub = '<option value="none">Select Product Sub-Category</option>';
            for (i = 0; i < subCate[v].length; i++) {
                sub += '<option value="' + subCate[v][i].toLowerCase() + '">' + subCate[v][i] + '</option>';
            }
            $('#filter-sub-cate').html(sub);
        }
        accessAppendedQuery();
    });

    $('input[name="ship-filter-name"]').change(function () {
        queryAppender.shipping = $(this).val();
        accessAppendedQuery();
    });

    var rangeArr = [
        ['#min-price-range', '#min-price-input', false],
        ['#max-price-range', '#max-price-input', true],
        ['#min-discount-range', '#min-discount-input', false],
        ['#max-discount-range', '#max-discount-input', true],
        ['#min-stock-range', '#min-stock-input', false],
        ['#max-stock-range', '#max-stock-input', true]
    ];

    /*rangeArr.forEach(e => {
        if (e[2]) {
            rightRangeToggler(e[0], e[1]);
        } else {
            leftRangeToggle(e[0], e[1]);
        }
    });*/

    function leftRangeToggle(rangeRef, inputRef) {
        try {
            document.querySelector(rangeRef).oninput = function () {
                this.value = Math.min(this.value, this.parentNode.childNodes[5].value - 1);
                let value = (this.value / parseInt(this.max)) * 100
                var children = this.parentNode.childNodes[1].childNodes;
                children[1].style.width = value + '%';
                children[5].style.left = value + '%';
                children[7].style.left = value + '%';
                children[11].style.left = value + '%';
                children[11].childNodes[1].innerHTML = this.value;
                $(inputRef).val(this.value);

                var gressRef = rangeRef.replace(/#max-/g, '').replace(/#min-/g, '').replace(/-range/g, '');
                queryAppender[gressRef] = this.value + ' TO ' + $(rangeRef.replace(/min/g, 'max')).val();
                console.log('sliding left =' + gressRef);
                accessAppendedQuery();
            }
        } catch (error) {
            throw error;
        }
    }


    function rightRangeToggler(rangeRef, inputRef) {
        try {
            document.querySelector(rangeRef).oninput = function () {
                this.value = Math.max(this.value, this.parentNode.childNodes[3].value - (-1));
                let value = (this.value / parseInt(this.max)) * 100
                var children = this.parentNode.childNodes[1].childNodes;
                children[3].style.width = (100 - value) + '%';
                children[5].style.right = (100 - value) + '%';
                children[9].style.left = value + '%';
                children[13].style.left = value + '%';
                children[13].childNodes[1].innerHTML = this.value;
                $(inputRef).val(this.value);

                var gressRef = rangeRef.replace(/#max-/g, '').replace(/#min-/g, '').replace(/-range/g, '');
                queryAppender[gressRef] = $(rangeRef.replace(/max/g, 'min')).val() + ' TO ' + this.value;
                console.log('sliding left =' + gressRef);
                accessAppendedQuery();
            }
        } catch (error) {
            throw error;
        }
    }


    //return;

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

    reloadWindow('snapping');
    var popTimeout = null;

    function reloadWindow(firstTimeLoad) {


        window.onpopstate = function (e) {
            clearTimeout(popTimeout);
            popTimeout = setTimeout(() => {
                if (e.state) {
                    reloadWindow();
                }
            }, 500);
        };

        function joinPager() {
            if (location.href.includes('&page='))
                return '';
            else
                return '&';
        }

        const searchWord = getUrlParam('search'),
            qCategory = getUrlParam('category'),
            qSubCategory = getUrlParam('subCategory'),
            queryType = getUrlParam('queryType'),
            qPrice = getUrlParam('price'),
            qPriceRange = getUrlParam('price_range'),
            qRating = getUrlParam('rate'),
            qFreeShipping = getUrlParam('shipping'),
            qType = getUrlParam('type'),
            qCondition = getUrlParam('condition'),
            qBrand = getUrlParam('brand'),
            qDiscount = getUrlParam('discount'),
            qStock = getUrlParam('stock');

        const client = algoliasearch('6PIT380A2Z', 'cf0572b6c16cd88b35f5a0ebd7b9411e'),
            index = client.initIndex('Products');

        var page = getUrlParam('page'),
            moreCategoryPath = null,
            aggregatedSearch = searchWord,
            queryJson = {},
            filterQuerier = '',
            queryParams = [
                ['price', ty(qPrice)],
                ['price_range', qPriceRange],
                ['discount', ty(qDiscount)],
                ['stock', ty(qStock)]
            ],
            pageNum = getUrlParam('pageNum'),
            searchNode = getUrlParam('searchNode'),
            filterBucket = {},
            facetFilterArr = [];
        /*isInfinitySearch = isInLocalStorage('algonex_search_method9w23'),
        isManualQuery = isInLocalStorage('algonex_query_type392');*/


        function qJoin() {
            if (filterQuerier != '') {
                filterQuerier += ' AND ';
            }
        }

        function aggressQuery(query, value) {
            if (value != null && value != 'null"') {
                qJoin();
                filterQuerier += query + ':' + value;
                /*if (!filterBucket[query]) {
                    filterBucket[query] = [];
                }
                filterBucket[query].push(query + ':' + value);*/
            }
        }

        function ty(input) {
            if (input != null)
                return input.replace(/lessThan_/g, ' <= ').replace(/greaterThan_/g, ' >= ');
            else
                return null;
        }

        if (firstTimeLoad) {
            if (qCategory != null) {
                $('#filter-cate').val(qCategory);
            }
        }

        if (page == null || !isNumber(page) || page <= 0) {
            page = 1;
        }
        if (pageNum == null) {
            pageNum = 20;
        }
        if (searchNode == null) {
            searchNode = ['pName'];
        } else {
            searchNode = searchNode.split(',');
        }

        if (searchWord != null) {
            $('#pc-prod-search-form-head input, #prod-form-search-phone-head input').val(searchWord);
            document.title = searchWord;
        } else {
            document.title = 'List of all products in algonex database';
            aggregatedSearch = '*';
        }

        queryParams.forEach(function (e) {
            aggressQuery(e[0], e[1]);
        });

        if (qRating != null) {
            qRating.split(',').forEach(function (e) {
                if (isNumber(e)) {
                    /*qJoin();
                    filterQuerier += 'rate:' + e;*/
                    if (!filterBucket['rate']) {
                        filterBucket['rate'] = [];
                    }
                    filterBucket['rate'].push('rate:' + e);
                }
            });
        }

        function queryScrapper(value, node) {
            if (value != null) {
                value.split(',').forEach(function (e) {
                    if (e != '') {
                        /*qJoin();
                        filterQuerier += node + ':' + e ;*/
                        if (!filterBucket[node]) {
                            filterBucket[node] = [];
                        }
                        filterBucket[node].push(node + ':' + e);
                    }
                });
            }
        }
        queryScrapper(qBrand, 'brand');
        queryScrapper(qType, 'type');
        queryScrapper(qCategory, 'cate');
        queryScrapper(qSubCategory, 'subCate');

        if (qFreeShipping == 'free') {
            //qJoin();
            //filterQuerier += 'free_shipping: true';
            //if (!filterBucket['shipping']) {
            filterBucket['shipping'] = ['free_shipping:true'];
            //}
        } else if (qFreeShipping == 'fee') {
            //qJoin();
            //filterQuerier += 'free_shipping: false';
            //if (!filterBucket['shipping']) {
            filterBucket['shipping'] = ['free_shipping:false'];
            //}
        } else {
            delete filterBucket['shipping'];
        }

        if (queryType != null) {
            aggregatedSearch = '*';
        }

        console.log('filters =' + filterQuerier);
        if (filterQuerier != '') {
            console.log('filterQueries =' + filterQuerier);
            queryJson.filters = filterQuerier;
        }

        if (!$.isEmptyObject(filterBucket)) {
            $.each(filterBucket, function (key, v) {
                console.log('ffkey =', key + ' & v=', v);
                facetFilterArr.push(v);
            });
            console.log('ffArr =', facetFilterArr);
            queryJson.facetFilters = facetFilterArr;
        }

        accessAppendedQuery = function (flagger, flagValue) {
            console.log('scrapping');
            if (false) {

            } else {
                var snapQuery = '';

                function sjoin(s) {
                    if (s != '' && snapQuery != '' && !undefined) {
                        return '&';
                    } else {
                        return '';
                    }
                }

                function vaj(node) {
                    console.log('node=' + node + ' value=' + queryAppender[node]);
                    if (queryAppender[node]) {
                        return sjoin(queryAppender[node]) + node + '=' + encodeURIComponent(queryAppender[node]);
                    } else {
                        return '';
                    }
                }

                function ds(node) {
                    var queue = '';
                    $.each(queryAppender[node], function (key, v) {
                        console.log('key =' + key + ' v=' + v);
                        if (queue == '') {
                            queue += node + '=' + encodeURIComponent(key);
                        } else {
                            queue += ',' + encodeURIComponent(key);
                        }
                    });
                    return sjoin(queue) + queue;
                }

                snapQuery += '?search=' + aggregatedSearch;
                snapQuery += vaj('category');
                snapQuery += vaj('subCategory');
                snapQuery += ds('brand');
                snapQuery += ds('type');
                snapQuery += ds('rate');
                snapQuery += vaj('price');
                snapQuery += vaj('discount');
                snapQuery += vaj('stock');
                snapQuery += vaj('shipping');

                console.log('snap_Q =' + snapQuery);
                if (flagger == 'pager') {
                    var g = location.href.replace(new RegExp(location.hash, "g"), '').replace(new RegExp('page=' + page, "g"), 'page=' + flagValue);
                    if (!g.includes('page=' + flagValue)) {
                        g += joinPager() + 'page=' + flagValue;
                    }
                    goTo('another page', 'Loading', g);
                } else {
                    goTo("another page", "Loading", location.origin + location.pathname + snapQuery);
                }
                var rFlag = null;
                if(reloadSnapFlagger == 'yes'){
                    reloadSnapFlagger = null;
                    rFlag = 'yes';
                }
                clearTimeout(snappedQueryTimeout);
                snappedQueryTimeout = setTimeout(() => {
                    location.href = '#cont-container-spinner';
                    if(rFlag == 'yes'){
                        reloadWindow('snapper');
                    }else{
                        reloadWindow();
                    }
                }, 700);
            }
        }

        queryJson.page = page - 1;
        queryJson.hitsPerPage = pageNum * 1;
        queryJson.facets = ['brand', 'price', 'rate', 'stock', 'type', 'price_range', 'discount'];
        queryJson.attributesToRetrieve = searchNode;
        $('#cont-container-spinner').css('display', 'block');
        $('.cont-container').empty();

        index.search(aggregatedSearch, queryJson).then((rShot) => {
            const r = JSON.parse(JSON.stringify(rShot)),
                rPageNum = r.nbPages,
                searchCount = r.nbHits,
                facetStats = r.facets_stats;

            try {
                if (firstTimeLoad) {
                    $('#rating-cont-toggle label').hide();
                    $('#rating-filt-title, #rating-cont-toggle').hide();
                    $.each(r.facets.rate, function (key, v) {
                        $('#rating-filt-title, #rating-cont-toggle').css('display', 'block');
                        var a = key;
                        if (a == 6) {
                            a = 5;
                        }
                        $('#rating-cont-toggle label[for="filter-rate-' + a + '"]').css('display', 'block');

                        $('#rating-cont-toggle #filter-rate-' + a).off('change');
                        $('#rating-cont-toggle #filter-rate-' + a).change(function () {
                            if (!queryAppender['rate']) {
                                queryAppender['rate'] = {};
                            }
                            if ($(this).prop('checked')) {
                                queryAppender['rate'][a] = a;
                            } else {
                                delete queryAppender['rate'][a];
                            }
                            accessAppendedQuery();
                        });
                    });
                }
            } catch (e) {
                console.error(e);
            }

            try {
                if (firstTimeLoad) {
                    var pMin = facetStats.price.min,
                        pMax = facetStats.price.max,
                        dMin = facetStats.discount.min,
                        dMax = facetStats.discount.max,
                        sMin = facetStats.stock.min,
                        sMax = facetStats.stock.max,
                        rArr = [
                            [pMin, pMax],
                            [dMin, dMax],
                            [sMin, sMax]
                        ],
                        flag = 0;
                    flagST = rArr;

                    rangeArr.forEach(function (e) {
                        ++flag;
                        const rangeRef = e[0],
                            inputRef = e[1],
                            flagInput = e[2],
                            ind = Math.ceil(flag / 2) - 1,
                            min = rArr[ind][0] * 1,
                            max = rArr[ind][1] * 1;

                        console.log('flag =' + ind + ' & rangeRef =' + rangeRef + ' max=' + max + ' &min=' + min + ' input=' + inputRef);

                        if (min != undefined && max != undefined) {
                            $(rangeRef).attr('min', min);
                            $(rangeRef).attr('max', max);
                            $(rangeRef).off('oninput');

                            if (flagInput) {
                                rightRangeToggler(rangeRef, inputRef);
                                $(inputRef).val(max);
                            } else {
                                leftRangeToggle(rangeRef, inputRef);
                                $(inputRef).val(min);
                            }
                        }
                    });
                }
            } catch (e) {
                console.error(e);
            }


            console.log('response =', JSON.stringify(rShot));
            if (firstTimeLoad) {
                stampFacetResult(r, 'brand', '.brand-filter-packer', '#brandFilter');
                stampFacetResult(r, 'type', '.type-filter-packer', '#typeFilter');
            }

            if (r.hits.length == 0) {
                searchAlert('img/documentTouch.jpg', 'No search result found');
                $('.cont-container').hide();
                $('.result-txt').hide();
            } else {
                $('.search-alert').hide();
                $('.cont-container').show();
                $('.result-txt').text('About ' + searchCount + ' search result found');

                $('.cont-container').empty();
                r.hits.forEach(e => {
                    const a = e._highlightResult.name.value;
                    firebase.database().ref('Products/' + e.objectID).once('value', function (s) {
                        searchBuilder(s, a);
                    });
                });
            }
            pageListBuilder(rPageNum);
            $('#cont-container-spinner').hide();
        }).catch(function (e) {

        });

        function searchAlert(img, message) {
            const s = '.search-alert';
            $(s).css('display', 'block');
            $(s + ' img').attr('src', img);
            $(s + ' div').html(message);
        }

        function searchBuilder(k, highlightedName) {
            const pName = k.child('pName').val(),
                price = k.child('pPrice').val(),
                dis = k.child('discount').val(),
                id = k.key,
                img = k.child('pImg').val();

            var rating = k.child('rate').val();
            if (rating == null || rating == 0) {
                rating = 1;
            }

            var searchTable = '<a href="onecart.html?productId=' + id + '" class="result-cont"><img src="img/logoPlain.gif" alt="' + pName + '" class="p-img" id="pwaited82r' + id + '"><div class="prod-info"><div class="p-name">' +
                highlightedName + '</div><div class="p-price">$' + numberWithCommas(roundNumTo2(price - Math.ceil((dis * price) / 100))) + '</div>';
            if (dis != null && dis != 0) {
                searchTable += '<div class="dis-div"><del>$' + price + '</del><div style="background-color: ';
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
            searchTable += '<div class="star-grid">' + getRating(rating) + '</div><div class="add-cart-bone">.</div><div class="add-cart" id="addToCartBtn' + id + '" >Add to cart</div></div></a><div class="stripe"></div>';

            $('.cont-container').append(searchTable);

            try {
                prepareProductImg('https://obscure-taiga-70753.herokuapp.com/' + img, '#pwaited82r' + id);
            } catch (e) {
                $('#pwaited82r' + id).attr('src', img);
            }

            const addCartBtn = $('#addToCartBtn' + id);

            firebase.auth().onAuthStateChanged(function (user) {
                var isUser = false,
                    uId = null,
                    isCartAdded = false;
                if (user) {
                    isUser = true;
                    uId = user.uid;
                    firebase.database().ref("cart/" + uId + "/" + id).on('value', function (cartChecker) {
                        if (cartChecker.exists() && cartChecker.val() > 0) {
                            isCartAdded = true;
                            addCartBtn.css("backgroundColor", "blue");
                            addCartBtn.text("REMOVE");
                        } else {
                            isCartAdded = false;
                            addCartBtn.css("backgroundColor", "crimson");
                            addCartBtn.text("Add To Cart");
                        }
                    });
                } else {
                    isUser = false;
                }
                addCartBtn.off('click');
                addCartBtn.click(function (e) {
                    if (isUser) {
                        if (isCartAdded) {
                            firebase.database().ref("cart/" + uId + "/" + id).remove();
                        } else {
                            firebase.database().ref("cart/" + uId + "/" + id).set(1);
                        }
                    } else {
                        redirectToSignIn();
                    }
                    e.preventDefault();
                });
            });
        }

        function stampFacetResult(r, facetNode, containerRef, containerCont) {
            try {
                const brandCount = Object.keys(r.facets[facetNode]).length;

                if (brandCount != 0) {
                    var appendedBrand = 0,
                        brandIndex = 0;

                    $(containerRef).show();

                    if (brandCount > 10) {
                        $(containerCont + ' small').css('display', 'block');
                    }
                    $(containerCont + ' .filter-appender').empty();

                    $(containerCont + ' small').click(function () {
                        var brandHtml = '',
                            brandIndexer = 0;
                        brandIndex += 10;

                        $.each(r.facets[facetNode], function (k, v) {

                            const key = k.replace(/\//g, 'SL').replace(/&/g, 'AN').replace(/ /g, '');
                            if (brandIndexer >= brandIndex - 10 && brandIndexer < brandIndex) {
                                var bh = '<label for="otestibrand' + key + facetNode + '"><input type="checkbox" name="filter-scrapper' + facetNode + '" id="otestibrand' + key + facetNode + '" value="' + k + '"><div>' + k + '</div></label>';
                                ++appendedBrand;

                                $(containerCont + ' .filter-appender').append(bh);

                                $('#otestibrand' + key + facetNode).off('change');
                                $('#otestibrand' + key + facetNode).change(function () {
                                    const value = $(this).val();

                                    if (!queryAppender[facetNode]) {
                                        queryAppender[facetNode] = {};
                                    }
                                    if ($(this).prop('checked')) {
                                        queryAppender[facetNode][value] = value;
                                    } else {
                                        delete queryAppender[facetNode][value];
                                    }
                                    accessAppendedQuery();
                                });
                            }
                            ++brandIndexer;
                        });

                        $(containerCont + ' small').html('Show more(' + (brandCount - appendedBrand) + ')');

                        if (appendedBrand == brandCount) {
                            $(containerCont + ' small').hide();
                        }
                    });
                    $(containerCont + ' small').trigger('click');
                }
            } catch (e) {
                console.error(e);
            }
        }

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

        function pageListBuilder(numPages) {
            if (numPages <= 1) {
                $('.pg-box').hide();
                return;
            }
            $('.pg-box').css('display', 'flex');
            var pgDIv = '',
                pgArrTrig = [];
            for (var i = 1; i <= numPages; i++) {
                const p = i;
                var link = location.href.split(location.hash).join('').split('page=' + page).join('') + joinPager() + 'page=' + p;
                if (p == page) {
                    pgDIv += '<a style="background-color: orange;" id="pbCont' + p + '">' + p + '</a>'
                } else {
                    pgDIv += '<a href="' + link + '" id="pbCont' + p + '">' + p + '</a>';
                    const pt = function () {
                        $('#pbCont' + p).click(function (e) {
                            accessAppendedQuery('pager', p);
                            e.preventDefault();
                        });
                    }
                    pgArrTrig.push(pt);
                }
                $('#pbCont' + p).off('click');
            }
            $('.pg-box').html(pgDIv);
            pgArrTrig.forEach(function (trig) {
                trig();
            });
        }

        function getMoreCategories() {
            firebase.database().ref('productCateImg/' + moreCategoryPath).once('value', function (moreCateShot) {
                $('.more-cate').empty();
                moreCateShot.forEach(function (m) {
                    if (m.val().startsWith('https://firebasestorage.googleapis.com')) {
                        const key = m.key;
                        $('.more-cate').append('<a href="productsearch.html?subCategory=' + encodeURIComponent(key) + '"><img src="' + m.val() + '"><span>' + key + '</span></a>');
                    }
                });
            });
        }

        if (firstTimeLoad) {
            var querySearchTimeout = null;
            const queryHintIndex = client.initIndex('Products');

            $('.filter-search-cate input').submit(function () {
                var v = $(this).val().trim();
                if (v == '') {
                    return;
                }
                aggregatedSearch = v;
                accessAppendedQuery();
            });
            document.querySelector('.filter-search-cate input').oninput = function () {
                var v = $(this).val().trim();
                if (v == '') {
                    $('.filter-search-cate small').css('display', 'block');
                    $('.filter-search-cate small').text('Find product faster by querying search only in this category');
                    $('.filter-search-cate div').hide();
                } else {
                    $('.filter-search-cate div').empty();
                    $('.filter-search-cate small').hide();
                    $('.filter-search-cate div').show();

                    function hhc(m) {
                        $('.filter-search-cate div').html('<b>' + m + '</b>');
                    }
                    hhc('Searching<img src="img/progressDots.gif">');
                    clearTimeout(querySearchTimeout);
                    querySearchTimeout = setTimeout(() => {
                        var qq = {
                                attributesToRetrieve: ['name'],
                                page: 0,
                                hitsPerPage: 7,
                            },
                            qqf = [
                                ['cate:' + $('#filter-cate').val()]
                            ],
                            qqsub = $('#filter-sub-cate').val();

                        if (qqsub != 'none') {
                            qqf.push(['subCate:' + qqsub]);
                        }
                        console.log(qqf);
                        qq.filters = qqf;

                        index.search(v, qq).then((rShot) => {
                            const response = JSON.parse(JSON.stringify(rShot));
                            if (response.hits.length == 0) {
                                hhc('No Search Result Found');
                            } else {
                                var hintHtml = '';
                                for (var i = 0; i < response.hits.length; i++) {
                                    const a = i;
                                    hintHtml += '<b>' + response.hits[a]._highlightResult.name.value + '</b>';
                                }
                                $('.filter-search-cate div').html(hintHtml);
                                $('.filter-search-cate div b').off('click');
                                $('.filter-search-cate div b').click(function () {
                                    var vc = stripHtml($(this).html());
                                    if (vc == '') {
                                        return;
                                    }
                                    $('.filter-search-cate input').val(vc);
                                    aggregatedSearch = vc;
                                    accessAppendedQuery();
                                });
                            }
                        }).catch(function (e) {
                            hhc('<span style="color: red;">Unexpected error occurred</span>');
                            throw e;
                        });
                    }, 1000);
                }
            }
        }
    }
});