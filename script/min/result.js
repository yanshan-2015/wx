function setData(e){1==e.checked_num?($(".fgoodsCode").text(e.fgoodsCode),$(".fgoodsName").text(e.fgoodsName),$(".fsizeDesc").text(e.fsizeDesc),$(".checkIndex").text("首"),$(".personMsg").hide()):($(".fgoodsCode").text(e.fgoodsCode),$(".fgoodsName").text(e.fgoodsName),$(".fsizeDesc").text(e.fsizeDesc),$(".checkIndex").text("第"+e.checked_num),$(".name").text(e.name.charAt(0)+"**"),$(".address").text(e.city))}function updateState(e){$.ajax({type:"get",url:path+"/updatescanstatus",dataType:"jsonp",jsonp:"jsoncallback",data:{id:e},success:function(e){}})}$(function(){var e=getQueryString("barCode"),t=getQueryString("id"),o=getQueryString("phone"),s=getQueryString("jingdu"),d=getQueryString("weidu"),a=getQueryString("status"),n=decodeURI(decodeURI(getQueryString("name")));$(".resultBody").css("height",height+"px"),$(".next").click(function(){location.href="response.html?phone="+o+"&jingdu="+s+"&weidu="+d+"&status="+a+"&barCode="+e+"&name="+encodeURI(encodeURI(n))}),$.ajax({type:"get",url:path+"/getproinfo",dataType:"jsonp",jsonp:"jsoncallback",data:{fenBarCode:e},success:function(e){if($(".loaderBox").hide(),void 0!=e[0]&&void 0==e[0].fstkOutLogNo&&updateState(t),0==e.length)$(".errmsg").show(),$(".truemsg").hide();else if(void 0!=e[0].fstkOutLogNo){$(".errmsg").hide(),$(".truemsg").show();var e=e[0];setData(e)}else $(".errmsg").show(),$(".truemsg").hide()},error:function(e){alert("error")}})});