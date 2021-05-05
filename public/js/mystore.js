$(document).ready(function () {

  const storeScroll = $('#user-view-store-flex-container'),
    scrollWidth = $('.my-store-packer').width();

  function setTab(position) {
    $('#user-view-store-tab th').css('backgroundColor', 'rgb(61, 61, 61)');
    $('#user-view-store-tab th').eq(position).css('backgroundColor', 'blue');
  }

  /*var scrollTimeout = '';

  storeScroll.scroll(function () {
    var scrollLeft = storeScroll.scrollLeft();
    clearTimeout(scrollTimeout);

    if (scrollLeft == 0) {
      setTab(0);
    } else if (scrollLeft >= scrollWidth - 7 && scrollLeft <= scrollWidth + 7) {
      setTab(1);
    } else if (scrollLeft >= (scrollWidth * 2) - 7 && scrollLeft <= (scrollWidth * 2) + 7) {
      setTab(2);
    }
  });
  storeScroll.trigger('scroll');*/

  function limitString(value, limit) {
    if (value.length <= limit)
      return value;
    else
      return value.substring(0, limit) + '...';
  }

  function isNumber(value) {
    return /^\d+$/.test(value);
  }

  function isInLocalStorage(key) {
    if (window.localStorage.getItem(key) === null)
      return false;
    else
      return true;
  }

  var mainCurrentPage = 1,
    midCurrentPage = 1,
    thirdCurrentPage = 1,
    hasInitiatedStore = false;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userId = user.uid;
      $('.my-store-live-mode').click(function () {
        location.href = 'productsearch.html?sellerId=' + userId;
      });
      setUpStoreTable('sellerId', userId, 0, 'main');
      setUpStoreTable('status', 'pending' + userId, 1, 'mid');
      setUpStoreTable('status', 'declined' + userId, 2, 'third');

      $('.my-store-nav-btn').click(function(){
        if(!hasInitiatedStore){
          $('#user-view-store-tab th').eq(0).trigger('click');
        }
        hasInitiatedStore = true;
      });

      function setUpStoreTable(queryChild, queryValue, tabIndex, sectionPrefix) {
        $('#user-view-store-tab th').eq(tabIndex).off('click');
        $('#user-view-store-tab th').eq(tabIndex).click(function () {
          setTab(tabIndex);
          storeScroll.scrollLeft(tabIndex * scrollWidth);
          $('#user-view-store-flex-container').children().css('height', '0px');
          $('#user-view-store-flex-container').children().eq(tabIndex).css('height', 'initial');
          console.log('index at=' + tabIndex + ' &scroll=' + tabIndex * scrollWidth);

          const mainSpin = $('#' + sectionPrefix + '-store-section-spinner'),
            mainTemp = $('#' + sectionPrefix + '-store-not-found-temp'),
            mainBox = $('#' + sectionPrefix + '-store-page-box-list-con'),
            mainTable = $('#' + sectionPrefix + '-store-prod-table');

          mainSpin.css('display', 'block');
          mainTemp.css('display', 'none');
          mainTable.html('');
          firebase.database().ref('Products').orderByChild(queryChild).equalTo(queryValue).once('value', function (shot) {
            const shotNum = shot.numChildren();
            mainSpin.css('display', 'none');
            if (shotNum == 0) {
              mainTemp.css('display', 'block');
              mainBox.css('display', 'none');
            } else {
              mainTemp.css('display', 'none');
              mainBox.css('display', 'block');
              mainBox.empty();

              for (var i = 1; i <= Math.ceil(shotNum / 20); i++) {
                const a = i;
                mainBox.append('<b>' + i + '</b>');
                mainBox.children().eq(a - 1).off('click');
                mainBox.children().eq(a - 1).click(function () {
                  pageStoreRecord(a);
                });
              }

              if (sectionPrefix == 'main') {
                pageStoreRecord(mainCurrentPage);
              } else if (sectionPrefix == 'mid') {
                pageStoreRecord(midCurrentPage);
              } else {
                pageStoreRecord(thirdCurrentPage);
              }

              function pageStoreRecord(page) {
                mainBox.children().css('backgroundColor', 'green');
                mainBox.children().eq(page - 1).css('backgroundColor', 'blue');

                if (sectionPrefix == 'main') {
                  mainCurrentPage = page;
                } else if (sectionPrefix == 'mid') {
                  midCurrentPage = page;
                } else {
                  thirdCurrentPage = page;
                }

                mainTable.html('<tr class="p-head"><th>Info</th> <th>Created on</th><th>Product Id</th><th>status</th><th>On/Off</th></tr>');
                var index = 0;

                shot.forEach(function (d) {
                  if (index >= (page - 1) * 20 && index < page * 20) {

                    const pImg = d.child('pImg').val(),
                      pName = d.child('pName').val(),
                      pPrice = d.child('pPrice').val(),
                      stock = d.child('stock').val(),
                      date = d.child('date').val(),
                      key = d.key;

                    var condition = d.child('condition').val(),
                      discount = d.child('discount').val(),
                      switchSrc = 'img/switch-off.svg',
                      status = d.child('status').val();

                    if (discount == null) {
                      discount = '0%';
                    }
                    if (condition == 'new') {
                      condition = '<span style="background-color: green;">New</span>';
                    } else {
                      condition = '<span style="background-color: orangered;">Used</span>';
                    }
                    if (status.startsWith('pending')) {
                      status = 'style="color: orange;">Pending';
                    } else if (status.startsWith('declined')) {
                      status = 'style="color: orangered;">Declined';
                    } else {
                      status = 'style="color: rgb(0, 179, 0);">Approved';
                    }
                    if (stock > 0) {
                      switchSrc = 'img/switch-on.svg';
                    }
                    const rowRef = sectionPrefix + 'StoreTableRowa6g2bv7s9qz' + key;

                    var tableHtml = '<tr id="' + rowRef + '"><td><div class="p-store-info"><img src="' + pImg + '" class="p-store-img" /><a href="onecart.html?productId=' + key + '" target="_blank" class="p-store-name">' + limitString(pName, 60) + '</a>' +
                      '<div class="p-store-price">&#8358;' + numberWithCommas(pPrice) + '</div><div class="p-store-discount"><div>Discount: </div><span>' + discount +
                      '</span><img src="img/edit.png" /></div><div class="condition-p-store"><div>Condition: </div>' + condition +
                      '</div><div class="stock-p-store"><div>Stock: </div><span>' + stock + '</span><img src="img/edit.png" /></div></div></td>' +
                      '<td><div class="p-store-created-on">' + new Date(date).toLocaleString("en-us") + '</div></td><td><div class="store-prod-ref" >' + key + '</div></td><td><div class="p-store-status" ' + status + '</div></td>' +
                      '<td class="store-table-switch"><img src="' + switchSrc + '" /></td></tr>';
                    mainTable.append(tableHtml);
                    var switchFlag = 0,
                      switchBtn = $('#' + rowRef + ' .store-table-switch img'),
                      storeTxt = $('#' + rowRef + ' .stock-p-store span'),
                      disTxt = $('#' + rowRef + ' .p-store-discount span'),
                      stockRef = firebase.database().ref('Products/' + key + '/stock'),
                      disRef = firebase.database().ref('Products/' + key + '/discount');

                    disRef.off('value');
                    stockRef.off('value');

                    stockRef.on('value', function (switchShot) {
                      const s = switchShot.val();
                      switchFlag = s;
                      storeTxt.text(s);
                      if (s > 0) {
                        switchBtn.attr('src', 'img/switch-on.svg');
                      } else {
                        switchBtn.attr('src', 'img/switch-off.svg');
                      }
                    });
                    disRef.on('value', function (discountShot) {
                      disTxt.text(discountShot.val());
                    });

                    switchBtn.off('click');
                    switchBtn.click(function () {
                      if (switchFlag > 0) {
                        window.localStorage.setItem('stockNum' + key, switchFlag);
                        stockRef.set(0);
                      } else {
                        if (isInLocalStorage('stockNum' + key)) {
                          stockRef.set(window.localStorage.getItem('stockNum' + key));
                        } else {
                          stockRef.set(1);
                        }
                      }
                    });
                    $('#' + rowRef + ' .p-store-discount img').off('click');
                    $('#' + rowRef + ' .p-store-discount img').click(function () {
                      var newDiscount = prompt('Input New Discount Value', disTxt.text());
                      if (newDiscount != null) {
                        if (isNumber(newDiscount)) {
                          firebase.database().ref('Products/' + key + '/discount').set(newDiscount);
                        } else {
                          alert('Discount must be a number');
                        }
                      }
                    });
                    $('#' + rowRef + ' .stock-p-store img').off('click');
                    $('#' + rowRef + ' .stock-p-store img').click(function () {
                      var newStock = prompt('Input New Stock Value', storeTxt.text());
                      if (newStock != null) {
                        if (isNumber(newStock)) {
                          firebase.database().ref('Products/' + key + '/stock').set(newStock);
                        } else {
                          alert('New stock must be a number');
                        }
                      }
                    });
                  }
                  ++index;
                });
              }
            }

          });
        });
      }
    }
  });

});