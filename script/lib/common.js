var appid = 'wx877a7e37b0de0a87';
var secret = 'f98fea578758c4a7be289fc851037f10';
var path = 'http://zs.derucci.net:8821/deruccimid/antifake';
var height = window.innerHeight;

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

$('.loaderBox').css('height', height + 'px');