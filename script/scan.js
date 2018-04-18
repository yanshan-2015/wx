$(function() {
  var Url = location.href;
  var accesstoken, openid, barCode, scanDate, jingdu, weidu, weiChartNo, telphone, name, phoneStatus;
  var status;
  var code = getQueryString('code');
  var _this = this;
  code = code.split('#');
  code = code[0];

  if (Url.indexOf('&state') >= 0) {
    Url = Url.split('&state=');
    Url = Url[0] + '#' + Url[1];
    location.href = Url;
  }
  params = Url.split('#');
  params = params[1];
  params = Url.split('~');
  barCode = params[0]; //防伪码
  barCode = barCode.split('#');
  barCode = barCode[1];
  state = params[1];
  if (location.href.indexOf('&state') == -1) {
    $.ajax({
      type: 'get',
      url: path + '/getweiopenid',
      dataType: 'jsonp',
      jsonp: "jsoncallback",
      data: {
        code: code
      },
      success: function(data) {
        $('.loaderBox').hide();
        openid = data.openid;
        userinfo(openid, barCode);
      },
      error: function(data) {

      },
    })
  }

  //下次再关注
  $('.hideFocu').click(function() {
    $('.focus').hide();
  })

  //设置body高度
  $('.indexBody').css('height', height + 'px');
  $('.form').css('height', height + 'px');
  $('.focus').css('height', height + 'px');

  //获取验证码
  $('.getnum').click(function() {
    $('.getnum').addClass('on');
    telphone = $('.phone').val();
    if (telphone != '' && telphone.length == 11) {
      getNum(telphone);
      time(this);
    } else {
      alert('手机输入有误!');
    }
    return false;
  })

  //提交表单
  $('.submit').click(function() {
      $('.loaderBox').show();
      name = $('.name').val();
      scanDate = '2017';
      var verifyCode = $('.verify').val();
      if (name != '') {
        //检测验证码是否正确
        //sendUserInfo(barCode, scanDate, jingdu, weidu, openid, name, status, telphone);
        checkNum(verifyCode, barCode, scanDate, jingdu, weidu, openid, name, status, telphone);
      } else {
        alert('请输入姓名！');
      }

      return false;
    })
    //规则显示隐藏
  $('.rules').click(function() {
      $('.ruleBox').toggle();
    })
    //获取微信签名
  $.ajax({
    type: 'post',
    url: path + '/getweichatcfg',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      url: Url
    },
    success: function(data) {
      var str1 = data.timestamp;
      var str2 = data.nonceStr;
      accesstoken = data.accesstoken;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
        appId: appid, // 必填，公众号的唯一标识  
        timestamp: str1, // 必填，生成签名的时间戳  
        nonceStr: str2, // 必填，生成签名的随机串  
        signature: data.signature, // 必填，签名，见附录1  
        jsApiList: [
            'chooseImage',
            'checkJsApi',
            'getLocation',
            'scanQRCode',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'openLocation'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
      });
      wx.ready(function() {
        if (state == 1) {
          //根据防伪码进行防伪验证
          antifake(barCode);
          $('.form').show();
        }
        // wx.onMenuShareTimeline({
        //   title: '慕思防伪', // 分享标题
        //   link: 'www.derucci.com/service/index.html', // 分享链接
        //   imgUrl: 'http://www.derucci.com/service/image/01-qr.png', // 分享图标
        //   success: function() {
        //     // 用户确认分享后执行的回调函数
        //   },
        //   cancel: function() {
        //     // 用户取消分享后执行的回调函数
        //   }
        // });

        // wx.onMenuShareAppMessage({
        //   title: '慕思防伪', // 分享标题
        //   desc: '扫码进行正品验证。', // 分享描述
        //   link: 'www.derucci.com/service/index.html', // 分享链接
        //   imgUrl: 'http://www.derucci.com/service/image/01-qr.png', // 分享图标
        //   type: '', // 分享类型,music、video或link，不填默认为link
        //   dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //   success: function() {
        //     alert($('.getnum').text());
        //     // 用户确认分享后执行的回调函数
        //   },
        //   cancel: function() {
        //     // 用户取消分享后执行的回调函数
        //   }
        // });
        //调用微信扫一扫
        $('.scan').click(function() {
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
              success: function(res) {
                barCode = res.resultStr;
                if (barCode.indexOf("barCode=") != -1) {
                  barCode = barCode.split('barCode=');
                  barCode = barCode[1];
                }

                //验证防伪码
                if (barCode.indexOf('http') == -1 && barCode.length >= 30) {
                  antifake(barCode);
                  $('.form').show();
                } else {
                  alert('该二维码不是防伪码!');
                }
              }
            });
          })
          //获取地理位置
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            weidu = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            jingdu = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          }
        });

        //打开微信地图
        // wx.openLocation({
        //   latitude: 23, // 纬度，浮点数，范围为90 ~ -90
        //   longitude: 113.7, // 经度，浮点数，范围为180 ~ -180。
        //   name: '慕思', // 位置名
        //   address: '东莞市厚街双岗上环慕思寝室用品有限公司', // 地址详情说明
        //   scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
        //   infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        // });
      })
    },
    error: function(data) {
      // alert('网络异常，数据获取失败。');
    }
  });
})

