$(function() {
  var barCode = getQueryString('barCode');
  var id = getQueryString('id');
  var phone = getQueryString('phone');
  var jingdu = getQueryString('jingdu');
  var weidu = getQueryString('weidu');
  var status = getQueryString('status');
  var name = decodeURI(decodeURI(getQueryString('name')));
  //设置body高度
  $('.resultBody').css('height', height + 'px');
  // $.ajax({
  //     type: 'get',
  //     url: path + '/getweiuserinfo',
  //     dataType: 'jsonp',
  //     jsonp: "jsoncallback",
  //     data: {
  //       code: '011KOQY927aRmR0i1z2a27KcZ92KOQYe'
  //     },
  //     success: function(data) {
  //       console.log('success')
  //       console.log(data);
  //       // alert(JSON.stringify(data));
  //     },
  //     error: function(data) {
  //       console.log('error')
  //       console.log(data);
  //     }
  //   })
  $('.next').click(function() {
    location.href = 'response.html?phone=' + phone + '&jingdu=' + jingdu + '&weidu=' + weidu + '&status=' + status + '&barCode=' + barCode + '&name=' + encodeURI(encodeURI(name));
  });

  //根据扫描的防伪码进行正品验证。
  $.ajax({
    type: 'get',
    url: path + '/getproinfo',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      fenBarCode: barCode
    },
    success: function(data) {
      $('.loaderBox').hide();
      //如果出库单不存在，则更新status状态
      if (data[0] != undefined) {
        if (data[0].fstkOutLogNo == undefined) {
          updateState(id);
        }
      }
      if (data.length == 0) {
        $('.errmsg').show();
        $('.truemsg').hide();
      } else {
        if (data[0].fstkOutLogNo != undefined) {
          $('.errmsg').hide();
          $('.truemsg').show();
          var data = data[0];
          setData(data);
        } else {
          $('.errmsg').show();
          $('.truemsg').hide();
        }
      }
    },
    error: function(data) {
      alert('error');
    }
  })
});

function setData(data) {
  if (data.checked_num == 1) {
    $('.fgoodsCode').text(data.fgoodsCode);
    $('.fgoodsName').text(data.fgoodsName);
    $('.fsizeDesc').text(data.fsizeDesc);
    $('.checkIndex').text('首');
    $('.personMsg').hide();
  } else {
    $('.fgoodsCode').text(data.fgoodsCode);
    $('.fgoodsName').text(data.fgoodsName);
    $('.fsizeDesc').text(data.fsizeDesc);
    $('.checkIndex').text('第' + data.checked_num);
    $('.name').text(data.name.charAt(0) + '**');
    $('.address').text(data.city);
  }
}

function updateState(id) {
  $.ajax({
    type: 'get',
    url: path + '/updatescanstatus',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      id: id
    },
    success: function(data) {

    }
  })
}