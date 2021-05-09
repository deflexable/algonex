var toastTimeout, accessMessageDialog = null,
  hasGottenProgressScript = false,
  themeColorLight = 'green',
  pathForRecordedSearchData_ = 'productsearch.html?search=',
  micId_ = '#phone-prod-search-icon-img, #pc-prod-search-icon-img';

function roundNumTo2(num) {
  try {
    return Math.ceil(num * 100) / 100;
  } catch (e) {
    return num;
  }
}


function hoverBesideView(currentHover) {
  $(currentHover).on({
    mouseenter: function () {
      $(this).next('img').show(500);
    },
    mouseleave: function () {
      $(this).next('img').hide(500);
    }
  });
}

function limitString(value, limit) {
  if (value.length <= limit)
    return value;
  else
    return value.substring(0, limit) + '...';
}

function formateUserImg(img) {
  if (img == null)
    return 'img/user.png';
  else
    return img
}

function stripHtml(html) {
  var doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

function getAccessToScript(loadTrigger, scriptSrc, part, type) {
  var script = document.createElement('script');
  script.src = scriptSrc;
  if (type) {
    script.type = type;
  }
  script.onload = loadTrigger;
  if (part == 'body') {
    document.body.appendChild(script);
  } else {
    document.head.appendChild(script);
  }
}

function toast(text, img, color) {
  console.log('toasting...');
  var h = '.header-toast';
  if ($(h).css('display') == 'none') {
    $(h).slideToggle(700);
    $(h + ' span').text(text);
    if (img != '') {
      $(h + ' img').css('display', 'block');
      $(h + ' img').attr('src', img);
    } else {
      $(h + ' img').css('display', 'none');
    }
    toastTimeout = setTimeout(function () {
      $(h).slideToggle(700);
    }, 3000);
  } else {
    clearTimeout(toastTimeout);
    $(h).css('display', 'none');
    $(h).slideToggle(700);
    toastTimeout = setTimeout(function () {
      $(h).slideToggle(700);
    }, 3000);
  }
  if (color != 'undefined') {
    $(h).css('backgroundColor', color);
  } else {
    $(h).css('backgroundColor', 'red');
  }
}

function isInLocalStorage(key) {
  if (window.localStorage.getItem(key) === null)
    return false;
  else
    return true;
}

function getUrlParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  return decodeURIComponent(results[1]) || 0;
}

function isNumber(value) {
  return /^\d+$/.test(value);
}

function redirectToSignIn() {
  location.href = 'signin.html?i=' + encodeURIComponent(location.href);
}

function showFullScreenImage(src) {
  $('.head-img-zoomer-con').show(500);
  $('.head-img-zoomer-img').attr('src', src);
}

function copyToClipBoard(copyText) {
  $('#mes-copy-bucket-pc').val(copyText);
  $('#mes-copy-bucket-pc').select();
  document.execCommand('copy');
  toast('Copied To Clipboard', 'img/copyWhite.svg', 'blue');
}

function changeNullToZero(value) {
  if (value == null)
    return 0;
  else
    return value;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function purifyHtml(value) {
  var output = '';
  for (var i = 0; i < value.length; i++) {
    const a = i;
    switch (value[a]) {
      case '\\':
        output += '&#92;';
        break;
      case '/':
        output += '&#47;';
        break;
      case '"':
        output += '&#34;';
        break;
      case '<':
        output += '&#60;';
        break;
      case '>':
        output += '&#62;';
        break;
      case "'":
        output += '&#62;';
        break;
      default:
        output += value[a];
    }
  }
  return output;
}

function getFileExtension(filename) {
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}

function getDataFromServer(url, json, successCallback, errorCallback) {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: "jsonp",
    cache: true,
    data: json,
    success: successCallback,
    error: errorCallback
  });
}

async function getServerTime() {
  var t = await firebase.database().ref('/.info/serverTimeOffset').once('value');
  return t.val() + Date.now();
}

function timeSince(dateString, currentTime) {
  var rightNow = new Date().getTime();
  var dd = new Date(dateString);
  var gmtToLocal = dd.toLocaleString();
  var then = new Date(gmtToLocal);
  // var then = convertLocalDateToUTCDate(dateString, false);
  if (currentTime) {
    rightNow = currentTime;
  }

  var diff = Math.abs((rightNow - then.getTime()) / 1000);
  var second = 1,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7,
    month = week * 4.34524,
    year = month * 12;

  if (isNaN(diff) || diff < 0) {
    return "Invalid time"; // return blank string if unknown
  }

  if (diff < second * 2) {
    // within 2 seconds
    return "right now";
  }

  if (diff < minute) {
    return Math.floor(diff / second) + " seconds ago";
  }

  if (diff < minute * 2) {
    return "about 1 minute ago";
  }

  if (diff < hour) {
    return Math.floor(diff / minute) + " minutes ago";
  }

  if (diff < hour * 2) {
    return "about 1 hour ago";
  }

  if (diff < day) {
    return Math.floor(diff / hour) + " hours ago";
  }

  if (diff > day && diff < day * 2) {
    return "yesterday";
  }

  if (diff < day * 7) {
    return Math.floor(diff / day) + " days ago";
  }

  if (diff < month) {
    return Math.floor(diff / week) + " weeks ago";
  }
  if (diff < year) {
    return Math.floor(diff / month) + " months ago";
  } else {
    return Math.floor(diff / year) + " years ago";
  }
}
var config = {
  apiKey: "AIzaSyDvYN58aKhJWxK0Fz1CTWx_i20Gjf4YPWw",
  authDomain: "algonex-7.firebaseapp.com",
  databaseURL: "https://algonex-7-default-rtdb.firebaseio.com",
  projectId: "algonex-7",
  storageBucket: "algonex-7.appspot.com"
};
firebase.initializeApp(config);

function isPushAndServiceSupported() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }
  return true;
}

async function registerSW() {
  await navigator.serviceWorker.register('../service-worker.js');
}

function getSW() {
  return navigator.serviceWorker.getRegistration('../service-worker.js');
}

async function disableExamples() {
  const sw = await getSW();
  if (sw) {
    await sw.unregister();
  }
}

function triggerNotification(title, body, params, image, sound, timestamp, groupingTag) {

  try {
    var options = {
        icon: '/img/logo.png',
        badge: "/img/logo.png",
        requireInteraction: true,
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]
      },
      link = params.link,
      execute = params.trigger;

    if (body) {
      options.body = body;
    } else {
      options.body = 'notification from Algonex';
    }
    if (image) {
      options.image = image;
    }
    if (sound) {
      options.sound = sound;
    } else {
      options.sound = '/aud/bellStruck.mp3';
    }
    if (timestamp) {
      options.timestamp = timestamp;
    }
    if (groupingTag) {
      options.renotify = true;
      options.tag = groupingTag;
    }

    var ty = navigator.serviceWorker;
    ty.ready.then(function (registration) {
      registration.showNotification(title, options);
      self.addEventListener('notificationclick', function (event) {
        console.log('click noti');
        const clickedNotification = event.notification;
        clickedNotification.close();

        const urlToOpen = new URL(link, registration.location.origin).href;

        const promiseChain = clients.matchAll({
            type: 'window',
            includeUncontrolled: true
          })
          .then((windowClients) => {
            var matchingClient = null;

            for (var i = 0; i < windowClients.length; i++) {
              const windowClient = windowClients[i];
              if (windowClient.url === urlToOpen) {
                matchingClient = windowClient;
                break;
              }
            }

            if (matchingClient) {
              execute();
              return matchingClient.focus();
            } else {
              return clients.openWindow(urlToOpen);
            }
          });

        event.waitUntil(promiseChain);
      });
    });
  } catch {
    console.error('Notification error (err 16ie)');
  }
}

