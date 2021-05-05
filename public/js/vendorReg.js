$(document).ready(function () {

  $('seemr').click(function(){
    $(this).hide();
    $('.show-more-list').slideToggle(700);
  });

  hasGottenImgCompressorScript = true;

  var isDoneWithFirstSlide = false,
    isDoneWithSecondSlide = false,
    isDoneWithThirdSlide = false,
    formCon = $('#formCon'),
    inputCon = $('#formCon');

  function setCheck(position, bord, checkHtml) {
    var sv = '.slide-nav';
    $('.nav-img').eq(position).css('border', '2px solid ' + bord);
    $(sv + ' div t').eq(position).html(checkHtml);
  }

  formCon.scroll(function () {
    var scrollLeft = formCon.scrollLeft(),
      scrollWidth = inputCon.width();


    if (scrollLeft == 0) {
      setCheck(0, 'red', 'Profile');
      setCheck(1, 'red', 'Finance');
      setCheck(2, 'red', 'Agreements');
    } else if (scrollLeft >= scrollWidth - 7 && scrollLeft <= scrollWidth + 7) {
      setCheck(0, 'blue', '<img src="img/check.svg" alt="">');
      setCheck(1, 'red', 'Finance');
      setCheck(2, 'red', 'Agreements');
    } else if (scrollLeft >= (scrollWidth * 2) - 7 && scrollLeft <= (scrollWidth * 2) + 7) {
      setCheck(0, 'blue', '<img src="img/check.svg" alt="">');
      setCheck(1, 'blue', '<img src="img/check.svg" alt="">');
      setCheck(2, 'red', 'Agreements');
    }
  });
  formCon.trigger('scroll');

  function g(ref) {
    $(ref).css('display', 'none');
  }

  function sh(ref) {
    $(ref).css('display', 'block');
  }

  function s(ref) {
    return $(ref).val().trim();
  }

  var firstName = '',
    lastName = '',
    email = '',
    phone1 = '',
    phone2 = '',
    storeName = '',
    storeDes = '',
    gender = 'none',
    //second section
    accountNo = '',
    tin = '',
    regNo = '',
    address = '',
    sellList = '',
    state = 'none',
    localGov = 'none';


  function v(ref, errorTxt, isTextarea, mandatory) {
    var inputRef = ref + '-cont input';
    if (isTextarea == 'y') {
      inputRef = ref + '-cont textarea';
    }
    document.querySelector(inputRef).oninput = function () {
      const i = s(inputRef);
      switch (ref) {
        case '#first-name':
          firstName = i;
          break;
        case '#last-name':
          lastName = i;
          break;
        case '#email':
          email = i;
          break;
        case '#phone-1':
          phone1 = i;
          break;
        case '#store-name':
          storeName = i;
          break;
        case '#store-des':
          storeDes = i;
          break;
        case '#sell-list':
          sellList = i;
          break;
        case '#account-no':
          accountNo = i;
          break;
        case '#tin':
          tin = i;
          break;
        case '#regNo':
          regNo = i;
          break;
        case '#address':
          address = i;
          break;
      }
      if (mandatory != 'no') {
        if (i.length == 0) {
          sh(ref + '-error');
          $(ref + '-error').html(errorTxt + ' is required');
          $(ref + '-cont').css('border', '1px solid red');
        } else {
          g(ref + '-error');
          $(ref + '-cont').css('border', '1px solid rgb(187, 187, 187)');
        }
      }
    };
  }

  function validateSelect(ref, errorTxt) {
    $(ref + '-cont').change(function () {
      const i = $(ref + '-cont').val();
      if (ref == '#gender') {
        gender = i;
      } else if (ref == '#state') {
        state = i;
      } else if (ref == '#localGovt') {
        localGov = i;
      }
      if (i == 'none') {
        sh(ref + '-error');
        $(ref + '-error').html(errorTxt + ' is required');
      } else {
        g(ref + '-error');
      }
    });
  }

  v('#first-name', 'First name');
  v('#last-name', 'Last name');
  v('#email', 'Email');
  v('#phone-1', 'Phone number');
  v('#store-name', 'Your store name');
  v('#store-des', 'Store description', 'y');
  v('#sell-list', 'Listing what you sell', 'y');
  v('#account-no', 'Account Number');
  v('#tin', '', 'n', 'no');
  v('#address', 'Residential Address', 'y');
  v('#regNo', '', 'n', 'no');

  validateSelect('#gender', 'Gender');
  validateSelect('#state', 'State of residence');
  validateSelect('#localGovt', 'Local goverment');
  $('#dob-cont input').change(function () {
    if ($(this).val() == '') {
      sh('#dob-error');
      $('#dob-error').html('Date of birth is required');
      $('#dob-cont').css('border', '1px solid red');
    } else {
      g('#dob-error');
      $('#dob-cont').css('border', '1px solid rgb(187, 187, 187)');
    }
  });

  var proPic = '',
    documentImg = '',
    totalDocUploaded = 0;

  gm('#vendor-pro-img');
  gm('#vendor-pro-document', 't');

  function gm(ref, isDoc) {
    $(ref + ' input').change(function (e) {
      if (e.target.files.length == 0) {
        return;
      }
      if (isDoc) {
        documentImg = 'processing';
      } else {
        proPic = 'processing';
      }
      const file = e.target.files[0];
      switch (getFileExtension(file.name).toLowerCase()) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
          new Compressor(file, {
            quality: 0.3,
            convertSize: 30000,
            success(result) {
              if (isDoc) {
                documentImg = result;
              } else {
                proPic = result;
              }
            },
            error() {
              if (isDoc) {
                documentImg = 'error';
              } else {
                proPic = 'error';
              }
            }
          });
          break;
        default:
          if (isDoc) {
            documentImg = '';
          } else {
            proPic = '';
          }
          alert('Unsupported image file format');
      }
    });
  }

  firebase.auth().onAuthStateChanged(function (user) {
    $('.next-btn').off('click');
    if (user) {
      const userId = user.uid;
      console.log('userId = '+userId);
      $('.next-btn').click(function () {
        const dob = s('#dob-cont input'),
          uDialog = $('.prod-upload-progress-cover-all-con');
        $('#first-form-section div input, #first-form-section textarea').trigger('oninput');
        $('#gender-cont').trigger('change');
        $('#dob-cont input').trigger('change');

        if (firstName != '' && lastName != '' && email != '' && phone1 != '' && storeName != '' && storeDes != '' && dob != '' && gender != 'none' && sellList != '' && address != '') {
          if (proPic == '') {
            alert('Please select a store image');
          } else if (proPic == 'processing') {
            alert('Please wait a sec, store image is processing');
          } else if (proPic == 'error') {
            alert('Unsupported profile image');
          } else if (documentImg == '' || documentImg == 'processing' || documentImg == 'error') {
            alert('Invalid Identification document');
          } else {
            if (!isDoneWithFirstSlide) {
              formCon.scrollLeft(inputCon.width());
              setTimeout(() => {
                $('#first-form-section').css({
                  'height': '0px',
                  'overflowY': 'hidden'
                });
              }, 500);
              isDoneWithFirstSlide = true;
            } else {
              $('#second-form-section div input, #second-form-section textarea').trigger('oninput');
              $('#state-cont').trigger('change');
              if ($('#localGovt-cont').val() == 'none') {
                sh('#localGovt-error');
                $('#localGovt-error').html('Local government is required');
              } else {
                g('#localGovt-error');
              }
              console.log('accno  =' + accountNo);
              console.log('sellist  =' + sellList);
              console.log('address  =' + address);
              console.log('state  =' + state);
              console.log('localg  =' + localGov);

              if (accountNo != '' && state != 'none' && localGov != 'none') {
                if (!isDoneWithSecondSlide) {
                  isDoneWithSecondSlide = true;
                  $('.agreement-section').css('height', 'initial');
                  formCon.scrollLeft(inputCon.width() * 2);
                } else {
                  var hasAgree = false;
                  $('input[name="agreement-checkbox-name"]:checked').map(function () {
                    hasAgree = true;
                  });
                  if (!hasAgree) {
                    alert('You have to check the box to confirm you\'ve agreed to our T\'s & C\'s');
                    return;
                  }
                  var vendorData = {
                    fName: firstName.toLowerCase(),
                    lName: lastName.toLowerCase(),
                    date: firebase.database.ServerValue.TIMESTAMP,
                    dob: dob,
                    phone: phone1,
                    storeName: storeName.toLowerCase(),
                    storeDes: storeDes,
                    gender: gender,
                    email: email,
                    accountNo: accountNo,
                    sellList: sellList,
                    address: address,
                    state: state.toLowerCase(),
                    localGovt: localGov.toLowerCase(),
                    status: 'pending'
                  }
                  if (tin != '') {
                    vendorData.tin = tin;
                  }
                  if (regNo != '') {
                    vendorData.regNo = regNo;
                  }
                  if (phone2 != '') {
                    vendorData.phone2 = phone2;
                  }
                  uDialog.show();
                  firebase.database().ref('vendors/' + userId).once('value', function (vShot) {
                    if (vShot.exists()) {
                      alert('current user already registered as a vendor');
                      uDialog.hide();
                    } else {
                      if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
                        navigator.geolocation.getCurrentPosition(function (location) {
                          var latitude = location.coords.latitude,
                            longitude = location.coords.longitude;

                          const geoFireInstance = new geofire.GeoFire(firebase.database().ref('geoVendor'));
                          geoFireInstance.set(userId, [latitude, longitude]).then(function () {
                            proceedUpload(proPic, 'img');
                            proceedUpload(documentImg, 'document');
                          });
                        }, function (error) {
                          if (error.code == 1) {
                            alert("Error: PERMISSION_DENIED: You location is currently turned off, please try switching it on");
                          } else if (error.code === 2) {
                            alert("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
                          } else if (error.code === 3) {
                            alert("Error: TIMEOUT: Calculating the user's location too took long");
                          } else {
                            alert("Unexpected error code")
                          }
                          uDialog.hide();
                        });
                      } else {
                        alert('You device doesn\'t support GPS location, Try using device that support GPS location');
                      }

                      function proceedUpload(incomingFile, fileRef) {
                        const storageRef = firebase.storage().ref('vendorImg/' + userId + '/documents/' + fileRef + '.png'),
                          uploadTask = storageRef.put(incomingFile);
                        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (s) {}, function (error) {
                          alert('Uploading vendors data failed');
                          uDialog.hide();
                        }, function () {
                          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURl) {
                            vendorData['/' + fileRef] = downloadURl;
                            ++totalDocUploaded;
                            if (totalDocUploaded == 2) {
                              firebase.database().ref('vendors/' + userId).set(vendorData).then(function (err) {
                                uDialog.hide();
                                if (err) {
                                  alert('Failed to upload data');
                                } else {
                                  alert('Just a few hours for you to start selling on Algonex, We will notify you after validating your data');
                                  location.href = 'index.html';
                                }
                              }).catch(function () {
                                uDialog.hide();
                              });
                            }
                          });
                        });
                      }
                    }
                  });
                }

              } else {
                alert('Please fill out required field');
              }
            }
          }
        } else {
          alert('Please fill out required field');
        }
        $(window).scrollTop(400);
      });
    } else {
      $('.next-btn').click(function () {
        location.href = 'signin.html?i=vendorReg.html';
      });
    }
  });

  const stateArr = getState(),
    localGovtArr = getLocalGovt();

  var stateHtml = '<option value="none">Select Residential State</option>';
  for (i = 0; i < stateArr.length; i++) {
    stateHtml += '<option value="' + stateArr[i] + '">' + stateArr[i] + '</option>';
  }

  $('#state-cont').html(stateHtml);
  $('#state-cont').change(function (e) {
    if ($(this).val() == 'none') {
      $('#localGovt-cont').html('<option value="none">Select Local Government</option>');
    } else {
      const v = e.target.selectedIndex - 1;
      var sub = '<option value="none">Select Local Government</option>';
      for (i = 0; i < localGovtArr[v].length; i++) {
        sub += '<option value="' + localGovtArr[v][i] + '">' + localGovtArr[v][i] + '</option>';
      }
      $('#localGovt-cont').html(sub);
    }
  });

  var faqAnswers = ['The Vendor shall offer its Products to Algonex for the purpose of sale by the Vendor on the Portal.Based on market analysis conducted by Algonex, Algonex may make recommendations to the Vendor from time to time on the specific Products and the quantities thereof, from the entire range/collection that are to be displayed, advertised and offered for sale by the Vendor through the Portal. The Vendor shall make its final decision on the Products and their quantities to be displayed on the Portal on the basis of such recommendations. Notwithstanding the foregoing, Algonex has the right to refuse to display, or withdraw from the Portal, any Product for sale on the Portal.',

    'Seller will notify Algonex Marketplace by email at support@Algonex.com (or through the Seller Portal) of all special offers and promotions (i.e., where Seller discounts an item or items by a certain amount for a certain period of time) offered on the Seller Site. Seller will make special offers and promotions available to Algonex Customers in connection with the Marketplace Program, and will use commercially reasonable efforts to allow Algonex Marketplace to support any such special offer or promotion through the Seller Portal. If Seller makes any Public Promotions generally available to all users of the Seller Site and Algonex Marketplace cannot support such Public Promotion, then Seller will provide an equivalent offer or promotion to Algonex Marketplace Customers to the extent possible. Seller will work in good faith with Algonex Marketplace to maximize the number of Seller offers and promotions (including equivalent offers and promotions) made available to Algonex Marketplace Customers.',

    'At Algonex Marketplace’s option, all payments to Seller’s bank account will be made by mean of electronic funds transfer or similar method. If Algonex Marketplace concludes that Seller’s actions and/or performance in connection with this Agreement may result in customer disputes, chargebacks or other claims, then Algonex Marketplace may, in its sole discretion, delay initiating any remittances and withhold any payments to be made or that are otherwise due to Seller under this Agreement for the shorter of completion of any investigation(s) regarding Seller’s actions and/or performance in connection with this Agreement.',

    'The Seller shall bear the full risk in and to any valid cancellation of an Order by a Customer, and expressly acknowledges that Customer’s may have additional rights against the Seller as a result of the terms and conditions contained on the Algonex Site. If Seller cannot fullfill the entire quantity of a purchase order line in an Order, then the Seller will (prior to acceptance) reject that purchase order line through the “Reject” button on the Seller Portal, and thereafter fullfill all other lines in the Order and promptly notify Algonex Marketplace of such rejection. If the Order consists of one purchase order line and the Seller cannot fullfill the entire quantity for, then the Seller will be expected to reject or cancel the entire Order and promptly notify Algonex Marketplace via email or the Seller Portal and will provide any additional information that may be required by Algonex Marketplace.',

    'Refunds, returns, and exchanges will be determined via the Algonex Return And Refund Policy. Seller will be responsible for all exchanges and replacements, where applicable. <br> When Products are returned to a Algonex physical store, Algonex Marketplace will notify the Seller via the Seller Portal or email that there are Products that have been returned and require assessment before a refund can be processed. The Seller is obligated to collect and assess Products that are returned for resolution within 5 (five) business days of notification of return.',

    'Algonex will be responsible for shipping all Products purchased by Customers in accordance with Algonex Marketplace’s standard shipping practices. Seller will be responsible for all shipping charges and for any costs or charges related to shipping-related problems, including without limitation, damaged or lost Products, late shipments or misdelivery'
  ];
  for (var i = 0; i < $('.faq-ul-links').children().length; i++) {
    const a = i;
    $('.faq-ul-links li').eq(a).click(function () {
      alert(faqAnswers[a]);
    });
  }
});