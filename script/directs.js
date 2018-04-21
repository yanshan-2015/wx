$(function () {

  var clientHeights = document.documentElement.clientHeight; //获取设备视屏高度
  var directHeight = $('.direct').height(); //获取页面高度

  //页面结构平衡处理：
  heigthCompare(clientHeights, directHeight);

  //手机输入值清空
  $('.del').click(function () {
    $('#phone').val('');
  });

  //手机正则检测待开发

  $('#phone').change(function () {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test($(this).val())) {
      alert('您输入手机号码有误！');
      $(this).val('');
    }
  });

  //图片选择和预览
  PreView();

  //星级评价
  var Arr = [];
  $('.star span').click(function () {
    $(this).parent().children().removeClass('actives');

    var starLsNum = $(this).parents('.starLs').index();
    var starNum = $(this).index()+1;

    for (var i=0; i<starNum; i++){
      $(this).parent().children().eq(i).addClass('actives');
      Arr[starLsNum] = starNum;
    }
  });

  //提交处理
  $('.submit').click(function () {
    var phoneVal = $('#phone').val();
    var textVal  = $('#typeInput').val();
    if(phoneVal ===''){
      alert('请输入手机号！');

      return false
    }
    if(Arr.length !== 4){
      alert('星级评价未完成！');
      return false
    }
    $('.loaderBox').fadeIn(150);

    //上传数据
    var formData = new FormData($('#myForm')[0]);
    /*for (var i=0; i<file.length; i++){
      formData.append('file[]',file[i]);
    }*/
    formData.append('barCode','来自直接反馈');
    formData.append('name','来自直接反馈');
    formData.append('telphone',phoneVal);
    formData.append('cpLeave',Arr[2]);
    formData.append('xsfwLeave',Arr[0]);
    formData.append('azfwLeave',Arr[1]);
    formData.append('ztLeave',Arr[3]);
    formData.append('status', 'false');
    formData.append('backText',textVal);
    formData.append('remark','来自直接反馈');
    $.ajax({
      type: 'POST',
      url : 'http://zs.derucci.net:8821/deruccimid/antifake/savefeedback',//保存地址
      data: formData,
      async: false,
      processData: false,
      contentType: false,
      success: function (res) {
        $('.loaderBox').fadeOut(150);
        if(res.success === true){
          setTimeout(function () {
            $('.cover').fadeIn(100);
          },150);

        }else {
          alert('提交失败, 请重新测试')
        }
      },
      error: function () {
        alert('提交失败，请重试');
      }
    })
  });

  //确认
  $('.btn').click(function () {
    location.href='direct.html'
  })

});

//预览处理
var PreView = function () {
  $('#choseFile').change(function (e) {
    var files = e.target.files;
    console.log(files);
    var imageType = /^image\//;

    for (var i = 0, numFiles = files.length; i < numFiles; i++) {
      var file = files[i];
      if(!imageType.test(file.type)){
        alert('请选择图片！');
        return false
      }
      if(file.size > 2184534){
        alert('单张图片不能大于2M');
        return false
      }

      var li = $('<li></li>');
      var img = $("<img class='obj' file="+ file +">");
      if(window.FileReader){
        var reader = new FileReader();
      }else {
        alert('你的设备不支持预览');
        return false
      }
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.attr('src', e.target.result);
        };
      })(img);

      var liLen = $('.imgList').children();
      if(liLen.length > 4){
        alert('最多上传四张照片！');
        return false
      }
      li.append(img);
      $('.imgList').prepend(li);
      reader.readAsDataURL(file);
    }
  })
};

function heigthCompare(x, y) {
  if (x > y){
    $('.direct').css({
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    })
  }
}