$(function () { //when doc has loaded

  $('.nav-con').css('display', 'block');

  $('.head-img-zoomer-close-btn').click(function () {
    $('.head-img-zoomer-con').hide(700);
  });
  $('.profile-nav').click(function () {
    showFullScreenImage($(this).attr('src'));
  });

  var sendMesAudio = null,
    hasGotMesAudio = false;

  //for dragging chat conatiner
  function dragElement(containerRef, containerHandle) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    containerHandle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      containerRef.style.top = (containerRef.offsetTop - pos2) + "px";
      containerRef.style.left = (containerRef.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  dragElement(document.getElementById('mes-container-pc-id-sharp'), document.getElementById('chatTop'));

  var cateHtml = '';
  for (var i = 0; i < cate.length; i++) {
    cateHtml += '<div><h>' + cate[i] + '</h>';
    const mCateContId = 'phone-product-category-bzcx9r3r8sd22a5n' + i;
    var phoneCateHtml = '<div class="phone-product-cate-dialog-head-cont"  id="' + mCateContId + '"><b>' + cate[i] + '</b><div>';
    var index = 0;
    while (index <= subCate[i].length - 1) {
      cateHtml += '<a href="productsearch.html?subCategory=' + encodeURIComponent(subCate[i][index]) + '">' + subCate[i][index] + '</a>';
      phoneCateHtml += '<a href="productsearch.html?subCategory=' + encodeURIComponent(subCate[i][index]) + '">' + subCate[i][index] + '</a>';
      ++index;
    }
    cateHtml += '</div>';
    phoneCateHtml += '</div></div>';
    //firebase.database().ref('mainCategoryImg/' + cate[i].toLowerCase()).set('somestrings');
    $('.phone-product-cate-dialog-scroll').append(phoneCateHtml);
    $('#' + mCateContId + ' b').click(function () {
      $('#' + mCateContId + ' div').slideToggle(700);
    });
  }
  $('.product-cate-drop-wide').html(cateHtml);
  $('.product-cate-drop-wide-sec').html(cateHtml);

  function hoverView(mainHover, otherHover, otherHoverDisplay) {
    var hoverTimeout;
    $(mainHover).on({
      mouseenter: function () {
        $(otherHover).css('display', otherHoverDisplay);
      },
      mouseleave: function () {
        hoverTimeout = setTimeout(() => {
          $(otherHover).css('display', 'none');
        }, 400);
      }
    });
    $(otherHover).on({
      mouseenter: function () {
        clearTimeout(hoverTimeout);
        $(otherHover).css('display', otherHoverDisplay);
      },
      mouseleave: function () {
        $(otherHover).fadeOut(400);
      }
    });
  }
  hoverView('#product-cate-drop-wide-hover', '.product-cate-drop-wide', 'block');
  hoverView('#service-head-pc-button', '.product-cate-drop-wide-sec', 'block');

  const pcd = '.phone-product-cate-dialog-head';
  $('.phone-product-cate-dialog-toolbar img').click(function () {
    $(pcd).slideToggle();
  });

  //product search
  var client = algoliasearch('6PIT380A2Z', 'cf0572b6c16cd88b35f5a0ebd7b9411e'),
    index = client.initIndex('Products'),
    algoliaSearchTimeout = null;

  var arrowKeyPosition = 0,
    lastSearchIndex = '';

  function accessSearch(searchString) {
    if (searchString != '') {
      location.href = 'productsearch.html?search=' + encodeURIComponent(searchString) + "&page=1";
    }
  }

  function getImportantWord(input) {
    var aiArr = [],
      sp = input.split(' '),
      focusedSearch = '',
      addedFocus = 0,
      addedWords = 0;

    for (var i = 0; i < sp.length; i++) {
      const a = i;
      if (!aiArr.includes(sp[a])) {
        aiArr.push(sp[a]);
      }
    }
    for (var i = 0; i < aiArr.length; i++) {
      const a = i;
      if (aiArr[a].includes('<em>') && aiArr[a].includes('</em>')) {
        ++addedFocus;
        focusedSearch += stripHtml(aiArr[a]) + ' ';
      } else if (addedWords <= 2) {
        ++addedWords;
        focusedSearch += aiArr[a] + ' ';
      }
      if ((addedFocus + addedWords) == 5) {
        break;
      }
    }
    console.log('important mes =' + focusedSearch);
    return focusedSearch.trim();
  }

  function fetchSearch(inputObject, searchAppender) {
    console.log('fetching search...');
    var searchWords = inputObject.val().trim(),
      searchTemp = $(searchAppender);

    if (lastSearchIndex != searchWords) {
      if (searchWords != '') {
        searchTemp.show();
        searchTemp.html('<div style="display: block;">Searching <img src="img/progressDots.gif" style="width: initial;display: inline-block;"></div>');
        lastSearchIndex = searchWords;

        clearTimeout(algoliaSearchTimeout);
        algoliaSearchTimeout = setTimeout(() => {
          index.search(searchWords, {
            attributesToRetrieve: ['name', 'img'],
            hitsPerPage: 10,
          }).then((hits) => {

            var respondString = JSON.stringify(hits);
            var respondJson = JSON.parse(respondString),
              html = '',
              hasImgInResult = false;
            console.log('search responded with  ' + respondString);
            for (var i = 0; i < respondJson.hits.length; i++) {
              const img = respondJson.hits[i].img;
              if (img) {
                hasImgInResult = true;
              }
            }
            for (var i = 0; i < respondJson.hits.length; i++) {
              const img = respondJson.hits[i].img,
                id = respondJson.hits[i].ref;
              html += '<div';
              if (id) {
                html += ' id="searchHi24u9' + id + '"';
              }
              if (img) {
                const imfo = img.replace(/<em>/g, '').replace(/<\/em>/g, '');
                html += ' style="padding: 5px 10px 5px 15px;"><img src="' + imfo + '"><img src="' + imfo + '">';
              } else {
                html += '>';
                if (img) {
                  html += '<scpk></scpk>'
                }
              }
              html += '<span>' + getImportantWord(respondJson.hits[i]._highlightResult.name.value) + '</span></div>';
            }
            searchTemp.html(html);
            $('.pc-search-hint div img:first-child').off('hover');
            hoverBesideView('.pc-search-hint div img:first-child');
            $(searchAppender + ' div').off('click');
            $(searchAppender + ' div').click(function (e) {
              var reh = $(this).attr('id'),
                jie = $(this).children('span').html();
              if (reh && false) {
                location.href = 'onecart.html?productId=' + reh.replace(/searchHi24u9/g, '');
              } else {
                accessSearch(getImportantWord(jie));
              }
              searchTemp.empty();
            });
            arrowKeyPosition = 0;
          }).catch(function (e) {
            searchTemp.empty();
          });
        }, 900);
      } else {
        searchTemp.hide();
        arrowKeyPosition = 0;
      }
    }

  }

  function highlightHint(h, inputObject) {
    $(h).children().css('backgroundColor', 'white');
    $(h).children().eq(arrowKeyPosition).css('backgroundColor', 'rgb(216, 216, 216)');
    inputObject.val(getImportantWord(document.querySelector(h).childNodes[arrowKeyPosition].lastElementChild.innerHTML));
  }

  function pageAlgolia(inputRef, searchTemp) {
    const inputObject = $(inputRef);
    inputObject.keyup(function (e) {
      var code = window.e ? e.keyCode : e.which;

      if (code == 0 || code == 255) {
        return;
      }
      console.log('pressing it now' + code);
      var hintChild = $(searchTemp).children();
      //arrowUp = 38
      //arrowDOwn = 40
      if ((code == 38 || code == 40) && hintChild.length > 0) {

        if (code == 38) {

          if (arrowKeyPosition == 0) {
            arrowKeyPosition = hintChild.length - 1;
            highlightHint(searchTemp, inputObject);
          } else {
            --arrowKeyPosition;
            highlightHint(searchTemp, inputObject);
          }

        } else {
          if (arrowKeyPosition == hintChild.length - 1) {
            arrowKeyPosition = 0;
            highlightHint(searchTemp, inputObject);
          } else {
            ++arrowKeyPosition;
            highlightHint(searchTemp, inputObject);
          }
        }

      } else {
        fetchSearch(inputObject, searchTemp);
      }

    });
  }
  const psFormRef = '#prod-form-search-phone-head',
    pcSearchRef = '#pc-prod-search-form-head';

  pageAlgolia(pcSearchRef + ' input', '.pc-search-hint');
  pageAlgolia(psFormRef + ' input', '.phone-search-hint');


  function submitSearch(searchFormId, searchBtnId, searchInput, searchTemp) {
    $(searchFormId).submit(function (e) {
      accessSearch($(searchInput).val().trim());
      e.preventDefault();
    });
    /*$(searchBtnId).click(function () {
      accessSearch($(searchInput).val().trim());
      $(searchTemp).empty();
    });*/
  }
  submitSearch(pcSearchRef, '#pc-prod-search-icon-img', pcSearchRef + ' input', '.pc-search-hint');
  submitSearch(psFormRef, '#phone-prod-search-icon-img', psFormRef + ' input', '.phone-search-hint');

  var hasGetFileForSearchRecording = false;
  $(micId_).click(function () {
    if (!hasGetFileForSearchRecording) {
      $('body').append('<div class="prod-search-recorder-con"><div><img src="img/recording.gif" alt="microphone"><small>I\'m Listening...</small><b>Try Speaking</b><span></span></div></div>');
      toast('Please wait..');
      $('.prod-search-recorder-con').click(function () {
        $(this).slideToggle(700);
      });
      $('.prod-search-recorder-con div').click(function (e) {
        e.stopPropagation();
      });
      getAccessToScript(function () {}, 'js/voice-search.js', 'body', 'module');
    }
    hasGetFileForSearchRecording = true;
  });

  //drop menu
  function slideDrop(position) {
    $(".drop-view").eq(position).click(function () {
      var j = $(".drop-list");
      if (position == 1) {
        j.eq(1).hide(500);
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            j.eq(0).slideToggle(500);
          } else {
            redirectToSignIn();
          }
        });
      } else if (position == 2) {
        j.eq(0).hide(500);
        j.eq(1).slideToggle(500);
      }
    });
  }
  slideDrop(1);
  slideDrop(2);


  firebase.database().ref('statistics').push().set(location.href);

  var notiBtn = $(".noti-div"),
    mesPcCon = $(".mes-container-pc"),
    notiCon = $('.noti-container-master'),
    currentMesPath = '',
    currentMesId = '',
    addedFileCount = 0,
    isGroupChat = false,
    mesFireRef = firebase.database().ref(),
    mesSilentRef = mesFireRef,
    userStatusRef = null,
    groupAllRef = mesFireRef,
    mesTypingRef = mesFireRef,
    mesIdRef = mesFireRef,
    chatQueryRef = mesFireRef,
    groupPrivateRef = mesFireRef,
    groupRequestRef = mesFireRef,
    groupParRef = mesFireRef,
    mesUserId = '',
    currentReplyId = '',
    isWindowPhone = false,
    fireTime = firebase.database.ServerValue.TIMESTAMP,
    isEnterSend = isInLocalStorage('naijabissMesEnterSend'),
    isNotifyWithAudio = isInLocalStorage('naijabissMesNotifyAudio'),
    isNotifyWithPopup = isInLocalStorage('naijabissMesPopup');

  var mesAlertListenJson = [];

  function uploadUserImg() {
    progressCon.css('display', 'block');
    console.log('send com img to server');
  }

  function playMesSentAudio() {
    if (!hasGotMesAudio) {
      hasGotMesAudio = true;
      sendMesAudio = new Audio('aud/sendMes.mp3');
      sendMesAudio.play();
    } else {
      sendMesAudio.play();
    }
  }

  var hasTextTypingTimeout = true,
    typingTimeout;

  $('.mes-hint-toggler').click(function () {
    $('.mes-edittext-pc').focus()
  });
  document.querySelector('.mes-edittext-pc').oninput = function () {
    if ($('.mes-edittext-pc').text().length > 0) {
      $('.mes-hint-toggler').css('display', 'none');
    } else {
      $('.mes-hint-toggler').css('display', 'block');
    }

    if (hasTextTypingTimeout) {
      hasTextTypingTimeout = false;
      if (!isGroupChat) {
        firebase.database().ref('message/' + currentMesPath + '/' + mesUserId + '/isTyping').set(true);
        firebase.database().ref('message/' + currentMesPath + '/' + mesUserId + '/isTyping').onDisconnect().remove();
      } else {
        firebase.database().ref('groupChat/' + currentMesPath + '/isTyping').set(mesUserId);
        firebase.database().ref('groupChat/' + currentMesPath + '/isTyping').onDisconnect().remove();
      }
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(function () {
      hasTextTypingTimeout = true;
      if (!isGroupChat) {
        firebase.database().ref('message/' + currentMesPath + '/' + mesUserId + '/isTyping').remove();
      } else {
        firebase.database().ref('groupChat/' + currentMesPath + '/isTyping').remove();
      }
    }, 2000);
    //alert('message editext is changing');
  };

  function getCaretPosition() {
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0);
      var selectedObj = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i].outerHTML)
          rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      return range.startOffset + rangeCount;
    }
    return -1;
  }

  //$('.mes-container-pc').show();

  $('.mes-edittext-pc').keydown(function (e) {
    console.log('code =' + e.keyCode);
    if (e.keyCode == 13) {
      e.preventDefault();
      const message = $('.mes-edittext-pc').html(),
        cursor = getCaretPosition();
      if (false) {
        //enter is send
        $('.send-mes-pc').trigger('click');
      } else {
        $('.mes-edittext-pc').html(message.substring(0, cursor) + '\n' + message.substring(cursor, message.length));
      }
    }
    return;
  });

  $('.send-mes-pc').click(function () {
    var message = $('.mes-edittext-pc').html(),
      instantMesPath = currentMesPath;
    $('.mes-edittext-pc').html('');
    $('.mes-emoji-con').css('display', 'none');
    if (message.length == 0) {
      toast("Message can't be empty", 'img/warning.svg');
    } else {
      var chatJson = {
        type: 'text',
        sender: mesUserId,
        message: message,
        date: fireTime
      }
      if (currentReplyId != '') {
        $('.reply-mes-pc-con').hide();
        chatJson.replyTo = currentReplyId;
      }

      if (instantMesPath.startsWith('groupFlag')) {
        firebase.database().ref('groupChat/' + instantMesPath).once('value', function (pd) {
          if (!pd.child('private').exists() || pd.child('participants/' + mesUserId).exists()) {
            if (!pd.child('isSilent').exists()) {
              firebase.database().ref('chats/' + instantMesPath).push().set(chatJson);
              pd.child('participants').forEach(function (d) {
                const ugk = d.key;
                firebase.database().ref('message/' + ugk + '/' + instantMesPath + '/lastDate').set(fireTime);
                if (ugk != mesUserId) {
                  firebase.database().ref('message/' + ugk + '/' + instantMesPath + '/seen').transaction(function (plusCount) {
                    return (plusCount || 0) + 1;
                  });
                }
              });
              playMesSentAudio();
            } else {
              $('.mes-edittext-pc').text(message);
              alert('This group has been silence by the admin');
            }
          } else {
            $('.mes-edittext-pc').text(message);
            alert('You are not allowed to message to this group');
          }
        });
      } else {
        var mesRef = firebase.database().ref('message');
        mesRef.child(mesUserId + '/' + instantMesPath).once('value', function (friendShot) {
          var chatMesId = friendShot.child('messageId').val();
          if (chatMesId != null) {
            if (!friendShot.child('isSilent').exists()) {
              firebase.database().ref('chats/' + chatMesId).push().set(chatJson).then(function (err) {
                if (!err) {
                  console.log('running at 357...');
                  var cu = {};
                  cu['/' + mesUserId + '/' + instantMesPath + '/lastDate'] = fireTime;
                  cu['/' + instantMesPath + '/' + mesUserId + '/lastDate'] = fireTime;
                  mesRef.update(cu);
                  firebase.database().ref('message/' + instantMesPath + '/' + mesUserId + '/seen').transaction(function (plusCount) {
                    return (plusCount || 0) + 1;
                  });
                  playMesSentAudio();
                }
              });
            } else {
              $('.mes-edittext-pc').text(message);
              alert("Message can't be sent because this chat has been silence");
            }

          } else {
            var newMesId = mesUserId + instantMesPath;
            var friendJson = {
                messageId: newMesId,
                lastDate: fireTime,
                seen: 1
              },
              friendUpdate = {};

            friendUpdate['/' + mesUserId + '/' + instantMesPath] = friendJson;
            friendUpdate['/' + instantMesPath + '/' + mesUserId] = friendJson;
            mesRef.update(friendUpdate).then(function (err) {
              if (!err) {
                currentMesId = newMesId;
                firebase.database().ref('Users/' + mesUserId + '/name').once('value', function (n) {
                  var notiJson = {
                    message: limitString(n.val(), 17) + ' started this chat',
                    type: 'notify',
                    date: fireTime
                  }
                  firebase.database().ref('chats/' + newMesId).push().set(notiJson).then(function (pErr) {
                    if (!pErr) {
                      chatJson.message = message;
                      chatJson.type = 'text';
                      firebase.database().ref('chats/' + newMesId).push().set(chatJson);
                      playMesSentAudio();
                    }
                  });
                })

              }
            });
          }


        });

      }
    }
  });

  const emojiPack = ['600', '603', '604', '601', '601', '606', '605', '923', '602', '642', '643', '609', '60A', '607', '970', '60D', '929', '618', '617', '263A', '61A', '619', '972', '60B', '61B', '61C', '92A', '61D', '911', '917', '92D', '92B', '914', '910', '928', '610', '611', '636', '60F', '612', '644', '62C', '925', '60C', '614', '62A', '924', '634', '637', '912', '915', '922', '92E', '927', '975', '976', '974', '635', '92F', '920', '973', '978', '60E', '913', '9D0', '615', '2639', '62E', '97A', '633', '630', '625', '622', '62D', '631', '62B', '971', '624', '621', '92C', '608', '2620'];;

  for (var i = 0; i < emojiPack.length; i++) {
    var a = emojiPack[i];
    if (a.length == 3) {
      a = '1F' + a;
    }
    $('.mes-emoji-con').append('<div>&#x' + a + ';</div>');
  }

  $('.mes-emoji-con div').click(function () {
    const reserveTxt = $('.mes-edittext-pc').text();
    $('.mes-edittext-pc').html($(this).html());
    $('.mes-edittext-pc').prepend(reserveTxt);

    if ($('.mes-edittext-pc').text().length > 0) {
      $('.mes-hint-toggler').css('display', 'none');
    } else {
      $('.mes-hint-toggler').css('display', 'block');
    }
  });

  var totalFileSent = 0;

  function sendFile(mesFile, fileTemp, fileLength, fileSendingIndex) {
    const fileMb = mesFile.size / 1024,
      fileName = mesFile.name.toLowerCase(),
      instantCurrentMesPath = currentMesPath;
    if ((fileMb / 1024) > 500) {
      --totalFileSent;
      alert('Unable to send "' + limitString(fileName, 20) + '" because it exceeded 500mb');
    } else {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          mesUserId = user.uid;
          var chatJson = {
            type: fileName,
            sender: mesUserId,
            date: fireTime
          }
          if (currentReplyId != '') {
            chatJson.replyTo = currentReplyId;
          }

          if (currentMesPath.startsWith('groupFlag')) {

            firebase.database().ref('groupChat/' + instantCurrentMesPath).once('value', function (pd) {
              if (!pd.child('private').exists() || pd.child('participants/' + mesUserId).exists()) {
                if (!pd.child('isSilent').exists()) {
                  sendMesFileToStorageAndDatabase(fileName, fileMb, mesFile, fileTemp, instantCurrentMesPath, instantCurrentMesPath, true, fileLength, fileSendingIndex);
                } else {
                  --totalFileSent;
                  alert('This group has been silence by the admin');
                }
              } else {
                --totalFileSent;
                alert('You are not allowed to message to this group');
              }
            });

          } else {

            var mesRef = mesFireRef.child('message');
            mesRef.child(mesUserId + '/' + instantCurrentMesPath).once('value', function (friendShot) {

              var fId = friendShot.child('messageId').val();
              if (fId != null) {
                if (!friendShot.child('isSilent').exists()) {
                  sendMesFileToStorageAndDatabase(fileName, fileMb, mesFile, fileTemp, instantCurrentMesPath, fId, false, fileLength, fileSendingIndex);
                } else {
                  --totalFileSent;
                  alert("Message can't be sent because this chat has been silence");
                }
              } else {
                var newMesId = mesUserId + instantCurrentMesPath;
                var friendJson = {
                    messageId: newMesId,
                    lastDate: fireTime,
                    seen: 1
                  },
                  friendUpdate = {};

                friendUpdate['/' + mesUserId + '/' + instantCurrentMesPath] = friendJson;
                friendUpdate['/' + instantCurrentMesPath + '/' + mesUserId] = friendJson;
                mesRef.update(friendUpdate).then(function (err) {
                  if (!err) {
                    currentMesId = newMesId;
                    firebase.database().ref('Users/' + mesUserId + '/name').once('value', function (n) {
                      var notiJson = {
                        message: limitString(n.val(), 17) + ' started this chat',
                        type: 'notify',
                        date: fireTime
                      }
                      firebase.database().ref('chats/' + newMesId).push().set(notiJson).then(function (pErr) {
                        if (!pErr) {
                          sendMesFileToStorageAndDatabase(fileName, fileMb, mesFile, fileTemp, instantCurrentMesPath, newMesId, false, fileLength, fileSendingIndex);
                        } else {
                          --totalFileSent;
                        }
                      });
                    })
                  } else {
                    --totalFileSent;
                  }
                });
              }


            });

          }


        } else {
          --totalFileSent;
          alert('Failed to send "' + limitString(fileName, 20) + '" because no user is found');
        }

      });
    }
  }

  function sendMesFileToStorageAndDatabase(fileName, fileMb, mesFile, fileTemp, instantCurrentMesPath, instantMesId, isInstantGroup, fileLength, fileSendingIndex) {
    console.log('sed file started');
    const meskey = firebase.database().ref('chats/' + instantMesId).push().key,
      storageKey = meskey + '.' + getFileExtension(fileName),
      storageRef = firebase.storage().ref('chats/' + instantMesId + '/' + storageKey),
      uploadTask = storageRef.put(mesFile),
      tempHtml = '<div class="my-chat" style="width: 170px;" id="jy8yh6g5senddile' + meskey + '"><div class="pc-mes-type-temp" style="height: 170px;"><img src="img/' + fileTemp + '" alt="" class="pc-mes-type-temp-img">' +
      '<div class="pc-mes-type-temp-cont" style="display: block;"><div><span></span><img src="img/progressDots.gif" class="pc-mes-type-dot"></div></div><div class="retry-send-mes-file-pc">' +
      '<span>Transfer Failed</span></div><div class="pc-mes-file-temp-info"><div>' + limitString(fileName, 35) + '</div><button>Download</button></div></div><small>9/12/20</small></div>',
      mesList = $('.mes-list-pc-cont');
    console.log('mes sever  ==  ' + meskey);
    console.log('file sending html  =  ' + tempHtml);
    if (currentMesPath == instantCurrentMesPath) {
      mesList.append(tempHtml);
    }

    ++addedFileCount;
    const contId = '#jy8yh6g5senddile' + meskey;

    var cPro = new CircleProgress(contId + ' .pc-mes-type-temp-cont div span', {
      max: 100,
      value: 7,
      textFormat: 'percent'
    });

    $('.mes-list-pc-cont').scrollTop($('.mes-list-pc-cont').prop('scrollHeight') + 300);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (s) {
      var progress = (s.bytesTransferred / s.totalBytes) * 100;
      if (progress >= 90) {
        cPro.value = 90;
      }
      $(contId + ' small').text('Sending ' + ((s.bytesTransferred) / (1024 * 1024)) + 'MB Of ' + ((s.totalBytes) / (1024 * 1024)) + 'MB');
    }, function (error) {
      --totalFileSent;
      $(contId + ' .retry-send-mes-file-pc').css('display', 'block');
      $(contId + ' .retry-send-mes-file-pc span').text('Transfer Failed');
      console.log('send img to server failed');
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {
        console.log('file upload successful' + downloadURl);
        const fileJson = {
          sender: mesUserId,
          message: downloadURl,
          type: fileName,
          size: fileMb,
          storage: storageKey,
          date: fireTime
        }
        const rc = $(contId + ' .retry-send-mes-file-pc'),
          rs = $(contId + ' .retry-send-mes-file-pc span');
        console.log('current sendFile index  ' + fileSendingIndex);
        rs.click(function () {
          console.log('triggered click send file database');
          rc.css('display', 'none');

          if (isInstantGroup) {
            firebase.database().ref('chats/' + instantMesId).push().set(fileJson).then(function (err) {
              firebase.database().ref('groupChat/' + instantCurrentMesPath).once('value', function (pd) {
                --totalFileSent;
                if (!err) {
                  pd.child('participants').forEach(function (d) {
                    const ugk = d.key;
                    firebase.database().ref('message/' + ugk + '/' + instantCurrentMesPath + '/lastDate').set(fireTime);
                    if (ugk != mesUserId) {
                      firebase.database().ref('message/' + ugk + '/' + instantCurrentMesPath + '/seen').transaction(function (plusCount) {
                        return (plusCount || 0) + 1;
                      });
                    }
                  });
                  rc.css('display', 'block');
                  rs.text('SuccessFul');
                  rs.off('click');
                  if (totalFileSent == 0) {
                    playMesSentAudio();
                    accessMessageDialog(instantCurrentMesPath);
                  }
                } else {
                  rc.css('display', 'block');
                  rs.text('Retry');
                }
              });

            });
          } else {
            firebase.database().ref('chats/' + instantMesId).push().set(fileJson).then(function (err) {
              --totalFileSent;
              if (!err) {
                var cu = {};
                cu['/' + mesUserId + '/' + instantCurrentMesPath + '/lastDate'] = fireTime;
                cu['/' + instantCurrentMesPath + '/' + mesUserId + '/lastDate'] = fireTime;
                firebase.database().ref('message').update(cu);
                firebase.database().ref('message/' + instantCurrentMesPath + '/' + mesUserId + '/seen').transaction(function (plusCount) {
                  return (plusCount || 0) + 1;
                });
                rc.css('display', 'block');
                rs.text('SuccessFul');
                rs.off('click');
                if (totalFileSent == 0) {
                  playMesSentAudio();
                  accessMessageDialog(instantCurrentMesPath);
                }
              } else {
                rc.css('display', 'block');
                rs.text('Retry');
              }
            });
          }

        });
        rs.trigger('click');
      });
    });
  }

  //for sending messages
  $('#input-file-mes-pc').change(function (e) {
    const fileLength = e.target.files.length;
    if (fileLength == 0) {
      return;
    }
    chatQueryRef.off('value');
    alert("To ensure a successful upload, avoid opening or closing of the chat dialog");
    console.log('file legth d  ' + fileLength);
    totalFileSent += fileLength;

    if (hasGottenProgressScript) {
      proceed();
    } else {
      var progressScript = document.createElement('script');
      progressScript.src = 'js/circleProgress.js';
      progressScript.onload = function () {
        hasGottenProgressScript = true;
        proceed();
      }
      document.head.appendChild(progressScript);
    }

    function proceed() {
      for (var i = 0; i < fileLength; i++) {
        const d = i,
          file = e.target.files[d];
        if (file) {
          switch (getFileExtension(file.name).toLowerCase()) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'svg':
              new Compressor(file, {
                quality: 0.3,
                convertSize: 30000,
                success(result) {
                  sendFile(result, 'music-file.svg', fileLength, d);
                },
                error(err) {
                  sendFile(file, 'music-file.svg', fileLength, d);
                }
              });
              break;
            default:
              sendFile(file, 'zip.svg', fileLength, d);
          }
        } else {
          --totalFileSent;
        }
      }
    }

  });

  function navToggle(visi, slideLength, flag) {
    var con, cont;
    if (flag == 'nav') {
      con = '.nav-con';
      cont = '.nav-cont';
      $(cont).css("margin-left", slideLength);
    } else {
      con = notiCon;
      cont = '.noti-container';
      $(cont).css("margin-right", slideLength);
    }
    $(con).css("visibility", visi);

  }

  //mes-pc-opt-con
  var mpl = '.mes-list-pc-cont',
    mpdi = 'input[name="mes-pc-del-input-name"]';
  $(".mes-pc-opt-con").click(function () {
    $(this).css('display', 'none');
  });
  $("#mes-pc-del-div").click(function () {
    $('.mes-pc-del-con').css('display', 'flex');
    $(mpl + ' input').css('display', 'block');
  });
  $('.mes-pc-del-con span').click(function () {
    $('.mes-pc-del-con').css('display', 'none');
    $(mpl + ' input').css('display', 'none');
  });
  $(mpdi).change(function () {
    $('.mes-pc-del-con div').text('delete (' + $(mpdi + ':checked').length + ')');
  });
  $('.mes-pc-del-con div').click(function () {
    if ($(mpdi + ':checked').length > 0) {
      if (confirm('Do you want to delete selected messages'))
        $('.mes-pc-del-con').css('display', 'none');
      $(mpl + ' input').css('display', 'none');
      /*var mesPcDelArr = $(mpdi + ':checked').map(function () {
        return $(this).val();
      }).get();*/
      for (var i = 0; i < $(mpdi + ':checked').length; i++) {
        firebase.database().ref("chats/" + $(mpdi + ':checked').eq(i).val().split(' ')[0] + "/" + $(mpdi + ':checked').eq(i).val().split(' ')[1]).remove();
      }
    } else {
      toast('No message selected', '');
    }
  });
  $('#close-pc-mes-alert').click(function () {
    $('.pc-chat-alert-con').fadeOut(700);
  });

  var hasGottenNavData = false;
  $("#hamb").click(function () {
    navToggle("visible", "calc( 100vw - 80% )", 'nav');

    if (!hasGottenNavData && $('#vendor-phone-nav-info-flag').html() != 'flag43w4fc') {
      hasGottenNavData = true;
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          firebase.database().ref('Users/' + user.uid).once('value', function (s) {
            var proImg = s.child('image').val(),
              name = s.child('name').val(),
              phone = s.child('phone').val();

            $('.profile-nav').attr('src', formateUserImg(proImg));
            $('.nav-temp div b').text(name);
            $('.nav-temp div small').text(phone);
            $('.nav-temp span i').text(changeNullToZero(s.child('followers').val()) + ' followers');
          });
        } else {
          $('.nav-temp span i').text('Sign in');
          $('.profile-nav').attr('src', 'img/user.png');
        }
      });
    }

  });

  $(".nav-con").click(function () {
    navToggle("hidden", "-80%", 'nav');
  });

  $(".chat-close-pc").click(function () {
    mesPcCon.css("display", "none");
    invalidateMesContainer();
  });
  $('.mes-video-chat-btn').click(function () {
    alert('This feature is under development, coming soon...');
  });
  $(".mes-pc-opt").click(function () {
    var v = $('.mes-pc-opt-con');
    if (v.css('display') == 'none') {
      v.show(500);
    } else {
      v.hide(500);
    }
  });

  $('.mes-pc-opt-con div').eq(3).click(function () {
    $('.mes-del-copy-clear').show();
    $('.my-chat, .other-chat').css('backgroundColor', 'grey');
    $('.mes-pc-long-click-opt').css('display', 'flex');
  });
  $('.mes-pc-opt-con div').eq(4).click(function () {
    $('.mes-pc-opt-con').eq(3).trigger('click');
  });

  $('.mes-del-copy-clear').click(function () {
    $(this).hide();
    $('.my-chat').css('backgroundColor', themeColorLight);
    $('.other-chat').css('backgroundColor', 'white');
    $('.mes-pc-long-click-opt').css('display', 'none');
  });

  /*notification container*/

  function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  var isCreatingGroup = false;

  function createGroupPcInitialize() {
    var groupImg = '',
      groupStatus = 'public',
      retryAttempt = 0;

    $('#pc-create-group-input-img').change(function (e) {
      var profileImg = e.target.files[0],
        realImgReader = new FileReader();
      realImgReader.readAsDataURL(profileImg);
      realImgReader.onload = function (r) {
        $('.cpcgs-img-con-ff').attr('src', r.target.result);
      };
      groupImg = profileImg;
      if (!profileImg) {
        return;
      }
      new Compressor(profileImg, {
        quality: 0.3,
        convertSize: 30000,
        success(result) {
          groupImg = result;
        }
      });
    });
    var contId = '.chat-pc-create-group-section-cont',
      sm = '.chat-pc-create-group-section small',
      cgBtn = $('#pc-create-new-group-btn');

    $(contId + ' div img').click(function () {
      if (groupStatus == 'public') {
        groupStatus = 'private';
        $(this).attr('src', 'img/switch-on.svg');
        $(contId + ' div span').text('Group will be private');
      } else {
        groupStatus = 'public';
        $(this).attr('src', 'img/switch-off.svg');
        $(contId + ' div span').text('Group will be public');
      }
    });

    cgBtn.click(function () {
      if (!isCreatingGroup) {
        isCreatingGroup = true;
        cgBtn.css('backgroundColor', 'grey');
        var gName = $(contId + ' input').val().trim(),
          gDes = $(contId + ' textarea').val().trim();
        if (gName.length == 0) {
          isCreatingGroup = false;
          cgBtn.css('backgroundColor', themeColorLight);
          alert('Group must have a name');
        } else {
          $(sm).html('Please wait...');
          var groupKey = 'groupFlag' + firebase.database().ref('groupChat').push().key + getRandomString(7);
          firebase.database().ref('groupChat/' + groupKey).once('value', function (gShot) {
            if (gShot.exists()) {
              ++retryAttempt;
              if (retryAttempt < 7) {
                isCreatingGroup = false;
                $('#pc-create-new-group-btn').trigger('click');
              } else {
                alert('Group id lookup limit reach, try refreshing the page');
              }
            } else {
              if (groupImg == '') {
                uploadNewGroup(downloadURl, gName, gDes, groupStatus, groupKey);
              } else {
                const storageRef = firebase.storage().ref('chats/' + groupKey + '/groupImg.png'),
                  uploadTask = storageRef.put(groupImg);

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (s) {
                  var progress = (s.bytesTransferred / s.totalBytes) * 100;
                  $(sm).html(progress);
                }, function () {
                  uploadNewGroup('', gName, gDes, groupStatus, groupKey);
                }, function () {
                  $(sm).html('Processing...');
                  uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {
                    uploadNewGroup(downloadURl, gName, gDes, groupStatus, groupKey);
                  });
                });
              }
            }
          });
        }
      }
    });
  }
  createGroupPcInitialize();

  function uploadNewGroup(img, name, des, private, groupKey) {
    var groupJson = {},
      time = firebase.database.ServerValue.TIMESTAMP,
      contId = '.chat-pc-create-group-section-cont',
      sm = '.chat-pc-create-group-section small';

    groupJson['/name'] = name;
    groupJson['/admin/' + mesUserId] = time;
    groupJson['/createdOn'] = time;
    groupJson['/createdBy'] = mesUserId;
    groupJson['/participants/' + mesUserId] = time;
    if (des.length != 0) {
      groupJson['/des'] = des;
    }
    if (img != '') {
      groupJson['/image'] = img;
    }
    if (private == 'private') {
      groupJson['/private'] = true;
    }

    firebase.database().ref('groupChat/' + groupKey).update(groupJson).then(function () {
      firebase.database().ref('message/' + mesUserId + '/' + groupKey + '/lastDate').set(time).then(function () {
        alert('Group Created Successfully');
        $('.chat-pc-create-group-section').hide();
        isCreatingGroup = false;
        $(contId + ' input, ' + contId + ' textarea').val('');
        $(sm).html('');
        $('#pc-create-new-group-btn').css('backgroundColor', themeColorLight);
        firebase.database().ref('Users/' + mesUserId + '/name').once('value', function (m) {
          firebase.database().ref('chats/' + groupKey).push().set({
            type: 'notify',
            message: m.val() + ' Created this group',
            date: time
          });
        });
        accessMessageDialog(groupKey);
      });

    });
  }
  const copt = '.chat-pc-opt',
    cgs = '.chat-pc-create-group-section';

  $('#chat-more-opt-pc').click(function () {
    $('.chat-pc-opt').toggle(700);
  });
  $(copt).click(function () {
    $(this).css('display', 'none');
  });
  stackToggle($('.add-client-pc-show'), '.chat-search-pc-section', cgs + ', .pc-chat-settings-section', '40');

  stackToggle($(copt + ' div').eq(1), cgs, '.chat-search-pc-section, .pc-chat-settings-section', '40');

  stackToggle($(copt + ' div').eq(3), '.pc-chat-settings-section', '.chat-search-pc-section, ' + cgs, '40');
  $('#pc-create-group-back-btn').click(function () {
    $(cgs).fadeOut(700);
  });

  $('.chat-search-client-pc-div img').click(function () {
    $('.chat-search-pc-section').fadeOut(700);
  });
  $('.pc-chat-settings-section-back').click(function () {
    $('.pc-chat-settings-section').fadeOut(700);
  });

  function hoverFlashImg(hoverImgRef, imgSrc, imgFlashParser) {
    $(hoverImgRef).on({
      mouseenter: function () {
        $(imgFlashParser).css('display', 'block');
        $(imgFlashParser).attr('src', imgSrc);
      },
      mouseleave: function () {
        $(imgFlashParser).css('display', 'none');
      }
    });
  }

  function stack999(input) {
    if (input >= 1000)
      return '999+';
    else
      return input;
  }

  function stack99(input) {
    if (input >= 1000)
      return '99+';
    else
      return input;
  }

  function invalidateMesContainer() {
    $('.mes-list-pc-cont').html('');
    $('.chat-bottom').css('display', 'block');
    $('.mes-del-copy-clear').trigger('click');

    mesSilentRef.off('value');
    groupAllRef.off('value');
    mesTypingRef.off('value');
    mesIdRef.off('value');
    chatQueryRef.off('value');
    groupPrivateRef.off('value');
    groupRequestRef.off('value');
    groupParRef.off('value');
    currentReplyId = '';
    $('.reply-mes-pc-con').css('display', 'none');
    $('.mes-emoji-con').css('display', 'none');

    var mesConOpt = $('.mes-pc-opt-con div');
    for (var i = 0; i < mesConOpt.length; i++) {
      if (i != 2 && i != 3) {
        mesConOpt.eq(i).off('click');
      }
    }
    //group info
    $('.mes-pc-group-info-con').hide();
    $('.mes-pc-group-info-temp-img').attr('src', 'img/progressDots.gif');
    $('.mes-pc-group-info-temp span div, .mes-pc-group-info-temp small, .group-info-pc-des div, .group-info-pc-creator').html('Loading<img src="img/progressDots.gif" alt="">');
    $('.group-info-user-con, #group-link-info-mes-pc a').html('Please wait...');
    //group invite
    $('.mes-group-invite-section-pc').hide();
    $('.chat-bottom').show();
  }

  var adminGroupModifyPath = '';
  const amc = '#mes-group-change-settings';
  $(amc + ' label').click(function () {
    adminGroupModifyPath = currentMesPath;
  });
  $('#admin-group-change-img-input').change(function (e) {
    var gPath = adminGroupModifyPath;
    var profileImg = e.target.files[0];
    if (!profileImg) {
      return;
    }
    new Compressor(profileImg, {
      quality: 0.3,
      convertSize: 30000,
      success(result) {
        const storageRef = firebase.storage().ref('chats/' + gPath + '/groupImg.png'),
          uploadTask = storageRef.put(result);
        $(amc + ' label span').html('Uploading, Please wait..');
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function () {}, function () {
          alert('An Error Occurred');
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {
            firebase.database().ref('groupChat/' + gPath + '/image').set(downloadURl).then(function (err) {
              $(amc + ' label span').html('Edit Group Profile Image');
              if (err) {
                alert('An Error Occurred');
              } else {
                alert('Group Image Change Successfuly');
              }
            });
          });
        });
      }
    });
  });

  function reverseGN() {
    $(amc + ' div edname').attr('contenteditable', false);
    $(amc + ' div edname').text('Edit Group Name');
    $(amc + ' div button').hide();
    $(amc + ' div button').attr('disabled', false);
    $(amc + ' div img').show();
  }

  $(amc + ' div').click(function () {
    var gPath = currentMesPath;
    $(amc + ' div edname').attr('contenteditable', true);
    $(amc + ' div edname').focus();
    $(amc + ' div button').show();
    $(amc + ' div img').hide();

    $(amc + ' div button').off('click');
    $(amc + ' div button').click(function (e) {
      e.stopPropagation();
      $(this).attr('disabled', true);
      const txt = $(amc + ' div edname').text().trim();
      if (txt.length != 0) {
        firebase.database().ref('groupChat/' + gPath + '/name').set(txt).then(function (err) {
          reverseGN();
          if (err) {
            alert('An Error Occurred');
          } else {
            alert('Group Name Change Successfuly');
          }
        });
      } else {
        $(this).attr('disabled', false);
        toast("Name can't be empty");
      }
    });
  });

  function stampGroupInfo(groupId, checkParticipants) {
    reverseGN();
    if (isWindowPhone) {
      $('.chat-bottom').hide();
    }
    groupAllRef.off('value');
    groupPrivateRef.off('value');
    groupRequestRef.off('value');
    groupParRef.off('value');
    groupPrivateRef = firebase.database().ref('groupChat/' + groupId + '/private');
    groupRequestRef = firebase.database().ref('groupChat/' + groupId + '/request');
    groupParRef = firebase.database().ref('groupChat/' + groupId + '/participants');

    const b = '.mes-pc-group-info-con';
    $(b).fadeIn(700);
    $(b).css('zIndex', '50');

    var gTemp = '.mes-pc-group-info-temp';
    mesFireRef.child('groupChat/' + groupId).once('value', function (gp) {
      var creatorId = gp.child('createdBy').val(),
        gDes = gp.child('des').val(),
        isAdmin = false,
        gImg = formateUserImg(gp.child('image').val());

      $(gTemp + '-img').css('backgroundImage', 'url("' + gImg + '")');
      //hoverFlashImg(gTemp + '-img', gImg, '#img-full-mes-pc');

      $(gTemp + ' span div').text(gp.child('name').val());
      $(gTemp + ' small').text(new Date(gp.child('createdOn').val()).toLocaleString());
      mesFireRef.child('Users/' + creatorId + '/name').once('value', function (c) {
        $('.group-info-pc-creator').html('Created By: <a href="profile.html?id=' + creatorId + '" >' + c.val() + '</a>');
      });
      if (gDes == null) {
        $('.group-info-pc-des div').text('No Description');
      } else {
        $('.group-info-pc-des div').text(gDes);
      }
      if (gp.child('admin/' + mesUserId).exists()) {
        isAdmin = true;
      }
      $('#mes-group-admin-list').html('<b>Group Admin</b>');
      var adminNum = gp.child('admin').numChildren();
      gp.child('admin').forEach(function (adminShot) {
        var adminKey = adminShot.key;
        mesFireRef.child('Users/' + adminKey).once('value', function (au) {
          var adminName = au.child('name').val(),
            adminImg = formateUserImg(au.child('image').val()),
            adminHtml = '<div class="group-info-user-cont" id="group-info-admin-cont-hwstw843c8c4' + adminKey + '"><img src="' + adminImg + '" alt="admin image" ><div>';
          if (isAdmin && adminNum != 1) {
            adminHtml += '<block>Remove</block>';
          }
          adminHtml += '<name>' + limitString(adminName, 23) + '</name><i>Join on: ' + new Date(adminShot.val()).toLocaleString() + '</i><small>Group Admin</small></div></div>';
          $('#mes-group-admin-list').append(adminHtml);
          var adminContId = '#group-info-admin-cont-hwstw843c8c4' + adminKey;

          $(adminContId + ' div block').click(function () {
            if (confirm('Do you want to remove ' + adminName + ' as from the group admin')) {
              firebase.database().ref('groupChat/' + groupId + '/admin/' + adminKey).remove();
            }
          });
          hoverFlashImg(adminContId + ' img', adminImg, '#img-full-mes-pc');
          $(adminContId + ' img').click(function (e) {
            e.stopPropagation();
            showFullScreenImage($(this).attr('src'));
          });
        });
      });
      var gsv = '#group-visibility-mes-pc-setting';
      if (isAdmin) {
        $(amc).css('display', 'block');
        $(gsv).css('display', 'block');
        groupPrivateRef.on('value', function (ps) {
          if (ps.val() == null) { //this is public group
            $(gsv + ' span').text('Public');
            $(gsv + ' small').text('Anybody Can access this group via link or any other means');
            $(gsv + ' img').attr('src', 'img/switch-off.svg');
            $(gsv + ' div img').off('click');
            $(gsv + ' div img').click(function () {
              firebase.database().ref('groupChat/' + groupId + '/private').set(true);
            });
          } else {
            $(gsv + ' span').text('Private');
            $(gsv + ' small').html("People can join this group by admin invitation or group request <uder>Don't Understand</uder>");
            $(gsv + ' img').attr('src', 'img/switch-on.svg');
            $(gsv + ' div img').off('click');
            $(gsv + ' div img').click(function () {
              firebase.database().ref('groupChat/' + groupId + '/private').remove();
            });
          }
        });
      } else {
        $(amc).css('display', 'none');
        $(gsv).css('display', 'none');
      }
      var gLink = location.origin + '?groupId=' + groupId;
      $('#group-link-info-mes-pc').html('<b>Group Link</b><a href="index.html?groupId=' + groupId + '">' + gLink + '</a>');

      groupRequestRef.on('value', function (reqShot) {
        var reqCon = $('#mes-group-request-list-pc');
        if (reqShot.exists()) {
          reqCon.html('<b>Group Request</b>');
          reqShot.forEach(function (reqSnap) {
            var reqKey = reqSnap.key;
            mesFireRef.child('Users/' + reqKey).once('value', function (au) {
              var parName = au.child('name').val(),
                parImg = formateUserImg(au.child('image').val()),
                reqHtml = '<div class="group-info-user-cont" id="group-request-cont-ud804k20seu753' + reqKey + '" ><img src="' + parImg + '" alt="participant image" ><div>' +
                '<name>' + limitString(parName, 23) + '</name><i>Join on: ' + new Date(reqSnap.val()).toLocaleString() + '</i><reqc><reqff>Accept</reqff><reqll>Decline</reqll></reqc></div></div>';
              reqCon.append(reqHtml);

              var partiContId = '#group-request-cont-ud804k20seu753' + reqKey,
                isProcessingRequest = false;
              $(partiContId + ' div reqc reqll').off('click');
              $(partiContId + ' div reqc reqll').click(function () {
                if (confirm('Are You Sure You Want To Decline ' + limitString(parName, 25) + ' Request')) {
                  firebase.database().ref('groupChat/' + groupId + '/request/' + reqKey).remove();
                }
              });
              $(partiContId + ' div reqc reqff').off('click');
              $(partiContId + ' div reqc reqff').click(function () {
                if (!isProcessingRequest) {
                  $(this).html('Processing...');
                  $(this).css('backgroundColor', 'grey');
                  isProcessingRequest = true;
                  var t = {},
                    fireTime = firebase.database.ServerValue.TIMESTAMP;
                  t['groupChat/' + groupId + '/participants/' + reqKey] = fireTime;
                  t['message/' + reqKey + '/' + groupId + '/lastDate'] = fireTime;

                  firebase.database().ref('/').update(t).then(function (err) {
                    if (!err) {
                      firebase.database().ref('groupChat/' + groupId + '/request/' + reqKey).remove();
                      firebase.database().ref('Users/' + reqKey + '/name').once('value', function (n) {
                        var chatJson = {
                          message: limitString(n.val(), 23) + ' was added to the group',
                          type: 'notify',
                          date: fireTime
                        };
                        firebase.database().ref('chats/' + groupId).push().set(chatJson);
                      })
                    } else {
                      isProcessingRequest = false;
                      $(this).html('Accept');
                      $(this).css('backgroundColor', themeColorLight);
                    }
                  });
                }
              });
              hoverFlashImg(partiContId + ' img', parImg, '#img-full-mes-pc');
              $(partiContId + ' img').click(function (e) {
                e.stopPropagation();
                showFullScreenImage($(this).attr('src'));
              });
            });
          });
        } else {
          reqCon.html('');
        }
      });


      var groupParticipantTimeout = null;

      groupParRef.on('value', function (ps) {
        $('#mes-group-participant-list').html('<b>Participants</b>');
        clearTimeout(groupParticipantTimeout);

        groupParticipantTimeout = setTimeout(() => {
          ps.forEach(function (parShot) {
            var participantsKey = parShot.key;
            mesFireRef.child('Users/' + participantsKey).once('value', function (au) {
              var parName = au.child('name').val(),
                parImg = formateUserImg(au.child('image').val()),
                participantsHtml = '<div class="group-info-user-cont" id="group-participant-cont-sd6w3f43rae' + participantsKey + '" ><img src="' + parImg + '" alt="participant image" ><div>';
              if (isAdmin && participantsKey != mesUserId) {
                participantsHtml += '<block>Remove</block>';
              }
              participantsHtml += '<name>' + limitString(parName, 23) + '</name><i>Join on: ' + new Date(parShot.val()).toLocaleString() + '</i>';
              if (participantsKey != mesUserId) {
                participantsHtml += '<span>Private Chat</span>';;
              }
              participantsHtml += '</div></div>';
              $('#mes-group-participant-list').append(participantsHtml);

              var partiContId = '#group-participant-cont-sd6w3f43rae' + participantsKey;

              $(partiContId + ' div block').off('click');
              $(partiContId + ' div block').click(function () {
                if (confirm('Are You Sure You Want To Remove ' + limitString(parName, 23) + ' From This Group')) {
                  var t = {};
                  t['groupChat/' + groupId + '/participants/' + participantsKey] = null;
                  t['message/' + participantsKey + '/' + groupId + '/lastDate'] = null;
                  firebase.database().ref().update(t).then(function (err) {
                    if (!err) {
                      firebase.database().ref('Users/' + participantsKey + '/name').once('value', function (n) {
                        var chatJson = {
                          message: limitString(n.val(), 20) + ' was removed from the group',
                          type: 'notify',
                          date: firebase.database.ServerValue.TIMESTAMP
                        };
                        firebase.database().ref('chats/' + groupId).push().set(chatJson);
                      })
                    } else {
                      isProcessingRequest = false;
                      $(this).html('Accept');
                      $(this).css('backgroundColor', themeColorLight);
                    }
                  });
                }
              });
              $(partiContId + ' div span').off('click');
              $(partiContId + ' div span').click(function () {
                accessMessageDialog(participantsKey);
              });
              hoverFlashImg(partiContId + ' img', parImg, '#img-full-mes-pc');

              $(partiContId + ' img').off('click');
              $(partiContId + ' img').click(function (e) {
                e.stopPropagation();
                showFullScreenImage($(this).attr('src'));
              });

              if (checkParticipants == 'yes') {
                $('.mes-pc-group-info-con').scrollTop($('.mes-pc-group-info-con').prop('scrollHeight') + 100);
              }
            });
          });
        }, 500);
      });


    });

  }

  function pageGroupInvite(inviteKey, uImg, uName, phone, gisearchcon, inviteBtn) {
    const phoneHtml = '<div class="group-invite-section-cont-pc" id="groupInviteCheckers43xdr6juQ' + inviteKey + '"><img src="' + uImg + '" alt="user img"><div>' +
      '<span>' + uName + '</span><i>' + phone + '</i></div><input type="checkbox" name="group-invite-checkbox-pc" value="' + inviteKey + '"></div>';
    gisearchcon.append(phoneHtml);

    const inviteContId = '#groupInviteCheckers43xdr6juQ' + inviteKey;

    hoverFlashImg(inviteContId + ' img', uImg, '#img-full-mes-pc');
    $(inviteContId + ' img').click(function (e) {
      e.stopPropagation();
      showFullScreenImage($(this).attr('src'));
    });
    firebase.database().ref('groupChat/' + currentMesPath + '/participants/' + inviteKey).once('value', function (h) {
      if (!h.exists()) {

        $(inviteContId).off('click');
        $(inviteContId).click(function () {

          if ($(inviteContId + ' input').prop('checked')) {
            $(inviteContId + ' input').prop('checked', false);
            $(this).css('backgroundColor', 'white');
          } else {
            $(inviteContId + ' input').prop('checked', true);
            $(this).css('backgroundColor', 'rgb(177, 177, 177)');
          }

          var inviteCheck = $('input[name="group-invite-checkbox-pc"]:checked');

          if (inviteCheck.length == 1) {
            inviteBtn.css('display', 'block');
            inviteBtn.html('Add user(1)');
          } else if (inviteCheck.length > 1) {
            inviteBtn.html('Add users' + inviteCheck.length + ')');
          } else {
            inviteBtn.css('display', 'none');
          }
        });

      } else {
        $(inviteContId + ' div i').html('Already in the group');
        $(inviteContId + ' input').attr('disabled', true);
      }
    });
  }

  $('.chat-u-img-pc').click(function () {
    showFullScreenImage($(this).attr('src'));
  });

  function stampGroupInvite() {
    if (isWindowPhone) {
      $('.chat-bottom').hide();
    }
    var gic = $('.mes-group-invite-section-pc'),
      gInviteHeadCon = '.mes-search-pro-pc-div',
      gisearchcon = $('#group-invite-section-cont-pc-search-con'),
      giChatCon = $('#group-invite-my-chat-con'),
      inviteBtn = $('.group-invite-section-pc-button'),
      gISearchTxt = $('#group-invite-divider-pc-search-result'),
      gInviteChatTxt = $('#group-invite-divider-pc-chat'),
      gihb = $(gInviteHeadCon + ' img');

    gic.css('zIndex', '30');
    gic.fadeIn(700);
    gihb.off('click');
    gihb.click(function () {
      if (isWindowPhone) {
        if ($('.mes-pc-group-info-con').css('display') != 'block') {
          $('.chat-bottom').show();
        }
      }
      gic.fadeOut(700);
      setTimeout(() => {
        gic.css('zIndex', '0');
      }, 800);
    });

    inviteBtn.off('click');
    inviteBtn.click(function () {
      var inviteConfirm = false,
        inviteCheck = $('input[name="group-invite-checkbox-pc"]:checked');

      if (inviteCheck.length == 1) {
        inviteConfirm = confirm('Do you want to add this person to this group');
      } else if (inviteCheck.length > 1) {
        inviteConfirm = confirm('Do you want to add ' + inviteCheck.length + ' people to this group');
      }

      if (inviteConfirm) {
        firebase.database().ref('groupChat/' + currentMesPath + '/admin/' + mesUserId).once('value', function (adminShot) {
          if (adminShot.exists()) {
            var participantObj = {};
            inviteCheck.map(function () {
              participantObj['groupChat/' + currentMesPath + '/participants/' + $(this).val()] = fireTime;
              participantObj['message/' + $(this).val() + '/' + currentMesPath + '/lastDate'] = fireTime;
            }).get();

            firebase.database().ref().update(participantObj).then(function () {
              alert('Users Added Successfully');
              gic.css('zIndex', '0');
              gic.hide();
            }).catch(function (err) {
              alert(err.message);
            });
          } else {
            alert('Invitation Failed, Admin fatal Error');
          }
        });
      }
    });

    var gInviteSearchTimeOut = null,
      hasgInviteSearch = false;

    document.querySelector(gInviteHeadCon + ' input').oninput = function () {
      const search = $(gInviteHeadCon + ' input').val().trim();
      gisearchcon.html('');
      gISearchTxt.css('display', 'block');
      gISearchTxt.html('Searching<img src="img/progressDots.gif">');

      if (hasgInviteSearch) {
        clearTimeout(gInviteSearchTimeOut);
      }

      if (isNumber(search)) {
        if (search.length > 7 && search.length < 16) {
          hasgInviteSearch = true;

          gInviteSearchTimeOut = setTimeout(() => {
            firebase.database().ref('Users').orderByChild('phone').startAt(search).endAt(search + '\uf8ff').limitToLast(10).once('value', function (phoneShot) {
              const phoneShotNum = phoneShot.numChildren();
              gisearchcon.html('');

              if (phoneShotNum != 0) {
                gISearchTxt.html(phoneShotNum + ' Search Result Found');
                groupInviteSearchHtml = '';
                phoneShot.forEach(function (d) {
                  const inviteKey = d.key,
                    uImg = formateUserImg(d.child('image').val()),
                    uName = limitString(d.child('name').val(), 20),
                    phone = d.child('phone').val();
                  pageGroupInvite(inviteKey, uImg, uName, phone, gisearchcon, inviteBtn);
                });
              } else {
                gISearchTxt.html('No Search Result Found');
              }
            });
          }, 1300);
        } else {
          gISearchTxt.html('<div style="color: red;">Phone number must be at least 7 digits</div>');
        }
      } else {
        if (search.length != 0) {
          hasgInviteSearch = true;
          gInviteSearchTimeOut = setTimeout(() => {
            firebase.database().ref('Users').orderByChild('name').startAt(search.toLowerCase()).endAt(search.toLowerCase() + '\uf8ff').limitToLast(30).once('value', function (nameShot) {
              const phoneShotNum = nameShot.numChildren();
              gisearchcon.html('');

              if (phoneShotNum != 0) {
                gISearchTxt.html(phoneShotNum + ' Search Result Found');
                groupInviteSearchHtml = '';
                nameShot.forEach(function (d) {
                  const inviteKey = d.key,
                    uImg = d.child('image').val(),
                    uName = d.child('name').val(),
                    phone = d.child('phone').val();
                  pageGroupInvite(inviteKey, uImg, uName, phone, gisearchcon, inviteBtn);
                });
              } else {
                gISearchTxt.html('No Search Result Found');
              }
            });
          }, 1300);
        } else {
          gISearchTxt.html('<div style="color: red;">Search is empty</div>');
        }
      }
    };

    giChatCon.html('');
    gInviteChatTxt.css('display', 'block');
    gInviteChatTxt.html('Retrieving chat list<img src="img/progressDots.gif" >');
    firebase.database().ref('message/' + mesUserId).orderByChild('lastDate').once('value', function (chatShot) {
      var cUserNum = 0;
      chatShot.forEach(function (c) {
        var uKey = c.key;
        if (!uKey.startsWith('groupFlag')) {
          ++cUserNum;
          firebase.database().ref('Users/' + uKey).once('value', function (d) {
            var inviteKey = d.key,
              uImg = formateUserImg(d.child('image').val()),
              phone = d.child('phone').val(),
              uName = limitString(d.child('name').val(), 20);
            pageGroupInvite(inviteKey, uImg, uName, phone, giChatCon, inviteBtn);
          });
        }
      });

      if (cUserNum != 0) {
        gInviteChatTxt.html(cUserNum + ' users found in chat list');
      } else {
        gInviteChatTxt.css('display', 'none');
      }
    });
  }

  $('.mes-pc-group-info-temp-back').click(function () {
    const b = '.mes-pc-group-info-con';
    if (isWindowPhone) {
      if ($('.mes-group-invite-section-pc').css('display') != 'block') {
        $('.chat-bottom').show();
      }
    }
    $(b).fadeOut(700);
    $(b).css('zIndex', '0');
  });

  var mesIndexHtml = '',
    chatQueryTimeout = null;
  //accessMessageDialog(null, 'dUBBYCObilSq6FIr9mwV8FDD1f03');
  accessMessageDialog = function f(messagePath) {

    invalidateMesContainer();
    if (!isWindowPhone) {
      $('.noti-container-master').css('display', 'none');
    }
    mesIndexHtml = '';
    $('.mes-list-pc-cont').empty();
    $('.mes-list-pc-cont').off('scroll');
    var lastSeen = $('.chat-last-seen-pc'),
      mesOptPc = $('.mes-pc-opt-con div'),
      gInfoSec = $('.mes-pc-group-info-con'),
      uImg = $('.chat-u-img-pc');

    lastSeen.html('Loading...');
    $('.chat-u-name-pc').html('Please wait');
    uImg.attr('src', 'img/progressDots.gif');
    uImg.off('hover');
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.uid == messagePath) {
          $('.chat-close-pc').trigger('click');
          alert('You can\'t message yourself');
          return;
        }
        mesSilentRef = firebase.database().ref(mesUserId + '/' + messagePath + '/isSilent');
        groupAllRef = firebase.database().ref('groupChat/' + messagePath);
        mesTypingRef = firebase.database().ref('message/' + mesUserId + '/' + messagePath + '/isTyping');
        mesIdRef = firebase.database().ref('message/' + mesUserId + '/' + messagePath + '/messageId');

        $(".mes-container-pc").css('display', 'block');

        currentMesPath = messagePath;
        mesUserId = user.uid;

        if (!messagePath.startsWith('groupFlag')) {
          isGroupChat = false;
          mesFireRef.child('Users/' + messagePath).once('value', function (uSnap) {
            var img = formateUserImg(uSnap.child('image').val());
            uImg.attr('src', img);
            hoverFlashImg('.chat-u-img-pc', img, '#img-full-mes-pc');
            $('.chat-u-img-pc').click(function (e) {
              e.stopPropagation();
              showFullScreenImage($(this).attr('src'));
            });
            $('.chat-u-name-pc').text(uSnap.child('name').val());
          });

          //set last seen for one user
          mesOptPc.eq(0).css('display', 'none');
          mesOptPc.eq(1).css('display', 'block');
          mesOptPc.eq(4).css('display', 'none');
          mesOptPc.eq(5).css('display', 'none');
          mesOptPc.eq(7).css('display', 'none');
          mesOptPc.eq(1).off('click');
          mesOptPc.eq(1).click(function () {
            location.href = 'profile.html?id=' + messagePath;
          });

          var sRef = mesFireRef.child('message');
          mesSilentRef.on('value', function (silentShot) {
            var silence = silentShot.val();
            if (silentShot == null) {
              mesOptPc.eq(6).css('display', 'block');
              mesOptPc.eq(6).text('Silence Chat');
              mesOptPc.eq(6).off('click');
              mesOptPc.eq(6).click(function () {

                if (confirm('By Silencing, you are disabling sending and recieving of messages in this chat')) {
                  var ss = {};
                  ss['/' + mesUserId + '/' + messagePath + '/isSilent'] = mesUserId;
                  ss['/' + messagePath + '/' + mesUserId + '/isSilent'] = mesUserId;
                  sRef.update(ss);
                }
              });
            } else {
              if (silence == mesUserId) {
                mesOptPc.eq(6).css('display', 'block');
                mesOptPc.eq(6).text('UnSilence Chat');
                mesOptPc.eq(6).off('click');
                mesOptPc.eq(6).click(function () {

                  if (confirm('By unSilencing, you are enabling sending and recieving of messages in this chat')) {
                    var ss = {};
                    ss['/' + mesUserId + '/' + messagePath + '/isSilent'] = null;
                    ss['/' + messagePath + '/' + mesUserId + '/isSilent'] = null;
                    sRef.update(ss);
                  }
                });
              } else {
                mesOptPc.eq(6).css('display', 'none');
              }
            }
          });
          mesTypingRef.on('value', function (typingShot) {
            if (typingShot.exists()) {
              lastSeen.text("Typing...");
            } else {
              if (userStatusRef != null) {
                userStatusRef.off('value');
              }
              userStatusRef = firebase.database().ref('Users/' + messagePath + '/status');
              userStatusRef.on('value', function (status) {
                var s = status.val();
                if (s != null) {
                  if (s == 'online') {
                    lastSeen.text('Online');
                  } else {
                    lastSeen.text('Last seen ' + timeSince(s));
                  }
                } else {
                  lastSeen.text('Error!!!');
                }

              });
            }
          });
        } else {
          isGroupChat = true;
          mesOptPc.eq(1).css('display', 'none');
          mesOptPc.eq(4).css('display', 'block');
          mesOptPc.eq(5).css('display', 'block');
          mesOptPc.eq(7).css('display', 'block');
          var isFirstLoadGMes = true;

          groupAllRef.on('value', function (groupShot) {
            var gTyping = groupShot.child('isTyping').val();
            if (isFirstLoadGMes) {
              isFirstLoadGMes = false;
              var img = groupShot.child('image').val();
              $('.chat-u-name-pc').text(limitString(groupShot.child('name').val(), 27));
              if (img == null) {
                uImg.attr('src', 'img/user.png');
              } else {
                uImg.attr('src', img);
              }
              hoverFlashImg('.chat-u-img-pc', img, '#img-full-mes-pc');
              $('.chat-u-img-pc').click(function (e) {
                e.stopPropagation();
                showFullScreenImage($(this).attr('src'));
              });
            }

            mesOptPc.eq(7).off('click');
            if (groupShot.child('admin').numChildren() == 1 && groupShot.child('admin').hasChild(mesUserId)) {
              mesOptPc.eq(7).css('display', 'none');
            } else {
              mesOptPc.eq(7).click(function () {
                if (confirm('Existing this group will remove you from it')) {
                  var blockJson = {};
                  blockJson['groupChat/' + messagePath + '/participants/' + mesUserId] = null;
                  blockJson['message/' + mesUserId + '/' + messagePath] = null;
                  firebase.database().ref().update(blockJson).then(function (err) {
                    if (!err) {
                      mesPcCon.hide();
                    } else {
                      alert('An Unexpected Error Occurred!');
                    }
                  });
                }
              });
            }

            if (groupShot.child('admin/' + mesUserId).exists()) {
              mesOptPc.eq(6).css('display', 'block');
              if (groupShot.child('isSilent').exists()) {
                mesOptPc.eq(6).text('UnSilence Chat');
                mesOptPc.eq(6).off('click');
                mesOptPc.eq(6).click(function () {
                  var cs = confirm('By unSilencing, you are enabling sending and recieving of messages in this group');
                  if (cs) {
                    firebase.database().ref('groupChat/' + messagePath + '/isSilent').remove();
                  }
                });
              } else {
                mesOptPc.eq(6).text('Silence Chat');
                mesOptPc.eq(6).off('click');
                mesOptPc.eq(6).click(function () {

                  if (confirm('By Silencing, you are disabling sending and recieving of messages in this group')) {
                    firebase.database().ref('groupChat/' + messagePath + '/isSilent').set(mesUserId);
                  }
                });
              }
            } else {
              mesOptPc.eq(6).css('display', 'none');
            }

            if (gTyping != null && gTyping != mesUserId) {
              mesFireRef.child('Users/' + gTyping + '/name').once('value', function (n) {
                lastSeen.text(limitString(n.val(), 37) + ' is Typing...');
              });
            } else {
              lastSeen.text(groupShot.child('participants').numChildren() + ' Participants');
            }
          });
          //set number of perticipate
          mesOptPc.eq(4).click(function () {
            stampGroupInfo(messagePath);
            $('.mes-group-invite-section-pc').css('zIndex', '10');
          });
          mesOptPc.eq(5).click(function () {
            stampGroupInfo(messagePath, 'yes');
            $('.mes-group-invite-section-pc').css('zIndex', '10');
          });
          $('.mes-pc-opt-con div').eq(0).click(function () {
            $('.mes-pc-group-info-con').css('zIndex', '10');
            stampGroupInvite();
          });
        }
        mesIdRef.on('value', function (checkMesIdShot) {

          if (messagePath.startsWith('groupFlag')) {
            currentMesId = messagePath;
          } else {
            currentMesId = checkMesIdShot.val();
          }
          if (currentMesId != null) {
            const messageId = currentMesId;
            console.log('am tired mesId  =  ' + messageId);

            chatQueryRef = firebase.database().ref("chats/" + messageId).orderByChild('date');
            chatQueryRef.on('value', function (chatShot) {
              $('.mes-list-pc-cont').off('scroll');
              clearTimeout(chatQueryTimeout);

              chatQueryTimeout = setTimeout(() => {
                addedFileCount = 0;
                const messageCount = chatShot.numChildren();
                var isMesLoading = false,
                  isFirstPageMes = true;
                $('.mes-list-pc-cont').html('');

                console.log('total pc message count  == ' + messageCount);

                $('.mes-list-pc-cont').scroll(function () {
                  var mesLength = $('.mes-list-pc-cont').children().length - addedFileCount;


                  if (!isMesLoading && $(this).scrollTop() < 300 && mesLength != messageCount) {
                    console.log('loading new messages');
                    isMesLoading = true;
                    console.log('am tired mesId secRef =  ' + messageId);
                    mesFireRef.child("chats/" + messageId).orderByChild('date').limitToLast((mesLength + 15)).once('value', function (mesGre) {

                      mesIndexHtml = '';
                      var mesIndex = 0,
                        mesKeyArr = [],
                        senderArr = [],
                        replyToArr = [],
                        messagArr = [],
                        typeArr = [],
                        pusher = 0;

                      mesGre.forEach(function (i) {
                        if (mesIndex >= mesLength) {
                          var mesPack = i.val(),
                            type = mesPack.type,
                            date = mesPack.date,
                            messageKey = mesPack.message,
                            mesKey = i.key,
                            senderKey = mesPack.sender,
                            replyToKey = mesPack.replyTo;
                          console.log('type == ' + type + '  & date  = ' + date);

                          if (type != 'notify') {
                            typeArr[pusher] = type;
                            mesKeyArr[pusher] = mesKey;
                            senderArr[pusher] = senderKey;
                            replyToArr[pusher] = replyToKey;
                            messagArr[pusher] = messageKey;
                            ++pusher;
                          }

                          pageMesChats(messageId, mesKey, senderKey, messageKey, replyToKey, type, date);
                        }
                        ++mesIndex;
                      });
                      if (mesLength == 0) {
                        $('.mes-list-pc-cont').html(mesIndexHtml);
                      } else {
                        $('.mes-list-pc-cont').prepend(mesIndexHtml);
                      }
                      $('.chat-mes-img-full-screen').off('click');
                      $('.chat-mes-img-full-screen').click(function () {
                        showFullScreenImage($(this).attr('src'));
                      });

                      for (var i = 0; i < mesKeyArr.length; i++) {
                        const mesPcKey = mesKeyArr[i],
                          replyTo = replyToArr[i],
                          sender = senderArr[i],
                          message = messagArr[i],
                          type = typeArr[i];

                        const chatWrapId = '#mesPcVKw8h' + mesPcKey;

                        $('#copyBtnMes' + mesPcKey).off('click');
                        $('#copyBtnMes' + mesPcKey).click(function () {
                          copyToClipBoard(message);
                        });
                        $('#delBtnMes' + mesPcKey).off('click');
                        $('#delBtnMes' + mesPcKey).click(function () {
                          if (confirm('Are you sure you want to delete this message')) {
                            firebase.database().ref('chats/' + messageId + '/' + mesPcKey).remove();
                            if (type != 'text') {
                              firebase.storage().ref('chats/' + messageId + '/' + mesGre.child(mesPcKey + '/storage').val()).delete();
                            }
                          }
                        });
                        $('#replyBtnMes' + mesPcKey).off('click');
                        $('#replyBtnMes' + mesPcKey).click(function () {
                          var rc = '.reply-mes-pc-con';
                          $(rc).slideToggle(700);
                          $(rc).css('display', 'flex');
                          $(rc + ' span').text(message);
                          currentReplyId = mesPcKey;
                        });

                        var isLongClick = false,
                          timeClick;
                        $(chatWrapId).off('mouseup');
                        $(chatWrapId).off('mousedown');
                        $(chatWrapId).mousedown(function () {
                          isLongClick = false;
                          timeClick = setTimeout(() => {
                            isLongClick = true;
                            $(this).css('backgroundColor', 'grey');
                            $(chatWrapId + ' .mes-pc-long-click-opt').css('display', 'flex');
                          }, 1000);
                        });
                        $(chatWrapId).mouseup(function () {
                          if (!isLongClick) {
                            if (sender == mesUserId) {
                              $(this).css('backgroundColor', themeColorLight);
                            } else {
                              $(this).css('backgroundColor', 'white');
                            }
                            $(chatWrapId + ' .mes-pc-long-click-opt').css('display', 'none');
                            clearTimeout(timeClick);
                          }
                        });

                        if (messageId.startsWith('groupFlag')) {
                          mesFireRef.child("Users/" + sender + '/name').once('value', function (ns) {
                            $(chatWrapId + ' .user-pc-chat-name').text(limitString(ns.val(), 10));
                            console.log('inner name stamping == ' + message);
                          });
                        }
                        if (replyTo != null) {
                          mesFireRef.child("chats/" + messageId + '/' + replyTo).once('value', function (userReply) {
                            if (userReply.exists()) {
                              const replyType = userReply.child('type').val();
                              mesFireRef.child("Users/" + userReply.child('sender').val() + '/name').once('value', function (ur) {
                                var replyHtml = '<h>' + ur.val() + '</h>';
                                if (replyType == 'text') {
                                  replyHtml += '<span>' + userReply.child('message').val() + '</span>';
                                } else {
                                  switch (getFileExtension(replyType).toLowerCase()) {
                                    case 'png':
                                    case 'jpg':
                                    case 'jpeg':
                                    case 'gif':
                                    case 'svg':
                                      replyHtml += '<img src="' + userReply.child('message').val() + '" alt="" />';
                                      break;
                                    case 'mp4':
                                    case 'ogg':
                                    case 'mpg':
                                    case 'mpeg':
                                      replyHtml += '<img src="img/video-file.svg" alt="video file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;

                                    case 'mp3':
                                    case 'ogg':
                                    case '3gp':
                                      replyHtml += '<img src="img/music-file.svg" alt="music file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;

                                    case 'doc':
                                    case 'docx':
                                      replyHtml += '<img src="img/word.svg" alt="ms word file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;

                                    case 'xls':
                                    case 'xlsm':
                                    case 'xlsx':
                                    case 'ods':
                                      replyHtml += '<img src="img/excel.svg" alt="ms excel file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;

                                    case 'apk':
                                      replyHtml += '<img src="img/apk.svg" alt="apk file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;

                                    case 'exe':
                                      replyHtml += '<img src="img/exe.svg" alt="exe file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;

                                    case 'zip':
                                    case '7z':
                                      replyHtml += '<img src="img/zip.svg" alt="zip file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                      break;
                                    default:
                                      replyHtml += '<img src="img/airtel.png" alt="others file image" /> <span>' + limitString(replyType, 27) + '</span>';
                                  }
                                }
                                $(chatWrapId + ' .reply-mes-list').html(replyHtml);
                                console.log('inner reply stamping  == ' + replyHtml);
                              });
                            } else {
                              $(chatWrapId + ' .reply-mes-list').html('<b>Message was deleted</b>');
                            }
                          });
                        }
                      }
                      if (isFirstPageMes) {
                        isFirstPageMes = false;
                        $('.mes-list-pc-cont').scrollTop($('.mes-list-pc-cont').prop('scrollHeight') + 1000);
                      }
                      if ($('.mes-list-pc-cont').prop('scrollHeight') >= 300) {
                        $('.pc-mes-encrypt').fadeOut(700);
                      } else {
                        $('.pc-mes-encrypt').fadeIn(700);
                      }

                      isMesLoading = false;
                      setTimeout(() => {
                        if ($('.mes-list-pc-cont').scrollTop < 300 && $('.mes-list-pc-cont').children().length - addedFileCount != messageCount) {
                          console.log('trigger pc message scroll');
                          $('.mes-list-pc-cont').trigger('scroll');
                        }
                      }, 1000);

                    });
                  }

                });
                $('.mes-list-pc-cont').trigger('scroll');
                if (mesPcCon.css('display') == 'none') {

                }
                firebase.database().ref('message/' + mesUserId + '/' + messagePath + '/seen').remove();
              }, 300);
            });

            if (!mesAlertListenJson.includes(currentMesPath) && !isNotifyWithPopup && false) {
              mesAlertListenJson[currentMesPath] = true;
              firebase.database().ref("chats/" + messageId).orderByChild('date').limitToLast(1).on('child_added', function (notiShot) {
                console.log('shotting noti alert  ');
                const sender = notiShot.child('sender').val();

                if ((currentMesId != messageId || $('.mes-container-pc').css('display') != 'block') && sender != mesUserId && notiShot.numChildren() != 0) {
                  const alertPack = notiShot.val(),
                    type = alertPack.type,
                    message = alertPack.message,
                    alertKey = notiShot.key;

                  if (!isNotifyWithAudio) {
                    var audio = new Audio('aud/bellStruck.mp3');
                    audio.play();
                  }

                  var notiHtml = '<div class="pc-chat-alert-cont" id="pcalertnotimes5d54s96h76' + alertKey + '">';
                  firebase.database().ref('Users/' + sender).once('value', function (s) {
                    notiHtml += '<img src="' + formateUserImg(s.child('image').val()) + '" alt="profile image" class="pc-chat-alert-u-img"><div><b>' + s.child('name').val() + '</b>';
                    if (type == 'text' || type == 'notify') {
                      notiHtml += '<span>' + message + '</span>';
                    } else {
                      var exe = getFileExtension(type.toLowerCase());
                      switch (exe) {
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                        case 'svg':
                          notiHtml += '<img src="' + message + '" alt="" class="pc-alert-mes-img-ic">';
                          break;
                        case 'mp4':
                        case 'ogg':
                        case 'mpg':
                        case 'mpeg':
                          notiHtml += '<img src="img/airtel.png" alt="" class="pc-alert-mes-vid-ic"><i>A video was sent to you</i>';
                          break;

                        case 'mp3':
                        case 'ogg':
                        case 'wav':
                        case '3gp':
                          notiHtml += '<audio controls><source src="' + message + '" type="audio/' + exe + '"><source src="' + message + '" type="audio/ogg"><source src="' + message + '" type="audio/wav"><source src="' + message + '" type="audio/3gp">Your Browser does not support this file format</audio>';
                          break;
                        default:
                          notiHtml += '<span>A ' + exe + ' file was sent</span>';
                      }
                    }
                    notiHtml += '</div></div>';
                    $('.pc-chat-alert-con').fadeIn(700);
                    $('.pc-chat-alert-con').append(notiHtml);
                    $('.pc-chat-alert-con').scrollTop(1000);
                    const contAlertId = '#pcalertnotimes5d54s96h76' + alertKey;
                    $(contAlertId).off('click');
                    $(contAlertId).click(function () {
                      $('.pc-chat-alert-con').fadeOut(700);
                      accessMessageDialog(messagePath);
                    })
                  });
                }

              });
            }
          }
        });
        if ('isPc') {
          //show message alert if this not visible using child added snapshot
        }
      } else {
        toast('No User Found!', '');
        redirectToSignIn();
      }
    });
  }

  function pageMesChats(messageId, mesPcKey, sender, message, replyTo, type, timeStamp) {
    var mesHtml = '';
    console.log('stamping pc message  == ' + message);

    if (type == 'notify') {
      mesIndexHtml += '<div class="mes-pc-noti">' + message + '<sub>' + getTrimDate(timeStamp) + '</sub></div>';
    } else {
      if (sender == mesUserId) {
        mesHtml += '<div class="my-chat" id="mesPcVKw8h' + mesPcKey + '" ><input type="checkbox" name="mes-pc-del-input-name" value="' + messageId + ' ' + mesPcKey + '" ><img src="img/airtel.png" alt="copy icon" class="copy-mes-pc-ic">';
      } else {
        mesHtml += '<div class="other-chat" id="mesPcVKw8h' + mesPcKey + '" ><img src="img/airtel.png" alt="copy icon" class="copy-mes-pc-ic">';
      }
      mesHtml += '<div class="mes-pc-long-click-opt">';
      if (sender == mesUserId) {
        mesHtml += '<img src="img/deleteWhite.svg" alt="" id="delBtnMes' + mesPcKey + '" >';
      }
      mesHtml += '<img src="img/copyWhite.svg" alt="" id="copyBtnMes' + mesPcKey + '" ><button id="replyBtnMes' + mesPcKey + '" >Reply</button></div>';

      if (replyTo != null) {
        mesHtml += '<a href="#mesPcVKw8h' + replyTo + '" class="reply-mes-list"></a>';
      }

      if (messageId.startsWith('groupFlag')) {
        mesHtml += '<a href="profile.html?id=' + sender + '" class="user-pc-chat-name">Loading...</a>';
      }

      if (type == 'text') {
        mesHtml += '<span>' + message + '</span>';
      } else {
        var exe = getFileExtension(type.toLowerCase());
        switch (exe) {
          case 'png':
          case 'jpg':
          case 'jpeg':
          case 'gif':
          case 'svg':
            mesHtml += '<img src="' + message + '" alt="image message" class="img-mes-pc chat-mes-img-full-screen" >';
            break;
          case 'mp4':
          case 'ogg':
          case 'mpg':
          case 'mpeg':
            mesHtml += '<video controls><source src="' + message + '" type="video/' + exe + '"><source src="' + message + '" type="video/ogg"><source src="' + message + '" type="video/mpg"><source src="' + message + '" type="video/mpeg">Your Browser does not support this file format</video>';
            break;

          case 'mp3':
          case 'ogg':
          case 'wav':
          case '3gp':
            mesHtml += '<audio controls><source src="' + message + '" type="audio/' + exe + '"><source src="' + message + '" type="audio/ogg"><source src="' + message + '" type="audio/wav"><source src="' + message + '" type="audio/3gp">Your Browser does not support this file format</audio>';
            break;

          case 'doc':
          case 'docx':
            mesHtml += getMesFileTemp('img/word.svg', type);
            break;

          case 'xls':
          case 'xlsm':
          case 'xlsx':
          case 'ods':
            mesHtml += getMesFileTemp('img/excel.svg', type);
            break;

          case 'apk':
            mesHtml += getMesFileTemp('img/apk.svg', type);
            break;

          case 'exe':
            mesHtml += getMesFileTemp('img/exe.svg', type);
            break;

          case 'zip':
          case '7z':
            mesHtml += getMesFileTemp('img/zip.svg', type);
            break;
          default:
            mesHtml += getMesFileTemp('img/airtel.png', type);
        }
      }
      if (type != 'notify') {
        mesHtml += '<small>' + getTrimDate(timeStamp) + '</small></div>';
      }
      mesIndexHtml += mesHtml;
      console.log('done stamping pc message  == ' + message);
    }
  }

  function getMesFileTemp(tempSrc, type) {
    return '<div class="pc-mes-type-temp" style="height: 170px; width: 170px;"><img src="' + tempSrc + '" alt="file-icon" class="pc-mes-type-temp-img"><div class="pc-mes-file-temp-info"><div>' + limitString(type, 23) + '</div><button>Download</button></div></div>'
  }

  var chatListHtml = '';

  var chatAlertTimeOut, isChatAlertDismissCounting = false,
    mesAlert = $('.pc-chat-alert-con');
  mesAlert.on({
    mouseenter: function () {
      if (isChatAlertDismissCounting) {
        clearTimeout(chatAlertTimeOut);
      }
    },
    mouseleave: function () {
      chatAlertTimeOut = setTimeout(() => {
        isChatAlertDismissCounting = false;
        mesAlert.fadeOut(2000);
      }, 5000);
      isChatAlertDismissCounting = true;
    }
  });

  $('#clearReplyPcMes').click(function () {
    currentReplyId = '';
    $('.reply-mes-pc-con').slideToggle(700);
  });

  var hasPcChatInitiated = false,
    isChatPcLoading = false,
    isBlockUserState = false;

  //noti-block-user-btn-con
  function chatPcOpt() {
    var copt = $('.chat-pc-opt div'),
      hu4p = '.noti-block-user-btn-con',
      pcl = '.pc-chat-list';
    copt.eq(0).click(function () {

    });
    copt.eq(1).click(function () {

    });
    copt.eq(2).click(function () {
      isBlockUserState = true;
      $(hu4p).css('display', 'flex');
      $(pcl + ' div').css('display', 'none');
      $(pcl + ' input').css('display', 'block');
    });
    copt.eq(3).click(function () {

    });
  }
  chatPcOpt();

  var windowSizeFlag = 0,
    hasWindowResize = false;

  $(window).resize(function () {
    if ($(this).width() >= 800) { //pc
      isWindowPhone = false;
      if (windowSizeFlag < 800 || !hasWindowResize) {
        $('.chat-bottom').css('display', 'block');
        $('.mes-emoji-btn').off('click');
        hoverView('.mes-emoji-btn', '.mes-emoji-con', 'block');
        notiCon.css("visibility", 'initial');
        notiCon.css('display', 'none');
        $('.noti-container').css("margin-right", 'initial');
      }
    } else {
      isWindowPhone = true;
      if (windowSizeFlag >= 800 || !hasWindowResize) {
        notiCon.css('display', 'block');
        notiCon.css("visibility", 'hidden');
        $('.noti-container').css("margin-right", '-80%');
      }
      $('.drop-list').hide();
      $('.mes-emoji-btn').off('click');
      $('.mes-emoji-btn').click(function () {
        $('.mes-emoji-con').slideToggle(700);
      });

    }
    windowSizeFlag = $(this).width();
    hasWindowResize = true;
  });
  $(window).resize();

  var searchClientTimeOut = null,
    hasSearchClient = false;

  document.querySelector('.chat-search-client-pc-div input').oninput = function () {

    var search = $('.chat-search-client-pc-div input').val().trim(),
      cSearchCon = '.chat-search-pc-section-scroll';

    if (hasSearchClient) {
      clearTimeout(searchClientTimeOut);
    }

    if (search.length != 0) {
      if (isNumber(search)) {
        if (search.length > 7 && search.length < 16) {
          $(cSearchCon).html('<h3>Searching <img src="img/progressDots.gif" alt=""></h3>');

          hasSearchClient = true;
          searchClientTimeOut = setTimeout(() => {
            firebase.database().ref('Users').orderByChild('phone').startAt(search).endAt(search + '\uf8ff').limitToLast(30).once('value', function (phoneShot) {
              var phoneShotNum = phoneShot.numChildren();
              if (phoneShotNum != 0) {
                $(cSearchCon).html('<h3>' + phoneShotNum + ' Search Result Found</h3>');
                phoneShot.forEach(function (d) {
                  pageClientSearch(d, d.child('phone').val());
                });
              } else {
                $(cSearchCon).html('<h3>No Search Result Found</h3>');
              }
            });
          }, 1300);

        } else {
          $(cSearchCon).html('<h3 style="color: red;">Phone number must be at least 7 digits</h3>');
        }
      } else {
        $(cSearchCon).html('<h3>Searching <img src="img/progressDots.gif" alt=""></h3>');

        hasSearchClient = true;
        searchClientTimeOut = setTimeout(() => {
          firebase.database().ref('Users').orderByChild('name').startAt(search.toLowerCase()).endAt(search.toLowerCase() + '\uf8ff').limitToLast(40).once('value', function (nameShot) {
            var nameCount = nameShot.numChildren();
            if (nameCount != 0) {
              $(cSearchCon).html('<h3>' + nameCount + ' Search Result Found</h3>');
              nameShot.forEach(function (d) {
                const state = d.child('state').val(),
                  country = d.child('country').val();
                var location = state + ', ' + country;
                if (state == null || country == null) {
                  location = 'UNKNOWN';
                }
                pageClientSearch(d, '<i> <img src="img/location.svg" alt=""> <span>Lived At: ' + location + '</span></i>');
              });
            } else {
              $(cSearchCon).html('<h3>No Search Result Found</h3>');
            }
          });
        }, 1300);

      }
    } else {
      $(cSearchCon).html('<h3 style="color: red;">Search is empty</h3>');
    }
  };

  function pageClientSearch(d, iHtml) {
    var cKey = d.key,
      uImg = d.child('image').val(),
      uName = d.child('name').val(),
      work = d.child('work').val(),
      contHtml = '<div class="chat-search-pc-client-cont" id="clientSearchProKey83qwddfe' + cKey + '"><div class="chat-search-pc-client-pro"><img src="' + uImg + '" alt="user-image">';
    if (d.child('status').val() == 'online') {
      contHtml += '<div></div>';
    }
    if (work == null) {
      work = 'Work: UNKNOWN';
    }
    contHtml += '</div><div class="chat-search-pc-client-info"><div class="chat-search-pc-client-name">' + uName + '</div>' +
      '<div class="chat-search-pc-client-work">' + work + '</div>' + iHtml + '<div class="chat-search-pc-client-add">Message</div></div></div>';

    $('.chat-search-pc-section-scroll').append(contHtml);

    var contId = '#clientSearchProKey83qwddfe' + cKey;
    hoverFlashImg(contId + ' .chat-search-pc-client-pro img', uImg, '#noti-side-zoom-img-pc');
    $(contId + ' .chat-search-pc-client-pro img').click(function (e) {
      e.stopPropagation();
      showFullScreenImage($(this).attr('src'));
    });
    $(contId + ' .chat-search-pc-client-add').click(function (e) {
      accessMessageDialog(cKey);
      e.stopPropagation();
    });
    $(contId).click(function () {
      location.href = 'profile.html?userid=' + cKey;
    });

  }

  function stackToggle(btn, stackTop, stackBottom, stackIndex) {
    btn.off('click');
    btn.click(function () {
      $(stackBottom).css('zIndex', '0');
      $(stackTop).css('zIndex', stackIndex);
      $(stackTop).fadeIn(700);
    });
  }

  function tryToSignOut() {
    if (confirm('Are You Sure You Want To Sign Out')) {
      firebase.auth().signOut()
        .then(function () {
          if (!firebase.auth().currentUser) {
            redirectToSignIn();
          }
        }).catch(function (error) {
          alert(error);
        });
    }
  }

  var firstDrop = $('#mDrop').children(),
    middleDrop = $('#mDrop').children(),
    lastDrop = $('#lDrop').children(),
    headIc = $('.headIc'),
    navLinkArr = ['', 'gdz', 'transactionlist.html', '', '', 'profile.html', 'jobIndex.html', 'businessindex.html', 'helpcenter.html', '', 'settings.html', '', 'aboutUs.html'];

  for (var i = 0; i < navLinkArr.length; i++) {
    const a = i,
      navLink = navLinkArr[a];
    if (navLink != '') {
      $('.main-nav-global-ul li').eq(a).click(function () {
        if (a == 1) {
          $(pcd).slideToggle(700);
        } else {
          location.href = navLink;
        }
      });
    }
  }

  //signing out
  middleDrop.eq(6).click(function () {
    tryToSignOut();
  });

  const headCart = '#checkCartBtnHead';
  notiCon.click(function (e) {
    navToggle("hidden", "-80%", 'chat');
  });
  $('.noti-container').click(function (e) {
    e.stopPropagation();
  });

  function get_FCM_Token() {
    if (window.Notification || Notification.permission === 'denied') {
      Notification.requestPermission(status => {

        if (status == 'granted') {
          const messaging = firebase.messaging();

          messaging.getToken({
            vapidKey: 'BLzjsYCnYRJcIuGHDdAAaRhfK3mVHA05syJ5nEwHYk47LYAqXsT9La4jsxIWHrb9zhx2iDEsYB1FwRAN4jTqDBg'
          }).then((currentToken) => {
            if (currentToken) {
              console.log('token =' + currentToken);
              firebase.database().ref('FCM_Web_Token/' + mesUserId).set(currentToken);
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });

          messaging.onMessage(async (payload) => {
            console.log('Message received. ' + payload);
            await registerSW();
            var reg = await getSW();
            reg.update();
            var serviceWorker = reg.install || reg.waiting || reg.active;
            serviceWorker.postMessage({
              payload
            });
            triggerNotification(payload.title, payload.body, payload.params, payload.image, payload.sound, payload.timeStamp);
          });
        }

      });
    }
  }
  //geting cart count
  const footSignToggle = $('.footer-sigin-toggle-txt');

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      mesUserId = user.uid;
      try {
        get_FCM_Token();
      } catch (error) {
        console.log(error);
      }
      firebase.database().ref('Users/' + mesUserId + '/status').set('online');
      firebase.database().ref('Users/' + mesUserId + '/status').onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      $('.main-nav-global-ul li span').eq(11).html('Log out');
      $('.main-nav-global-ul li').eq(11).click(function () {
        tryToSignOut();
      });
      //phone and pc vendordashboard nav toggle
      firebase.database().ref('vendors/' + user.uid + '/status').once('value', function (v) {
        $('.main-nav-global-ul li').eq(0).show();
        $('.vendor-pc-decision-nav-link').css('display', 'block');
        const vS = v.val();

        if (vS == 'approved') {
          $('.main-nav-global-ul li span').eq(0).html('Vendor\'s Dashboard');
          $('.vendor-pc-decision-nav-link').html('Vendor\'s Dashboard');
          $('.main-nav-global-ul li').eq(0).click(function () {
            location.href = 'vendordashboard.html';
          });
          $('.vendor-pc-decision-nav-link').attr('href', 'vendordashboard.html');

          firebase.database().ref('transactionInfo').orderByChild('response').equalTo('pending' + user.uid).once('value', function (p) {
            const pendCount = p.numChildren();
            $('.main-nav-global-ul li nat').eq(0).css('display', 'inline-block');
            $('.main-nav-global-ul li nat').eq(0).html(pendCount);
            $('.vendor-pc-decision-nav-link notia').css('display', 'inline-block');
            $('.vendor-pc-decision-nav-link notia').html(pendCount);
          });

        } else if (vS == 'pending') {
          const venP = 'You request as a vendor is processing, please check back later';
          $('.vendor-pc-decision-nav-link').html('Vendor\'s Dashboard');
          $('.main-nav-global-ul li').eq(0).click(function () {
            alert(venP);
          });
          $('.vendor-pc-decision-nav-link').click(function () {
            alert(venP);
          });
        } else if (vS == null) {
          $('.main-nav-global-ul li').eq(0).click(function () {
            location.href = 'vendorreg.html';
          });
          $('.vendor-pc-decision-nav-link').click(function () {
            location.href = 'vendorreg.html';
          });
        } else {
          $('.main-nav-global-ul li').eq(0).hide();
          $('.vendor-pc-decision-nav-link').hide();
        }

      });
      firebase.database().ref('message/' + user.uid).orderByChild('seen').startAt(0).on('value', function (n) {
        var mesCount = n.numChildren(),
          mi = $('#newChatIndicatorTopHeader div');

        if (mesCount != 0) {
          mi.show();
          mi.html(mesCount);
        } else {
          mi.hide();
          mi.html('');
        }
      });
      // User is signed in.
      firebase.database().ref('cart/' + user.uid).on('value', function (s) {
        $(headCart).off('click');
        var cartNum = s.numChildren(),
          productId;

        if (cartNum == 1) {
          s.forEach(function (i) {
            productId = i.key;
          });
        }
        if (cartNum != 0) {
          $(headCart + ' div').css('display', 'block');
          $(headCart + ' div').text(cartNum);
        } else {
          $(headCart + ' div').css('display', 'none');
        }
        $(headCart).off('click');
        $(headCart).click(function () {
          if (cartNum == 0) {
            toast('Cart is currently empty', 'img/cart.svg');
          } else if (cartNum == 1) {
            location.href = 'onecart.html?productId=' + productId;
          } else {
            location.href = 'multicart.html';
          }
        });

      });

      notiBtn.off("click");
      notiBtn.click(function (e) {
        if (isWindowPhone) {
          navToggle("visible", "0%", 'chat');
        } else {
          notiCon.slideToggle(700);
        }
        if (!hasPcChatInitiated) {
          hasPcChatInitiated = true;

          firebase.database().ref("message/" + user.uid).orderByChild('lastDate').on('value', function (m) {
            if (!isChatPcLoading) {
              isChatPcLoading = true;
              var hu4p = '.noti-block-user-btn-con',
                pcl = '.pc-chat-list';
              chatListHtml = '<noChat>Loading chats <img src="img/progressDots.gif" alt=""></noChat><div class="find-chat-pc"><img src="img/chat.svg" alt=""></div>' +
                '<div class="no-chat-found-pc-cont"><img src="img/chatFriend.jpg" alt=""><h3>No Chat Found</h3></div><div class="noti-block-user-btn-con"><div>cancel</div>' +
                '<span>block</span></div>';
              $('.m-flow').html(chatListHtml);
              stackToggle($('.find-chat-pc'), '.chat-search-pc-section', '.chat-pc-create-group-section, .pc-chat-settings-section', '40');

              $(hu4p + ' div').off('click');
              $(hu4p + ' div').click(function () {
                isBlockUserState = false;
                $(hu4p).css('display', 'none');
                $(pcl + ' div').css('display', 'block');
                $(pcl + ' input').css('display', 'none');
              });
              $(hu4p + ' span').off('click');
              $(hu4p + ' span').click(function () {

                if (confirm('Warning: blocking chats will remove and clear all user chats and messages')) {
                  $(hu4p).css('display', 'none');
                  $(pcl + ' div').css('display', 'block');
                  $(pcl + ' input').css('display', 'none');
                  isBlockUserState = false;

                  $('input[name=noti-main-section-checkbox]:checked').map(function () {
                    const ivMesPath = $(this).val().split(' ')[1],
                      ivMesId = $(this).val().split(' ')[0],
                      blockJson = {};
                    if (ivMesPath.startsWith('groupFlag')) {

                      firebase.database().ref('groupChat/' + ivMesId).once('value', function (a) {
                        var adminNum = a.child('admin').numChildren();

                        if (adminNum == 1 && a.child('admin').hasChild(mesUserId)) {
                          blockJson['groupChat/' + ivMesPath] = null;
                          blockJson['chats/' + ivMesId] = null;
                          a.child('participants').forEach(function (p) {
                            blockJson['message/' + p.key + '/' + ivMesPath] = null;
                          });

                          firebase.database().ref('chats/' + ivMesId).orderByChild('storage').startAt('-M').once('value', function (storeRef) {
                            var filesArr = [],
                              ite = 1;
                            filesArr[0] = 'groupImg.png';
                            storeRef.forEach(function (d) {
                              filesArr[ite] = d.child('storage').val();
                              ++ite;
                            });
                            firebase.database().ref().update(blockJson).then(function (err) {
                              if (!err) {
                                const st = firebase.storage().ref('chats/' + ivMesPath);
                                console.log('query storage delete');

                                for (var i = 0; i < filesArr.length; i++) {
                                  const filePath = filesArr[i];
                                  st.child(filePath).getDownloadURL().then(function () {
                                    st.child(filePath).delete();
                                  }, function () {
                                    console.log('storage doesnt exist');
                                  });
                                }
                              } else {
                                alert('An error Occurred!');
                              }
                            });
                          });

                        } else if (adminNum > 1 && a.child('admin/' + mesUserId).exists()) {
                          blockJson['groupChat/' + ivMesPath + '/admin/' + mesUserId] = null;
                          blockJson['groupChat/' + ivMesPath + '/participants/' + mesUserId] = null;
                          blockJson['message/' + mesUserId + '/' + ivMesPath] = null;
                          firebase.database().ref().update(blockJson);
                        } else {
                          blockJson['groupChat/' + ivMesPath + '/participants/' + mesUserId] = null;
                          blockJson['message/' + mesUserId + '/' + ivMesPath] = null;
                          firebase.database().ref().update(blockJson);
                        }

                      });

                    } else {
                      blockJson['chats/' + ivMesId] = null;
                      blockJson['message/' + ivMesPath + '/' + mesUserId] = null;
                      blockJson['message/' + mesUserId + '/' + ivMesPath] = null;
                      firebase.database().ref().update(blockJson);
                    }

                  }).get();
                }
              });
              var chatArr = [],
                ite = 0;

              if (m.numChildren() == 0) {
                $('.no-chat-found-pc-cont').css('display', 'block');
                isChatPcLoading = false;
              } else {
                $('.no-chat-found-pc-cont').css('display', 'none');
              }

              m.forEach(function (i) {
                console.log('dir chat iter  ==  ' + new Date(i.child('lastDate').val()).toLocaleDateString("en-US"));
                chatArr[ite] = i.key;
                ++ite;
              });
              for (var i = chatArr.length - 1; i >= 0; i--) {
                const messagePath = chatArr[i],
                  rowIndex = i;

                console.log('its not group chat' + i);

                firebase.database().ref("Users/" + messagePath).once('value', function (userShot) {

                  console.log('awaiting other chat name ' + i);
                  console.log('logging rowIndex  =' + rowIndex);
                  var groupImg = null,
                    messageId = '',
                    name = '',
                    lasDate = new Date(m.child(messagePath + "/lastDate").val()).toLocaleDateString("en-US");
                  chatListHtml = '';
                  var seenCount = m.child(messagePath + "/seen").val();
                  if (seenCount != null && seenCount > 0) {
                    seenCount = '<div>' + stack999(seenCount) + '</div>';
                  } else {
                    seenCount = '';
                  }
                  if (!messagePath.startsWith('groupFlag')) {
                    groupImg = userShot.child('image').val();
                    messageId = m.child(messagePath + "/messageId").val();
                    name = userShot.child('name').val();
                    if (groupImg == null) {
                      groupImg = 'img/user.png';
                    }
                  } else {
                    messageId = messagePath;
                    name = 'Loading...';
                    groupImg = 'img/progressDots.gif';
                    console.log('group top setter');
                  }

                  console.log('inside function fro message id ==  ' + messageId);

                  chatListHtml += '<div id="chatListPcHeader' + messageId + '" class="pc-chat-list" ><img src="' + groupImg + '" alt="profile" /> <block> <small>' + lasDate + '</small>' +
                    seenCount + '<input type="checkbox" name="noti-main-section-checkbox" value="' + messageId + ' ' + messagePath + '" ><span>' + limitString(name, 23) + '</span><sub>Loading...</sub></block> </div>';
                  $('.m-flow').append(chatListHtml);
                  const chatContId = '#chatListPcHeader' + messageId;

                  if (messagePath.startsWith('groupFlag')) {
                    firebase.database().ref('groupChat/' + messageId).once('value', function (gs) {
                      var gsImg = gs.child('image').val(),
                        gsName = gs.child('name').val();
                      if (gsImg == null) {
                        gsImg = 'img/user.png';
                      }
                      $(chatContId + ' block span').text(limitString(gsName, 23));
                      $(chatContId + ' img').attr('src', gsImg);
                      hoverFlashImg(chatContId + ' img', gsImg, '#noti-side-zoom-img-pc');
                    });
                  } else {
                    hoverFlashImg(chatContId + ' img', groupImg, '#noti-side-zoom-img-pc');
                  }
                  $('.pc-chat-list img').off('click');
                  $('.pc-chat-list img').click(function (e) {
                    e.stopPropagation();
                    showFullScreenImage($(this).attr('src'));
                  });
                  firebase.database().ref('chats/' + messageId).orderByChild('date').limitToLast(1).once('value', function (lasMesShot) {
                    if (lasMesShot.numChildren() == 1) {
                      lasMesShot.forEach(function (d) {
                        const fileType = d.child('type').val(),
                          lasMesType = getFileExtension(fileType);
                        console.log('checking value for lasmestype = ' + lasMesType);
                        if (fileType == 'text' || fileType == 'notify') {
                          $(chatContId + ' block sub').text(limitString(d.child('message').val(), 25));
                        } else if (lasMesType == 'mp4' || lasMesType == 'mpg' || lasMesType == 'mpeg') {
                          $(chatContId + ' block sub').text('A video was sent');
                        } else if (lasMesType == 'mp3' || lasMesType == 'ogg' || lasMesType == '3gp') {
                          $(chatContId + ' block sub').text('An audio file was sent');
                        } else if (lasMesType == 'png' || lasMesType == 'svg' || lasMesType == 'gif' || lasMesType == 'jpg' || lasMesType == 'jpeg') {
                          $(chatContId + ' block sub').text('An image was sent');
                        } else {
                          $(chatContId + ' block sub').text('A "' + lasMesType + '" was sent');
                        }
                      });
                    } else {
                      $(chatContId + ' block sub').text('Hi there, am using Algonex');
                    }
                    if (rowIndex == 0) {
                      console.log('lossdf   dsdollly    yyyyynnn');
                      $('.m-flow noChat').css('display', 'none');
                      isChatPcLoading = false;
                    }
                  });
                  $(chatContId).off('click');
                  $(chatContId).click(function () {
                    if (isBlockUserState) {
                      if ($(chatContId + ' block input').prop('checked')) {
                        $(chatContId + ' block input').prop('checked', false);
                        $(this).css('backgroundColor', 'white');
                      } else {
                        $(chatContId + ' block input').prop('checked', true);
                        $(this).css('backgroundColor', 'rgb(177, 177, 177)');
                      }
                      var checkBlock = $('input[name="noti-main-section-checkbox"]:checked').length;
                      if (checkBlock > 0) {
                        $(hu4p + ' span').html('Block(' + checkBlock + ')');
                      } else {
                        $(hu4p + ' span').html('Block');
                      }

                    } else {
                      accessMessageDialog(messagePath);
                    }
                  });

                  console.log('am from outside');

                  console.log('await finish ' + i);
                });
              }
            }
          });

        }

      });
      footSignToggle.html('Sign Out');
      footSignToggle.click(function (e) {
        tryToSignOut();
      });
    } else {
      $('.main-nav-global-ul li span').eq(11).html('Log In');
      $('.main-nav-global-ul li').eq(11).click(function () {
        redirectToSignIn();
      });
      footSignToggle.html('Sign In');
      footSignToggle.attr('href', 'signin.html?i=' + encodeURIComponent(location.href));

      notiBtn.off("click");
      notiBtn.click(function (e) {
        redirectToSignIn();
      });
    }
  });

  function toggleChatSetting(img, key, txtRef, txtOn, txtOff, flag, con) {
    if (isInLocalStorage(key)) {
      flag = true;
      img.attr('src', 'img/switch-off.svg');
      txtRef.html(txtOff);
    } else {
      flag = false;
      img.attr('src', 'img/switch-on.svg');
      txtRef.html(txtOn);
    }
    $(con).click(function () {
      if (isInLocalStorage(key)) {
        flag = true;
        img.attr('src', 'img/switch-on.svg');
        txtRef.html(txtOn);
        window.localStorage.removeItem(key);
      } else {
        flag = false;
        img.attr('src', 'img/switch-off.svg');
        txtRef.html(txtOff);
        window.localStorage.setItem(key, 'activated');
      }
    });
  }


  const csPop = '#chat-popup-settings',
    csMute = '#chat-mute-settings',
    csEnterSend = '#enter-is-send-chat-settings';
  toggleChatSetting($(csPop + ' div img'), 'naijabissMesPopup', $(csPop + ' div small'),
    'You will receive popup notifications for incoming messages', 'You will not receive popup notifications for incoming messages', isNotifyWithPopup, csPop);

  toggleChatSetting($(csMute + ' div img'), 'naijabissMesNotifyAudio', $(csMute + ' div small'),
    'Notifications for incoming messages will not be muted', 'Notifications for incoming messages will be muted', isNotifyWithAudio, csMute);

  toggleChatSetting($(csEnterSend + ' div img'), 'naijabissMesEnterSend', $(csEnterSend + ' div small'),
    'Your message will be sent when you press enter key', 'A line break will be added when you press enter key', isEnterSend, csEnterSend);

  function getTrimDate(timeStamp) {
    const t = new Date(timeStamp);
    return t.getHours() + ':' + t.getMinutes() + ' ' + t.getDate() + '/' + t.getMonth() + '/' + t.getFullYear().toString().substr(2);
  }

  var groupUrlRef = getUrlParam('groupId');
  if (groupUrlRef != null) {
    const g = '.group-link-public-join-alert';
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        mesUserId = user.uid
        firebase.database().ref('groupChat/' + groupUrlRef).once('value', function (s) {
          if (s.exists()) {
            if (!s.child('participants').hasChild(mesUserId)) {
              if (s.child('private').exists()) {
                if (confirm('This group is private, would you like to send a group request')) {
                  firebase.database().ref('groupChat/' + groupUrlRef + '/request/' + mesUserId).set(fireTime).then(function (err) {
                    if (err) {
                      alert('Sorry an unexpected error occurred,Please try again');
                    } else {
                      alert('Group Request Sent Successfully');
                    }
                  });
                }
              } else {
                var img = s.child('image').val();
                if (img == null) {
                  $(g + ' div temp').css('backgroundColor', 'orange');
                } else {
                  $(g + ' div temp').css('backgroundImage', 'url("' + img + '")');
                }
                $(g + ' div packer b').text(limitString(s.child('name').val(), 23));
                firebase.database().ref('Users/' + s.child('createdBy').val() + '/name').once('value', function (u) {
                  $(g + ' div packer span').text(limitString(u.val(), 30));
                });
                $(g + ' div packer small').text('Created On: ' + new Date(s.child('createdOn').val()).toLocaleString());
                $(g + ' div button').off('click');
                $(g + ' div button').click(function () {
                  $(this).attr('disabled', 'true');
                  var j = {};
                  j['groupChat/' + groupUrlRef + '/participants/' + mesUserId] = fireTime;
                  j['message/' + mesUserId + '/' + groupUrlRef + '/lastDate'] = fireTime;
                  firebase.database().ref().update(j).then(function (err) {
                    if (err) {
                      alert('Sorry an unexpected error occurred,Please try again');
                      $(this).attr('disabled', 'false');
                    } else {
                      accessMessageDialog(groupUrlRef);
                      $(g).hide();
                      $(this).attr('disabled', 'false');
                    }
                  });
                });
                $(g).show();
              }
            } else {
              alert('You are already a member of this group');
              accessMessageDialog(groupUrlRef);
            }

          } else {
            alert('invalid group link');
            $(g).hide(700);
          }
        });
      } else {
        location.href = 'signin.html';
      }
    });

  }



});
