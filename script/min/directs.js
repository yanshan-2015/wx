function heigthCompare(e,t){e>t&&$(".direct").css({position:"absolute",top:"0",right:"0",bottom:"0",left:"0"})}$(function(){heigthCompare(document.documentElement.clientHeight,$(".direct").height()),$(".del").click(function(){$("#phone").val("")}),$("#phone").change(function(){/^[1][3,4,5,7,8][0-9]{9}$/.test($(this).val())||(alert("您输入手机号码有误！"),$(this).val(""))}),PreView();var e=[];$(".star span").click(function(){$(this).parent().children().removeClass("actives");for(var t=$(this).parents(".starLs").index(),a=$(this).index()+1,n=0;n<a;n++)$(this).parent().children().eq(n).addClass("actives"),e[t]=a}),$(".submit").click(function(){var t=$("#phone").val(),a=$("#typeInput").val();if(""===t)return alert("请输入手机号！"),!1;if(4!==e.length)return alert("星级评价未完成！"),!1;$(".loaderBox").fadeIn(150);var n=new FormData($("#myForm")[0]);n.append("barCode","来自直接反馈"),n.append("name","来自直接反馈"),n.append("telphone",t),n.append("cpLeave",e[2]),n.append("xsfwLeave",e[0]),n.append("azfwLeave",e[1]),n.append("ztLeave",e[3]),n.append("status","false"),n.append("backText",a),n.append("remark","来自直接反馈"),$.ajax({type:"POST",url:"http://zs.derucci.net:8821/deruccimid/antifake/savefeedback",data:n,async:!1,processData:!1,contentType:!1,success:function(e){$(".loaderBox").fadeOut(150),!0===e.success?setTimeout(function(){$(".cover").fadeIn(100)},150):alert("提交失败, 请重新测试")},error:function(){alert("提交失败，请重试"),$(".loaderBox").fadeOut(150)}})}),$(".btn").click(function(){location.href="direct.html"})});var PreView=function(){$("#choseFile").change(function(e){var t=e.target.files;console.log(t);for(var a=/^image\//,n=0,r=t.length;n<r;n++){var i=t[n];if(!a.test(i.type))return alert("请选择图片！"),!1;if(i.size>2184534)return alert("单张图片不能大于2M"),!1;var c=$("<li></li>"),o=$("<img class='obj' file="+i+">");if(!window.FileReader)return alert("你的设备不支持预览"),!1;var l=new FileReader;l.onload=function(e){return function(t){e.attr("src",t.target.result)}}(o);if($(".imgList").children().length>4)return alert("最多上传四张照片！"),!1;c.append(o),$(".imgList").prepend(c),l.readAsDataURL(i)}})};