function checkPhone() {
  var val = $('.phone').val();
  var length = val.length;
  if (length > 11) {
    $('.phone').val(val.slice(0, 11));
  }
}

//获取用户信息
function userinfo(openid, barCode) {
  $.ajax({
    type: 'post',
    url: path + '/getweiuserinfo',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      openId: openid
    },
    success: function(data) {
      var nickname = data.nickname;
      // var getnickname = localStorage.getItem("getnickname");
      if (nickname == undefined) {
        // if (barCode) {
        $('.focus').show();
        $('.form').hide();
        // }
      } else {
        // localStorage.setItem("getnickname", '1');
      }
    }
  })
}

//获取验证码
function getNum(telphone) {
  $.ajax({
    type: 'post',
    url: path + '/sendmsg',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      mobile: telphone
    },
    success: function(data) {
      var msg = data.msg;
      if (msg != undefined) {
        if (msg == '发送成功') {
          // alert('验证码已经发到您的手机，请注意查看。');
        } else if (msg == '请求参数格式错误') {
          alert('您输入的手机有误。');
        } else {
          alert(msg);
        }
      } else {
        alert('您的网络有问题。');
      }
    }
  })
}

//检查验证码是否正确
function checkNum(verifyCode, barCode, scanDate, jingdu, weidu, openid, name, status, telphone) {
  $.ajax({
    type: 'post',
    url: path + '/verifymsg',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      mobile: $('.phone').val(),
      verifyCode: verifyCode,
      openId: openid
    },
    success: function(data) {
      var msg = data.msg;
      if (msg != undefined) {
        if (msg == '验证码已经过期!') {
          alert('验证码已过期!')
        } else if (msg == '验证码错误!') {
          alert('验证码错误！')
        } else if (msg == 'OK') {
          //根据扫描的防伪码进行正品验证。
          $.ajax({
            async: true,
            type: 'get',
            url: path + '/getproinfo',
            dataType: 'jsonp',
            jsonp: "jsoncallback",
            data: {
              fenBarCode: barCode
            },
            success: function(data) {
              //如果出库单不存在，则更新status状态
              if (data[0] != undefined) {
                if (data[0].fstkOutLogNo == undefined) {
                  status = 0;
                }
              }
              if (data.length == 0) {
                status = 0;
              } else {
                if (data[0].fstkOutLogNo == undefined) {
                  status = 0;
                } else {
                  status = 1;
                }
              }
              sendUserInfo(barCode, scanDate, jingdu, weidu, openid, name, status, telphone);
            },
            error: function(data) {
              alert('防伪验证失败！');
            }
          })
        }
      } else {
        alert('您的网络有问题！');
      }
    },
    error: function(data) {
      alert('您的网络有问题！');
    }
  })
}

//提交数据
function sendUserInfo(barCode, scanDate, jingdu, weidu, openid, name, status, telphone) {
  $.ajax({
    type: 'post',
    url: path + '/savescaninfo',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      barCode: barCode, //防伪码
      scanDate: scanDate,
      jingdu: jingdu,
      weidu: weidu,
      weiChartNo: openid,
      telphone: $('.phone').val(),
      name: name,
      status: status
    },
    success: function(data) {
      if (data.msg == "OK") {
        location.href = 'result.html?barCode=' + barCode + '&id=' + data.obj + '&phone=' + telphone + '&jingdu=' + jingdu + '&weidu=' + weidu + '&name=' + encodeURI(encodeURI(name)) + '&status=' + status;
      }
    },
    error: function(data) {}
  })
}

//发送验证码倒计时
var wait = 120;

function time(o) {
  if (wait == 0) {
    $('.getnum').removeClass('on');
    o.removeAttribute("disabled");
    $('.getnum').text("获取验证码");
    wait = 120;
  } else {

    o.setAttribute("disabled", true);
    $('.getnum').text("重新发送(" + wait + ")");
    wait--;

    setTimeout(function() {
        time(o)
      },
      1000)
  }
}

function antifake(barCode) {
  //根据扫描的防伪码进行正品验证。
  $.ajax({
    async: true,
    type: 'get',
    url: path + '/getproinfo',
    dataType: 'jsonp',
    jsonp: "jsoncallback",
    data: {
      fenBarCode: barCode
    },
    success: function(data) {
      //如果出库单不存在，则更新status状态
      if (data[0] != undefined) {
        if (data[0].fstkOutLogNo == undefined) {
          status = 0;
        }
      }
      if (data.length == 0) {
        status = 0;
      } else {
        if (data[0].fstkOutLogNo == undefined) {
          status = 0;
        } else {
          status = 1;
        }
      }
    },
    error: function(data) {
      alert('防伪验证失败！');
    }
  })
}