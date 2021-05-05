$(document).ready(function () {

    var cateSelectHtml = '<option value="none">Select Product Category</option>';
    for (i = 0; i < cate.length; i++) {
        cateSelectHtml += '<option value="' + cate[i] + '">' + cate[i] + '</option>';
    }

    $('#p-upload-prod-cate-select').html(cateSelectHtml);
    $('#p-upload-prod-cate-select').change(function (e) {
        if ($(this).val() == 'none') {
            $('#p-upload-prod-subCate-select').html('<option value="none">Select Product Sub-Category</option>');
        } else {
            const v = e.target.selectedIndex - 1;
            var sub = '<option value="none">Select Product Sub-Category</option>';
            for (i = 0; i < subCate[v].length; i++) {
                sub += '<option value="' + subCate[v][i] + '">' + subCate[v][i] + '</option>';
            }
            $('#p-upload-prod-subCate-select').html(sub);
        }
    });

    function getEqualizedImage(imgUrl, loadedImg) {
        const imgWidth = loadedImg.width,
            imgHeight = loadedImg.height,
            diff = imgWidth - imgHeight;

        if (diff < 10 && diff > -10) {
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

    function v(inputRef) {
        return $(inputRef).val().trim();
    }

    function limitString(value, limit) {
        if (value.length <= limit)
            return value;
        else
            return value.substring(0, limit) + '...';
    }

    function getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    }

    var fileBucket = [],
        filePusher = 0,
        autoArrangeTimeout = '',
        splicedImg = 0;
    var fileSecBucket = [],
        fileSecPusher = 0;

    $('.clear-p-upload-img-first').click(function () {
        fileBucket = [];
        filePusher = 0;
        $('#prod-main-img-upload-con').empty();
        $('#prod-upload-loading-spin').css('display', 'none');
        $('#p-img-upload-grid-temp-first').show();
    });

    $('.clear-p-upload-img-sec').click(function () {
        fileSecBucket = [];
        fileSecPusher = 0;
        $('#prod-main-img-upload-con-sec').empty();
        $('#prod-upload-loading-spin-sec').css('display', 'none');
        $('#p-img-upload-grid-temp-sec').show();
    });

    $('#input-upload-p-file-first').change(function (e) {
        arrangeProdImg(true, e);
    });

    function arrangeProdImg(fromInput, e) {
        var fileLength = '';
        splicedImg = 0;
        if (fromInput) {
            fileLength = e.target.files.length;
            if (fileLength == 0) {
                return;
            }
        } else {
            fileLength = fileBucket.length;
            filePusher = 0;
            $('#prod-main-img-upload-con').empty();
        }
        if (fileLength > 0) {
            $('#prod-upload-loading-spin').css('display', 'block');
            $('#p-img-upload-grid-temp-first').hide();
        } else {
            $('#prod-upload-loading-spin').css('display', 'none');
            $('#p-img-upload-grid-temp-first').show();
        }

        if (fileBucket.length + fileLength > 8 && fromInput) {
            $('#prod-upload-loading-spin').css('display', 'none');
            alert('Maximum file that can be selected is 8, try removing some images or videos');
        } else {

            for (var i = 0; i < fileLength; i++) {
                const a = i;
                var pFile = pFile = fileBucket[a];
                if (fromInput) {
                    pFile = e.target.files[a];
                }
                const index = filePusher,
                    currentIndex = i,
                    removeId = 'removePuploadImg' + index;
                var realImgReader = new FileReader();
                realImgReader.readAsDataURL(pFile);
                fileBucket[filePusher] = pFile;
                console.log('file anme  ' + pFile.name);
                $('#' + removeId).off('click');

                if (!pFile) {
                    return;
                }

                switch (getFileExtension(pFile.name).toLowerCase()) {
                    case 'png':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'svg':

                        realImgReader.onload = function (r) {
                            var imgAccessor = new Image();
                            imgAccessor.src = r.target.result;
                            imgAccessor.onload = function () {

                                $('#prod-main-img-upload-con').append('<div id="p-upload-img-top-62vs828s' + removeId + '"> <img class = "p-img-upload" src = "img/airtel.png" /> <img src="' + r.target.result + '" alt="invalid file" class="p-img-upload-absolute-visible" /> <img class = "del-p-img-upload" id="' + removeId + '" src = "img/close.svg" alt = "Failed" /> </div>');
                                $('#' + removeId).click(function () {
                                    $('#p-upload-img-top-62vs828s' + removeId).remove();
                                    fileBucket.splice(index, 1);
                                    if (fileBucket.length <= 0) {
                                        $('#p-img-upload-grid-temp-first').show();
                                    }
                                    arrangeProdImg(false);
                                });
                                if (fileBucket.length > 0) {
                                    $('#p-img-upload-grid-temp-first').hide();
                                }
                                if (currentIndex == fileLength - 1) {
                                    $('#prod-upload-loading-spin').hide();
                                }
                            }
                        };
                        break;
                    case 'mp4':
                    case 'ogg':
                    case 'mpg':
                    case 'mpeg':
                        const fileMb = pFile.size / 1024;
                        if ((fileMb / 1024) > 30) {
                            alert('Video file size you selected has exceeded 30mbm, try picking a file lesser or equal to 30mb');
                            fileBucket.splice(index - splicedImg, 1);
                            ++splicedImg;
                            clearTimeout(autoArrangeTimeout);
                            autoArrangeTimeout = setTimeout(() => {
                                arrangeProdImg(false);
                            }, 3000);
                        } else {
                            realImgReader.onload = function (r) {
                                console.log('video ready state');
                                $('#prod-main-img-upload-con').append('<div id="p-upload-img-top-62vs828s' + removeId + '"> <img class = "p-img-upload" src = "img/airtel.png" /> <video controls class="p-img-upload-absolute-visible"><source src="' + r.target.result + '" type="video/' + getFileExtension(pFile.name).toLowerCase() + '"><source src="' + r.target.result + '" type="video/mp4"></video> <img class = "del-p-img-upload" id="' + removeId + '" src = "img/close.svg" alt = "" /> </div>');

                                $('#' + removeId).click(function () {
                                    $('#p-upload-img-top-62vs828s' + removeId).remove();
                                    fileBucket.splice(index, 1);
                                    if (fileBucket.length <= 0) {
                                        $('#p-img-upload-grid-temp-first').show();
                                    }
                                    arrangeProdImg(false);
                                });
                                if (fileBucket.length > 0) {
                                    $('#p-img-upload-grid-temp-first').hide();
                                }
                                if (currentIndex == fileLength - 1) {
                                    $('#prod-upload-loading-spin').css('display', 'none');
                                }
                            }
                        }
                        break;
                    default:
                        if (currentIndex == fileLength - 1) {
                            $('#prod-upload-loading-spin').css('display', 'none');
                        }
                        fileBucket.splice(index - splicedImg, 1);
                        ++splicedImg;
                        clearTimeout(autoArrangeTimeout);
                        autoArrangeTimeout = setTimeout(() => {
                            arrangeProdImg(false);
                        }, 3000);
                        alert('This file is not supported');
                }
                ++filePusher;
            }
        }
    }

    $('#input-upload-p-file-sec').change(function (e) {
        arrangeProdTempImg(true, e);
    });

    function arrangeProdTempImg(fromInput, e) {
        var fileLength = '';
        if (fromInput) {
            fileLength = e.target.files.length;
            if (fileLength == 0) {
                return;
            }
        } else {
            fileLength = fileSecBucket.length;
            fileSecPusher = 0;
            $('#prod-main-img-upload-con-sec').empty();
        }
        if (fileLength > 0) {
            $('#prod-upload-loading-spin-sec').css('display', 'block');
            $('#p-img-upload-grid-temp-sec').hide();
        } else {
            $('#prod-upload-loading-spin-sec').css('display', 'none');
            $('#p-img-upload-grid-temp-sec').show();
        }

        if (fileSecBucket.length + fileLength > 8 && fromInput) {
            $('#prod-upload-loading-spin-sec').css('display', 'none');
            alert('Maximum file that can be selected is 8, try removing some images or videos');
        } else {

            console.log('snap @ 243');
            for (var i = 0; i < fileLength; i++) {

                var pFile = '';
                if (fromInput) {
                    pFile = e.target.files[i];
                } else {
                    pFile = fileSecBucket[i];
                }
                const index = fileSecPusher,
                    currentIndex = i,
                    removeId = 'removePuploadImgSec' + index,
                    realImgReader = new FileReader();
                realImgReader.readAsDataURL(pFile);
                console.log('file anme  ' + pFile.name);
                $('#' + removeId).off('click');
                if (!pFile) {
                    return;
                }

                switch (getFileExtension(pFile.name).toLowerCase()) {
                    case 'png':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'svg':
                        fileSecBucket[fileSecPusher] = pFile;
                        realImgReader.onload = function (r) {
                            $('#prod-main-img-upload-con-sec').append('<div id="p-upload-img-top-62vs828s' + removeId + '"> <img class = "p-img-upload" src = "img/airtel.png" /> <img src="' + r.target.result + '" alt="invalid file" class="p-img-upload-absolute-visible" /> <img class = "del-p-img-upload" id="' + removeId + '" src = "img/close.svg" alt = "" /> </div>');
                            $('#' + removeId).click(function () {
                                $('#p-upload-img-top-62vs828s' + removeId).remove();
                                fileSecBucket.splice(index, 1);
                                if (fileSecBucket.length <= 0) {
                                    $('#p-img-upload-grid-temp-sec').show();
                                }
                                arrangeProdTempImg(false);
                            });
                            if (fileSecBucket.length > 0) {
                                $('#p-img-upload-grid-temp-sec').hide();
                            }
                            if (currentIndex == fileLength - 1) {
                                $('#prod-upload-loading-spin-sec').css('display', 'none');
                            }
                        };
                        ++fileSecPusher;
                        break;
                    default:
                        if (fileSecBucket.length > 0) {
                            $('#p-img-upload-grid-temp-sec').hide();
                        } else {
                            $('#p-img-upload-grid-temp-sec').show();
                        }
                        if (currentIndex == fileLength - 1) {
                            $('#prod-upload-loading-spin-sec').css('display', 'none');
                        }
                        alert('This file is not supported');
                }
            }
        }
    }

    var mainImg = null;

    $('#p-upload-prod-main-img-con input').change(function (e) {
        if (e.target.files.length == 0) {
            mainImg = null;
            return;
        }
        mainImg = e.target.files[0];
        switch (getFileExtension(mainImg.name).toLowerCase()) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'svg':
                $('.p-upload-prod-main-img-ierror').css('display', 'none');
                break;
            default:
                mainImg = null;
                $('#p-upload-prod-main-img-con input').val('');
                $('.p-upload-prod-main-img-ierror').css('display', 'block');
                alert('Unsupported image file format');
        }
    });

    const pu = '#p-upload-prod-';

    $('#p-upload-add-more-table-btn').click(function () {
        const tChildren = $('.p-upload-table-input tr').length - 1;
        if (tChildren >= 51) {
            alert('Products properties must be less than or equal to 50 keys and values');
        } else {
            $('.p-upload-table-input').append('<tr><td  id="p-uplad-table-data-key-first3des0' + tChildren + '" ><input type="text" placeholder="Key ' + tChildren + '" /></td><td id="p-uplad-table-data-value-secd4ewci9' + tChildren + '" ><input type="text" placeholder="Value ' + tChildren + '" /></td></tr>');
        }
    });

    for (var i = 0; i < 9; i++) {
        $('#p-upload-add-more-table-btn').trigger('click');
    }

    function s(ref) {
        return $(pu + ref).val().trim();
    }

    function v(ref, method) {
        document.querySelector(ref).oninput = method;
    }

    function g(ref) {
        $(ref).css('display', 'none');
    }

    function sh(ref) {
        $(ref).css('display', 'block');
    }

    function isNumber(value) {
        return /^\d+$/.test(value);
    }

    var ispNameValid = false,
        ispPriceValid = false,
        ispStockValid = false,
        ispCateValid = false,
        ispSubCateValid = false,
        ispCondValid = false;


    function validateSelect(iRef, errRef, flag, title) {
        $(pu + iRef).change(function () {
            var r = pu + errRef;
            if (s(iRef) != 'none') {
                if (flag == 'c') {
                    ispCateValid = true;
                } else if (flag == 's') {
                    ispSubCateValid = true;
                } else {
                    ispCondValid = true;
                }
                g(r);
            } else {
                if (flag == 'c') {
                    ispCateValid = false;
                } else if (flag == 's') {
                    ispSubCateValid = false;
                } else {
                    ispCondValid = false;
                }
                sh(r);
                $(r).html('Products ' + title + ' must be selected');
            }
        });
    }

    const proC = '.prod-upload-progress-cover-all-con';
    var sentFileNum = 0,
        pJson = {},
        hasCheckUploadValidity = false;

    function validatePJson(value, path) {
        if (value.length != 0) {
            pJson[path] = value;
        }
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userId = user.uid;
            console.log('user id   =  ' + userId);

            $('#p-upload-btn').click(function () {
                if (!hasCheckUploadValidity) {
                    hasCheckUploadValidity = true;
                    v(pu + 'name-con input', function () {
                        const r = pu + 'name-ierror';
                        if (s('name-con input').length >= 3) {
                            ispNameValid = true;
                            g(r);
                        } else {
                            ispNameValid = false;
                            sh(r);
                            $(r).html('Products name must exceed 3 characters');
                        }
                    });

                    v(pu + 'price-con input', function () {
                        const r = pu + 'price-ierror';
                        if (s('price-con input').length == 0) {
                            ispPriceValid = false;
                            sh(r);
                            $(r).html('Products price can\'t be empty');
                        } else if (!isNumber(s('price-con input'))) {
                            ispPriceValid = false;
                            sh(r);
                            $(r).html('Products price should\'t contain any text or symbols');
                        } else {
                            ispPriceValid = true;
                            g(r);
                        }
                    });

                    v(pu + 'stock-con input', function () {
                        const r = pu + 'stock-ierror';
                        if (s('stock-con input').length == 0) {
                            ispStockValid = false;
                            sh(r);
                            $(r).html('Products stock can\'t be empty');
                        } else if (!isNumber(s('stock-con input'))) {
                            ispStockValid = false;
                            sh(r);
                            $(r).html('Products stock should\'t contain any text or symbols');
                        } else {
                            ispStockValid = true;
                            g(r);
                        }
                    });
                    validateSelect('cate-select', 'cate-select-ierror', 'c', 'category');
                    validateSelect('subCate-select', 'subCate-select-ierror', 's', 'sub-category');
                    validateSelect('condition-select', 'condition-select-ierror', 'd', 'condition');
                }


                if (s('cate-select') == 'none') {
                    ispCateValid = false;
                    sh(pu + 'cate-select-ierror');
                    $(pu + 'cate-select-ierror').html('Products category must be selected');
                } else {
                    ispCateValid = true;
                    g(pu + 'cate-select-ierror');
                }

                $('.input-cont-p-upload input').trigger('oninput');
                $(pu + 'subCate-select, ' + pu + 'condition-select').trigger('change');

                const it = 'input',
                    f = '#p-upload-prod-',
                    pName = s('name-con ' + it),
                    pPrice = s('price-con ' + it),
                    pDis = s('discount-con ' + it),
                    pStock = s('stock-con ' + it),
                    pBrand = s('brand-con ' + it),
                    pDefeat = s('defeat-con ' + it),
                    pDes = s('des-con textarea'),
                    pCate = s('cate-select'),
                    pSubCate = s('subCate-select'),
                    pCond = s('condition-select'),
                    vidUrl = s('vid-url-con ' + it);
                pJson = {};
                sentFileNum = 0;

                if (ispNameValid && ispPriceValid && ispStockValid && ispCateValid && ispSubCateValid && ispCondValid) {
                    var vidCount = 0;
                    for (var i = 0; i < fileBucket.length; i++) {
                        switch (getFileExtension(fileBucket[i].name).toLowerCase()) {
                            case 'mp4':
                            case 'ogg':
                            case 'mpg':
                            case 'mpeg':
                                ++vidCount;
                                break;
                        }
                    }

                    if (mainImg == null) {
                        console.log('checking mainImg =' + mainImg);
                        $('.p-upload-prod-main-img-ierror').css('display', 'block');
                        alert('Please select a product image');
                        return;
                    }
                    $('.p-upload-prod-main-img-ierror').css('display', 'none');
                    console.log('pImg gone');
                    if (vidCount > 1) {
                        alert('Uploaded video must\'nt exceed one');
                        return;
                    }

                    if (pCond == 'used' && (vidCount == 0 && vidUrl.length < 3)) {
                        alert('Video must be attached to a used product');
                        return;
                    }

                    if (vidCount == 0 && vidUrl.length > 3) {
                        pJson['/pVid'] = vidUrl;
                    }

                    if (pDes.length < 20) {
                        alert('Product description must be greater than 20 characters');
                        return;
                    }

                    for (var i = 1; i < $('.p-upload-table-input tr').length - 1; i++) {
                        const key = $('.p-upload-table-input tr #p-uplad-table-data-key-first3des0' + i + ' input').val().trim(),
                            value = $('.p-upload-table-input tr #p-uplad-table-data-value-secd4ewci9' + i + ' input').val().trim();
                        if (key.length != 0 && value.length != 0) {
                            pJson['/properties/' + purifyTextEntity(key).replace(/#/g, '<>').toLocaleLowerCase()] = value;
                        }
                    }

                    const inBoxItem = $('#p-upload-prod-inside-box-con textarea').val().trim().split(',');
                    for (var i = 0; i < inBoxItem.length; i++) {
                        const a = i;
                        if (inBoxItem[a].trim() != '') {
                            pJson['/inBox/' + a] = inBoxItem[a].trim();
                        }
                    }

                    pJson['/pName'] = pName.toLowerCase();
                    pJson['/pPrice'] = pPrice;
                    pJson['/stock'] = pStock;
                    pJson['/cate'] = pCate.toLowerCase();
                    pJson['/subCate'] = pSubCate.toLowerCase();
                    pJson['/condition'] = pCond;
                    pJson['/status'] = 'pending' + userId;
                    pJson['/flag'] = 'pending';
                    pJson['/date'] = firebase.database.ServerValue.TIMESTAMP;
                    pJson['/sellerId'] = userId;
                    if (pDis == '' || pDis.length == 0) {
                        pJson['/discount'] = 0;
                    } else {
                        pJson['/discount'] = pDis;
                    }
                    validatePJson(pBrand.toLowerCase(), '/brand');
                    validatePJson(pDefeat, '/defect');

                    var productId = firebase.database().ref('Products').push().key;
                    console.log('logging key  = ' + productId + ' amd name = ' + pName);
                    $(proC).show();
                    firebase.database().ref('Products/' + productId).update(pJson).then(function (err) {
                        if (err) {
                            alert('Product uploading failed, Please try again later');
                            $(proC).hide();
                        } else {
                            firebase.database().ref('ProductDes/' + productId).set(pDes);
                            prepareCompressing(null, productId, 'mainImage');
                            prepareCompressing(fileBucket, productId, 'img');
                            prepareCompressing(fileSecBucket, productId, 'prodTemp');
                        }
                    });
                } else {
                    alert('Please fill the required fields');
                }
            });
        }
    });

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }

    function prepareCompressing(fileArr, productId, fileType) {
        console.log('product upload started for  ' + fileType + '  and id = ' + productId);
        $(proC + 't b').html('Processing');
        const totalBucket = fileBucket.length + fileSecBucket.length + 1;

        function resizeProdImage(file, pathS) {
            new Compressor(file, {
                quality: 0.8,
                convertSize: 70000,
                success(result) {
                    d(result);
                },
                error() {
                    d(file);
                }
            });

            function d(result) {
                if (fileType == 'prodTemp') {
                    uploadProdFileToStorage(productId, result, pathS, totalBucket);
                } else {
                    var realImgReader = new FileReader();
                    realImgReader.readAsDataURL(result);
                    realImgReader.onload = function (r) {
                        var imgAccessor = new Image();
                        imgAccessor.src = r.target.result;
                        imgAccessor.onload = function () {
                            const resizedImg = getEqualizedImage(r.target.result, imgAccessor);
                            uploadProdFileToStorage(productId, dataURLtoBlob(resizedImg), pathS, totalBucket);
                        }
                    }
                }
            }
        }
        if (fileType == 'mainImage') {
            resizeProdImage(mainImg, 'pImg');
        } else {
            for (var i = 0; i < fileArr.length; i++) {
                const a = i;

                switch (getFileExtension(fileArr[a].name).toLowerCase()) {
                    case 'png':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'svg':
                        resizeProdImage(fileArr[a], '/' + fileType + '/');
                        break;
                    default:
                        resizeProdImage(fileArr[a], 'pVid');
                }

            }
        }
    }

    function uploadProdFileToStorage(productId, file, fileDir, totalBucket) {
        const imgKey = firebase.database().ref('Products').push().key,
            storageRef = firebase.storage().ref('Products/' + productId + '/' + imgKey + '.png'),
            uploadTask = storageRef.put(file);
        var filePath = fileDir + imgKey;

        if (fileDir == 'pVid') {
            filePath = '/pVid/';
        } else if (fileDir == 'pImg') {
            filePath = '/pImg/';
        }

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (s) {
            const progress = (s.bytesTransferred / s.totalBytes) * 100;
            $(proC + 't b').html('Uploading Please wait ' + progress + '%');
        }, function (error) {
            ++sentFileNum;
            console.log('error uploading file');
            if (sentFileNum == totalBucket) {
                alert('Failed to upload some product image');
                $(proC).hide();
                $('.input-cont-p-upload input, .p-upload-prod-des-con textarea').val('');
                $('.form-con-p-upload select').val('none');
            }
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {

                var retryLimit = 0;

                function processUpload() {
                    firebase.database().ref('Products/' + productId + filePath).set(downloadURl).then(function (err) {
                        if (err) {
                            if (retryLimit < 7) {
                                ++retryLimit;
                                processUpload();
                            } else {
                                ++sentFileNum;
                            }
                            console.log('data upload failed  ' + downloadURl);
                        } else {
                            ++sentFileNum;
                            console.log('data upload sucessful  ' + downloadURl);
                        }
                        if (sentFileNum == totalBucket) {
                            alert('Products uploaded successfully');
                            $(proC).hide();
                            mainImg = null;
                            $('.clear-p-upload-img-first').trigger('click');
                            $('.input-cont-p-upload input, .p-upload-prod-des-con textarea').val('');
                            $('.form-con-p-upload select').val('none');
                        }
                    });
                }
                processUpload();
            });

        });
    }

    function purifyTextEntity(value) {
        var output = '';
        for (var i = 0; i < value.length; i++) {
            switch (value[i]) {
                case '\\':
                    output += '&#92;';
                    break;
                case ' ':
                    output += '&#32;';
                    break;
                case '/':
                    output += '&#47;';
                    break;
                case '!':
                    output += '&#33;';
                    break;
                case '"':
                    output += '&#34;';
                    break;
                case '#':
                    output += '&#35;';
                    break;
                case '$':
                    output += '&#36;';
                    break;
                case '%':
                    output += '&#37';
                    break;
                case '&':
                    output += '&#38;';
                    break;
                case "'":
                    output += '&#39;';
                    break;
                case '(':
                    output += '&#40;';
                    break;
                case ')':
                    output += '&#41;';
                    break;
                case '*':
                    output += '&#42;';
                    break;
                case '+':
                    output += '&#43;';
                    break;
                case ',':
                    output += '&#44;';
                    break;
                case '.':
                    output += '&#46;';
                    break;
                case ':':
                    output += '&#58;';
                    break;
                case ';':
                    output += '&#59;';
                    break;
                case '<':
                    output += '&#60;';
                    break;
                case '=':
                    output += '&#61;';
                    break;
                case '>':
                    output += '&#62;';
                    break;
                case '?':
                    output += '&#63;';
                    break;
                case '@':
                    output += '&#64;';
                    break;
                case "[":
                    output += '&#91;';
                    break;
                case ']':
                    output += '&#93;';
                    break;
                case '^':
                    output += '&#94;';
                    break;
                case '_':
                    output += '&#95;';
                    break;
                case '`':
                    output += '&#96;';
                    break;
                case '{':
                    output += '&#123;';
                    break;
                case '|':
                    output += '&#124;';
                    break;
                case '}':
                    output += '&#125;';
                    break;
                case '~':
                    output += '&#126;';
                    break;
                case '×':
                    output += '&#215;';
                    break;
                case '÷':
                    output += '&#247;';
                    break;
                case '.':
                    output += '&#8901;';
                    break;
                case '–':
                    output += '&#8211;';
                    break;
                case '—':
                    output += '&#8212;';
                    break;
                case '‘':
                    output += '&#8216;';
                    break;
                case '’':
                    output += '&#8217;';
                    break;
                case '‚':
                    output += '&#8218;';
                    break;
                case '“':
                    output += '&#8220;';
                    break;
                case '”':
                    output += '&#8221;';
                    break;
                case '„':
                    output += '&#8222;';
                    break;
                case '•':
                    output += '&#8226;';
                    break;
                case '′':
                    output += '&#8242;';
                    break;
                case '″':
                    output += '&#8243;';
                    break;
                case '™':
                    output += '&#8482;';
                    break;
                case '⌈':
                    output += '&#8968;';
                    break;
                case '⌉':
                    output += '&#8969;';
                    break;
                case '⌊':
                    output += '&#8970;';
                    break;
                case '⌋':
                    output += '&#8971;';
                    break;
                default:
                    output += value[i];
            }
        }
        return output;
    }

});