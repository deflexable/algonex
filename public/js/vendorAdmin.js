$(document).ready(function () {

  const adminScrollCon = $('#admin-section-flexer'),
    scrollWidth = $('.admin-section-packer').width(),
    adminTab = $('#admin-seller-request-tab th');

  function setTab(position) {
    adminTab.css('backgroundColor', 'rgb(61, 61, 61)');
    adminTab.eq(position).css('backgroundColor', 'blue');
  }

  function limitString(value, limit) {
    if (value.length <= limit)
      return value;
    else
      return value.substring(0, limit) + '...';
  }

  var currentVendorReqPage = 1,
    currentProdReqPage = 1,
    hasInitiatedAdminSection = false;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userId = user.uid;

      setUpVendorRequest();

      $('.admin-sction-nav-btn').click(function(){
        if(!hasInitiatedAdminSection){
          hasInitiatedAdminSection = true;
          setUpVendorRequest();
        }
      });

      function setUpVendorRequest() {
        adminTab.eq(0).off('click');
        adminTab.eq(0).click(function () {
          setTab(0);
          adminScrollCon.scrollLeft(0);
          $('#admin-section-flexer').children().css('height', '0px');
          $('#admin-section-flexer').children().eq(0).css('height', 'initial');

          const mainSpin = $('#admin-seller-request-spinner'),
            mainTemp = $('#admin-seller-request-not-found-temp'),
            mainBox = $('#admin-seller-request-page-box-con'),
            mainTable = $('#admin-seller-request-table');

          mainSpin.css('display', 'block');
          mainTemp.css('display', 'none');
          mainTable.html('');
          firebase.database().ref('vendors').orderByChild('status').equalTo('pending').once('value', function (shot) {
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

              pageStoreRecord(currentVendorReqPage);

              function pageStoreRecord(page) {
                mainBox.children().css('backgroundColor', 'green');
                mainBox.children().eq(page - 1).css('backgroundColor', 'blue');

                currentVendorReqPage = page;

                mainTable.html('<tr class="p-head"><th>Profile</th><th>Date</th><th>status</th><th>Access</th></tr>');
                var index = 0;

                shot.forEach(function (d) {
                  if (index >= (page - 1) * 20 && index < page * 20) {

                    const img = d.child('img').val(),
                      name = d.child('fName').val() + ' ' + d.child('lName').val(),
                      date = d.child('date').val(),
                      key = d.key;
                    var status = d.child('status').val();

                    if (status == 'pending') {
                      status = 'style="color: orange;">Pending';
                    } else {
                      status = 'style="color: rgb(0, 179, 0);">Approved';
                    }

                    const rowRef = 'adminSellerRequestRow9di4c6zx45a' + key;

                    const tableHtml = '<tr id="' + rowRef + '" ><td><div class="p-store-info"><img src="' + img + '" alt="Failed to load image" class="p-store-img"><h3>' + name + '</h3></div></td>' +
                      '<td><div class="p-store-created-on">' + new Date(date).toLocaleString("en-us") + '</div></td><td><div class="p-store-status" ' + status + '</div>' +
                      '</td><td><button class="admin-preview-vendor-request-btn" value="' + key + '">Preview</button></td></tr>';
                    mainTable.append(tableHtml);
                    $('#' + rowRef + ' .admin-preview-vendor-request-btn').click(function () {
                      adjustPageNavigation('.vendor-profile-con');
                      accessVendorProfilePage(key);
                    });
                  }
                  ++index;
                });
              }
            }

          });
        });
      }

      setUpProdRequest(1);

      function setUpProdRequest(tabIndex) {
        adminTab.eq(tabIndex).off('click');
        adminTab.eq(tabIndex).click(function () {
          setTab(tabIndex);
          adminScrollCon.scrollLeft(scrollWidth * 1);
          adminScrollCon.children().css('height', '0px');
          adminScrollCon.children().eq(1).css('height', 'initial');

          const mainSpin = $('#admin-prod-req-spinner'),
            mainTemp = $('#admin-prod-req-not-found-temp'),
            mainBox = $('#admin-prod-req-box-con'),
            mainTable = $('#admin-prod-request-table');

          mainSpin.css('display', 'block');
          mainTemp.css('display', 'none');
          mainTable.html('');
          firebase.database().ref('Products').orderByChild('status').startAt('pending').once('value', function (shot) {
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

              pageStoreRecord(currentProdReqPage)

              function pageStoreRecord(page) {
                mainBox.children().css('backgroundColor', 'green');
                mainBox.children().eq(page - 1).css('backgroundColor', 'blue');
                currentProdReqPage = page;

                mainTable.html('<tr class="p-head"><th>Info</th> <th>Created on</th><th>status</th><th>Access</th></tr>');
                var index = 0;

                shot.forEach(function (d) {
                  if (index >= (page - 1) * 20 && index < page * 20) {

                    var pImg = d.child('pImg').val();
                    const pName = d.child('pName').val(),
                      pPrice = d.child('pPrice').val(),
                      stock = d.child('stock').val(),
                      date = d.child('date').val(),
                      sellerId = d.child('sellerId').val(),
                      key = d.key;

                    var condition = d.child('condition').val(),
                      discount = d.child('discount').val(),
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

                    const rowRef = 'adminProdReqTableRow9djw6x2m0n7t' + key;

                    var tableHtml = '<tr id="' + rowRef + '"><td><div class="p-store-info"><img src="' + pImg + '" class="p-store-img" /><a href="onecart.html?productId=' + key + '" class="p-store-name">' + limitString(pName, 60) + '</a>' +
                      '<div class="p-store-price">&#8358;' + numberWithCommas(pPrice) + '</div><div class="p-store-discount"><div>Discount: </div><span>' + discount +
                      '</span></div><div class="condition-p-store"><div>Condition: </div>' + condition + '</div><div class="stock-p-store"><div>Stock: </div><span>' + stock + '</span></div></div></td>' +
                      '<td><div class="p-store-created-on">' + new Date(date).toLocaleString("en-us") + '</div></td><td><div class="p-store-status" ' + status + '</div></td>' +
                      '<td><button class="admin-preview-vendor-request-btn"></button></td></tr>';
                    mainTable.append(tableHtml);

                    const bId = $('#' + rowRef + ' td:last-child button'),
                      sId = $('#' + rowRef + ' .p-store-status');

                    var aceptRef = firebase.database().ref('Products/' + key + '/status');
                    aceptRef.off('value');

                    aceptRef.off('value');
                    aceptRef.on('value', function (aShot) {
                      bId.off('click');
                      const res = aShot.val();
                      if (res == null) {
                        $('#' + rowRef).hide();
                      } else if (res.startsWith('pending') || res.startsWith('declined')) {
                        bId.css('backgroundColor', 'green');
                        bId.text('Approve');
                        bId.click(function () {
                          firebase.database().ref('Products/' + key + '/status').set('approved' + sellerId);
                        });
                        if(res.startsWith('pending')){
                          sId.css('color', 'orange');
                          sId.text('Pending');
                        }else{
                          sId.css('color', 'orangered');
                          sId.text('Declined');
                        }
                      } else {
                        sId.css('color', 'rgb(0, 179, 0)');
                        sId.text('Approved');
                        bId.css('backgroundColor', 'red');
                        bId.text('Declined');
                        bId.click(function () {
                          firebase.database().ref('Products/' + key + '/status').set('declined' + sellerId);
                        });
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


      function buildAdminPanel(){
        
      }
    }
  });

});