/****
 * 
 * 
 * 
 * ***/
//$.ajaxSetup({ xhrFields: { withCredentials: true }, crossDomain: true });

$().ready(function(){
  /**主要的全局变量**/
  var baseUrl = "http://localhost:3000";
  var log_time = new Array(5);
  var Person = []; 
  function Objcreat(sbt,rbt,unsend,message,record) //声明对象
    {
       // this.btime = btime;
        this.unsend = unsend;
        this.message = message;
        this.sbt = sbt;
        this.rbt = rbt;
        this.record = record;
    }


 
 /***标签过滤相关函数****/
  //主要的过滤函数
    function replace(str){
    var mean = /\[([\u4E00-\u9FA5]{1,5})\]/g;
     var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    str = str.replace(/[<>]/g,function(c){return {'<':'&lt','>':'&gt'}[c];});
    str = str.replace(reg, "<a target='_blank' href='$1$2'>$1$2</a>").replace(/\n/g, "<br />");
    str = str.replace(mean,function(match,group,index,origin){
       for(var i=0; i<emo_arr.length;i++){
           if(group==emo_arr[i][0]){
             return  '<img src="img/spacer.gif" class="'+emo_arr[i][1]+'">';
           }
         }
          return match;
     })
     return str;
    }
   //发送时检测内容是否为空过滤函数
     function replace_send(str){
    var mean = /\[([\u4E00-\u9FA5]{1,5})\]/g;
    str = str.replace(/[<>]/g,function(c){return {'<':'&lt','>':'&gt'}[c];});
     str = str.replace(mean,function(match,group,index,origin){
         for(var i=0; i<emo_arr.length;i++){
           if(group==emo_arr[i][0]){
             return '<img src="img/spacer.gif" class="'+emo_arr[i][1]+'">';
           }
         }
          return match;
     })
     str=str.replace(/[\s\r\n]/g,"");
     return str;
    }


  /***时间简化相关函数****/
    //接收后台的时间简化函数
     function simplify(str){
      var time_arr = new Array();
       time_arr = str.split(/[- :]/);
       return time_arr[3]+':'+time_arr[4];
     } 
     
    //历史消息的时间简化函数
     function re_simplify(str){
       var time_arr = new Array();
       time_arr = str.split(/[- :]/);
       return time_arr[1]+'月'+time_arr[2]+'日'+' '+time_arr[3]+':'+time_arr[4];
     }
     //发送消息的时间简化函数
    function formtime(str){
       var time_arr = new Array();
       time_arr = str.split(/[- :]/);
      if(time_arr[3]>=0&&time_arr[3]<10&&time_arr[4]>=0&&time_arr[4]<10){
         return '0'+time_arr[3]+':0'+time_arr[4];}
      else if(time_arr[3]>=0&&time_arr[3]<10&&time_arr[4]>=10){
         return '0'+time_arr[3]+':'+time_arr[4];
      }
      else if(time_arr[3]>=10&&time_arr[4]<10&&time_arr[4]>=0){
          return time_arr[3]+':0'+time_arr[4];
      }
      else if(time_arr[3]>=10&&time_arr[4]>=10){
         return time_arr[3]+':'+time_arr[4];
      }
    }

   //比较两个消息的时间是否超过1分钟
   function intime(str1,str2){
     var time1 = new Array();
     var time2 = new Array();
     time1 = str1.split(/[- :]/);
     time2 = str2.split(/[- :]/);
     for(var i=0; i<4; i++){
      if(time1[i]!=time2[i]){
         return false; //超过
      }
     } 
     if(time2[4]-time1[4]>1){ return false;}
     else{ return true;}  //没超过
   }
   

   //判断是否是在当前登录之后所发的消息
  function newest(str){
     var time_arr = new Array();
     time_arr = str.split(/[- :]/);
     for(var i=0; i<5; i++){
       if(log_time[i]>time_arr[i]){
       return false;
      }
     } 
    return true;
  }
   

 /***消息提醒相关函数***/
  //控制有新消息时是否发出声音提示
   var play = 1;
   $("#audio-on").on('click',function(){
     if(play == 1){
      $(this).find('i').removeClass('sound_off').addClass('sound_on').parent().find('span').text('打开声音');
       play = 0;
     }
     else{
      $(this).find('i').removeClass('sound_on').addClass('sound_off').parent().find('span').text('关闭声音');    
      play = 1;
     }

   })
   
  //有新消息时标题栏的文字闪动
    var message = {  
            time: 0,  
            title: document.title,  
            timer: null,  
            // 显示新消息提示  
            show: function () {  
                var title = message.title.replace("【　　　】", "").replace("【新消息】", "");  
                // 定时器，设置消息切换频率闪烁效果就此产生  
                message.timer = setTimeout(function () {  
                    message.time++;  
                    message.show();  
                    if (message.time % 2 == 0) {  
                        document.title = "【新消息】" + title  
                    }  


                    else {  
                        document.title = "【　　　】" + title  
                    };  
                }, 600);  
                return [message.timer, message.title];  
            },  
            // 取消新消息提示  
            clear: function () {  
                clearTimeout(message.timer);  
                document.title = message.title;  
            }  
        };  


    function bind(){  
        document.onclick = function (){  
        message.clear();  
      }; 
    } 
   function titleTip(){
      message.show();  
      bind();
  }
 

 //新消息的桌面通知 chrome的本地file不行但是ff可以
   /*
     var popNotice = function(title,message){
         if(Notification.permission == "granted"){
            var notification = new Notification(title,{
              body: message,
              icon: 'img/otherheader.jpg'
             // silent:true,
              //sound:'audio/notify.mp3'
            });
           setTimeout(function(){
             notification.close();
           },4000)
         }
       }
   
   
   function notice(title,message){
   // console.log(Notification.permission);
     if(window.Notification){
           if(Notification.permission == "granted") {
                  popNotice(title,message);
              }else if (Notification.permission != "denied") {
                  Notification.requestPermission(function (permission) {
                    popNotice(title,message);
                  });
              }
          }
         
      } */
        
  

  
  /*** 登录相关函数***/
    //获取好友列表
   function getfriend_list(){
        $.ajax({
         type:"get",
         url: baseUrl+"/getList",
         dataType:"json",
         success:function(data,textStatus){
              var chat_li = '';
              var contact_li = '';
              friend_arr =  eval(data);
              $.each(friend_arr,function(index,content){
                contact_li = '<div class="contact-item" frid="'+content._id+'" num="'+index+'" ><div class="contact-otherheader"><img src="img/otherheader.jpg"></div><div class="info"><p class="contact-otherNickname">'+replace(content.nickname)+'</p></div>';
               $("#contact-list").append(contact_li);
                 Person.push(new Objcreat);
              });
          },
         error:function(){
             alert("服务器错误");
           },
      }) 
   }
   //获取用户昵称
   function getnickname(){
       $.ajax({
        type:"get",
        url: baseUrl+"/getUserInfor",
        data: {
                id: userid
              }, 
        dataType:"json",
        success:function(data,textStatus){
          if(data.result!="failed"){
              $("#h-nickname").empty().append(replace(data.nickname));
              $("#p-nickname").empty().append(replace(data.nickname));
            }

          },
        error:function(){
            alert("服务器错误");
          },
        }) 
   }

    var userid ;
     //记住密码
    var strName = localStorage.getItem('keyName');
    var strPass = localStorage.getItem('keyPass');
         if(strName){
             $('#account').val(strName);
         }if(strPass){
             $('#password').val(strPass);
         }
         
   //登录
    function login(){ 
     var friend_arr;
     var account = $("#account").val();
     localStorage.setItem('keyName',account);
     var password = $("#password").val();
     if(account==""||(account=""&&password=="")) {
         $("#error-info").html("请输入账号!");
         return false; 
     }
     else if(password==""){
          $("#error-info").html("请输入密码!");
         return false;
     }
     else{
       
          if($('#checkbox').is(':checked')){
               localStorage.setItem('keyPass',password);
           }else{
               localStorage.setItem('keyName',account);
               localStorage.removeItem('keyPass');
            }
        
         $.ajax({
          type:"post",
          url: baseUrl+"/login",
          data:$("#login-form").serialize(),
          dataType:"json",
          success:function(data,textStatus){
             if(data.result=="success"){
              $("#login-button").text('正在登录').addClass('logining');
              var date = new Date();
              log_time = [date.getFullYear(), date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes()];            
              userid = data.userid;

              setTimeout(function(){
              $("#login-button").text('登录成功').removeClass('logining').addClass("logining_seccess");
                setTimeout(function(){
                   //切换到微信主页面
                   $("#error-info").html("");
                   $("#wx-login").css('display','none');
                   $("#wx-main").css('display','block');
                },400)
               },2500)

                //获取好友列表
               getfriend_list();
               //获取自己的昵称并显示
               getnickname();
               //登录成功后开始读取未读消息
                setTimeout(function(){
                setInterval(unread,6000); 
               },3000) 
             }   
             
            else{
             
               $("#error-info").html("帐号或密码不正确!");
            }

          },
         
          error:function(){
              $("#error-info").html("");
              alert("服务器错误");
            
          },

        }) 
        return false;
     }
   }
 

  
 /***退出登录相关函数****/
   //弹出确认对话框
    $("#logout").on('click',function(){
      $("#option-menu").hide();
      $("#confirm-mask").show().children().removeClass('confirm_dialogout').addClass('confirm_dialogin');
    })
    //取消退出
    $("#cancel").on('click',function(){
      $("#confirm-dialog").removeClass('confirm_dialogin').addClass('confirm_dialogout');
       setTimeout(function(){
          $("#confirm-mask").hide(); 
       },140)
    })
   //确认退出
    $("#sure").on('click',function(){
      $.ajax({
          type:"get",
          url: baseUrl+"/logout",
          dataType:"json",
          success:function(data,textStatus){
            $("#confirm-mask").hide(); 
            window.location.reload();//刷新页面
          },     
        }) 
     })
     //点击遮罩层取消退出
     $("#confirm-mask").click(function(event){
          var dialog = $("#confirm-dialog");  
          if(!dialog.is(event.target) && dialog.has(event.target).length === 0){ 
           $("#confirm-dialog").removeClass('confirm_dialogin').addClass('confirm_dialogout');
             setTimeout(function(){
                $("#confirm-mask").hide(); 
             },140)                                                        
                  
        }
      })  
   
 /***小部件***/
    //点击下拉菜单
    $(function () {  
      $('#option').click(function (event) {  
         //取消事件冒泡  
         event.stopPropagation();  
         //按钮的toggle,如果div是可见的,点击按钮切换为隐藏的;如果是隐藏的,切换为可见的。  
         $('#option-menu').toggle();  
     return false;
     });  
     //点击空白处隐藏弹出层，下面为消失效果
       $(document).click(function(event){
          var _con = $('#option-menu');   // 设置目标区域
          if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
            $('#option-menu').hide(); 
          }
      });
   })
    
    //意见反馈区
     $("#feedback").on('click',function(){
       $('#option-menu').hide(); 
       
        $("#feedback-mask").show().children().removeClass('dialogout').addClass('dialogin'); 
        $("body").css('overflow','hidden');    
     })

     $("#feedback-mask").click(function(event){
          var dialog = $('#feedback-dialog');  
          if(!dialog.is(event.target) && dialog.has(event.target).length === 0){ 
           $("#feedback-dialog").removeClass('dialogin').addClass('dialogout');
           setTimeout(function(){
             $("#feedback-mask").hide(); 
             $("body").css('overflow','auto');  
           },140)
                  
        }
      })
     $("#get_back").click(function(){
            $("#feedback-dialog").removeClass('dialogin').addClass('dialogout');
           setTimeout(function(){
             $("#feedback-mask").hide(); 
             $("body").css('overflow','auto');  
           },140)
     })

   
    //点击头像后弹出方框
      function Profile_animate(x,y,show){
         if(show.is(':hidden')){
         show.css({top:y,left:x}).removeClass('Profileout').show().addClass('Profilein');}
          else{
           show.css({top:y,left:x}).removeClass('Profilein').addClass('Profilescale');
            setTimeout(function(){
              show.removeClass('Profilescale');
            },140)
          } 
      }
     
      function Profile_animateout(_con,event){
         if(!_con.is(event.target) && _con.has(event.target).length === 0){ 
           _con.removeClass('Profilein').addClass('Profileout'); 
             setTimeout(function(){
              _con.hide();
             },140)        
           }
      }

      function show_Profile(target,show){
          target.on('click',function(event){
            event.stopPropagation();
            var x = event.clientX+14;
            var y = event.clientY+14;
            Profile_animate(x,y,show);

        })
         $(document).click(function(event){
             Profile_animateout(show,event);
          });

    }

     //左上角头像处
     show_Profile($("#headPortrait"),$("#myProfile"));
     //聊天窗口处
    $("#messageView").on('click','.chat-myhd',function(event){
       event.stopPropagation();
        var x = event.clientX-240;
        var y = event.clientY+10;
        Profile_animate(x,y,$("#myProfile"));
    });
    $(document).click(function(event){
             Profile_animateout($("#myProfile"),event);
     });
     $("#messageView").on('click','.chat-otherhd',function(event){
        var nickname = $("#friend-name").text();
       $('#pother-nickname').text(nickname);
       event.stopPropagation();
        var x = event.clientX+10;
        var y = event.clientY+10;
        Profile_animate(x,y,$("#otherProfile"));
    });
    $(document).click(function(event){
             Profile_animateout($("#otherProfile"),event);
     });
   
   
     
    //聊天窗口头部下拉事件    
    $("#dr_btn").on('click',function(){
      if($("#dr_box").is(':hidden')){
       $(this).removeClass("drop-btn").addClass("up-btn");
       $("#dr_box").removeClass('dropout').show().addClass('dropin');
      }
      else{
        $(this).removeClass("up-btn").addClass("drop-btn");
        $("#dr_box").removeClass('dropin').addClass('dropout');
        setTimeout(function(){
           $("#dr_box").hide();
        },200)
      }
    })


    //表情出现与隐藏
     $(function(){
      var emoji_box = $("#emoji-box");
       $("#emoji_btn").on('click',function(event){
          event.stopPropagation();  
          if(emoji_box.is(':hidden')){
           emoji_box.removeClass('upout').show().addClass('upin');
          }
          else{
            emoji_box.removeClass('upin').addClass('upout');
            setTimeout(function(){
                emoji_box.hide();
            },200)
          }
        });
       $(document).click(function(event){
              if(!emoji_box.is(event.target) &&emoji_box.has(event.target).length === 0){ // Mark 1
                 emoji_box.removeClass('upin').addClass('upout');
                    setTimeout(function(){
                        emoji_box.hide();
                    },200)          
              }
          });
      })
    //表情tab页
    $("#emoji-box a").on('click',function(){
       $(this).removeClass('unselected').addClass('selected').siblings(
        ).removeClass('selected').addClass('unselected').parent().next(
        ).children().eq($(this).index()).show().siblings().hide();
    })

   //侧边栏的tab切换
   $("#tab-chat").click(function(){
     $(this).find("i").removeClass("tab-chat-fallow").addClass("tab-chat-icon").parents("#tab-chat").siblings(
      "#tab-read").find("i").removeClass("tab-read-active").addClass("tab-read-icon").parents("#tab-read").siblings(
      "#tab-contact").find("i").removeClass("tab-contact-active").addClass("tab-contact-icon");
      $("#chat-list").show().siblings().hide();
      $("#contentView-chat").show().siblings().hide();
       $("#hint").hide();
   })
    
   $("#tab-read").click(function(){
     $(this).find("i").removeClass("tab-read-icon").addClass("tab-read-active").parents("#tab-read").siblings(
      "#tab-chat").find("i").removeClass("tab-chat-icon").addClass("tab-chat-fallow").parents("#tab-chat").siblings(
      "#tab-contact").find("i").removeClass("tab-contact-active").addClass("tab-contact-icon");
      $("#read-list").show().siblings().hide();
      $("#contentView-read").show().siblings().hide();
   })

   $("#tab-contact").click(function(){
     $(this).find("i").removeClass("tab-contact-icon").addClass("tab-contact-active").parents("#tab-contact").siblings(
      "#tab-chat").find("i").removeClass("tab-chat-icon").addClass("tab-chat-fallow").parents("#tab-chat").siblings(
      "#tab-read").find("i").removeClass("tab-read-active").addClass("tab-read-icon");
      $("#contact-list").show().siblings().hide();
      $("#contentView-info").show().siblings().hide();
   })
    
    
   //滚动条事件此处使用插件
  $('#contact-list').niceScroll({
    cursorcolor: "#404448",//#CC0071 光标颜色
    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
    cursorwidth: "10px", //像素光标的宽度
    cursorborder: "0", // 游标边框css定义
    cursorborderradius: "8px",//以像素为光标边界半径
    autohidemode: true //是否隐藏滚动条
   });
   $('#chat-list').niceScroll({
    cursorcolor: "#404448",
    cursoropacitymax: 1, 
    touchbehavior: false, 
    cursorwidth: "10px", 
    cursorborder: "0", 
    cursorborderradius: "8px",
    autohidemode: true 
   });
   $('#window-wrap').niceScroll({
    cursorcolor: "#c3c3c3",
    cursoropacitymax: 1, 
    touchbehavior: false, 
    cursorwidth: "6px", 
    cursorborder: "0", 
    cursorborderradius: "3px",
    autohidemode: true 
   });
  $("#emoji-scorll").niceScroll({
    cursorcolor: "#c3c3c3",
    cursoropacitymax: 1, 
    touchbehavior: false, 
    cursorwidth: "6px", 
    cursorborder: "0", 
    cursorborderradius: "3px",
    autohidemode: true 
   });
    $("#edite_val").niceScroll({
    cursorcolor: "#c3c3c3",
    cursoropacitymax: 1, 
    touchbehavior: false, 
    cursorwidth: "6px", 
    cursorborder: "0", 
    cursorborderradius: "3px",
    autohidemode: true 
   });

 /***用户信息相关函数***/
    //查看用户信息
     $("#personal").on('click',function(){
       var table = "";
       $('#option-menu').hide();
         //加载用户信息
        $.ajax({
                type:"get",
                url: baseUrl+"/getUserInfor",
                data: {
                        id: userid
                      }, 
                dataType:"json",
                success:function(data,textStatus){
                  if(data.result!="failed"){
                     table = '<tr><th class="info-item">昵称：</th><td class="info-content" id="Name">'+replace(data.nickname)+'</td></tr></tr> <th class="info-item" >年龄：</th><td class="info-content" id="Age">'+data.age+'</td></tr></tr><th class="info-item">邮箱：</th><td class="info-content" id="Mail">'+data.mailbox+'</td></tr></tr><th class="info-item">地址：</th><td class="info-content" id="Address">'+data.address+'</td></tr></tr><th class="info-item introduction" valign="top">自我介绍：</th><td class="info-content introduction" valign="top" id="Introduction">'+replace(data.introduction)+'</td></tr>';
                     $("#personal-info-table").append(table);
                    }
                   else{
                    var html = '<p class="result">请登录后查看</p>';
                    $("#personal-info-table").append(html);
                   }
                  },
                error:function(){
                    //alert("服务器错误");
                  },
            })  
      $("#personalInfo-mask").show().children("#personal-info").show().removeClass('dialogout').addClass('dialogin').next().hide().removeClass('dialogout');

    })

     //关闭查看用户信息
      $("#close").on('click',function(){      
        $("#personal-info").removeClass('dialogin').addClass('dialogout');
        setTimeout(function(){
          $("#personalInfo-mask").hide();
          $("#personal-info-table").empty();
          $(".wrong").hide().next(".right").hide();
          $("#self_introduce").removeClass('empty');
          $("#modify-info-form").show().next().hide();
          $("#waiting").show().next().hide()
          $("#modify-info-form")[0].reset();
        },120)
        
     })
     //点击遮罩层关闭
     $("#personalInfo-mask").click(function(event){
          var _con =  $("#personal-info");  
          var con =   $("#modify-info");
          if(!_con.is(event.target)&&!con.is(event.target)&& _con.has(event.target).length === 0&&con.has(event.target).length === 0){ 
             $("#personal-info").removeClass('dialogin').addClass('dialogout');
            setTimeout(function(){
              $("#personalInfo-mask").hide();
              $("#personal-info-table").empty();
              $(".wrong").hide().next(".right").hide();
              $("#self_introduce").removeClass('empty');
              $("#modify-info-form").show().next().hide();
              $("#waiting").show().next().hide()
              $("#modify-info-form")[0].reset();
            },150)
            $("#modify-info").addClass('dialogout');
                setTimeout(function(){
                $("#personalInfo-mask").hide();
                $("#personal-info-table").empty();
                $(".wrong").hide().next(".right").hide();
                $("#self_introduce").removeClass('empty');
                $("#modify-info-form").show().next().hide();
                $("#waiting").show().next().hide()
                $("#modify-info-form")[0].reset();
              },150)
            
           }
      });
      //修改用户信息
      $("#modify_btn").on('click',function(){
          var maxlength = 80;
          $("#nickname").val($("#Name").text());
         $("#age").val($("#Age").text());
         $("#address").val($("#Address").text());
         $("#mail").val($("#Mail").text());
         $("#self_introduce").val($("#Introduction").text());
         $("#personal-info").hide().next().show();
         $("#count_num").text(maxlength-$("#self_introduce").val().length);
    })
     //关闭修改个人信息
     $("#stop").on('click',function(){
        $("#modify-info").addClass('dialogout');
          setTimeout(function(){
          $("#personalInfo-mask").hide();
           $("#personal-info-table").empty();
          $(".wrong").hide().next(".right").hide();
          $("#self_introduce").removeClass('empty');
          $("#modify-info-form").show().next().hide();
          $("#waiting").show().next().hide()
          $("#modify-info-form")[0].reset();
        },150)
       
        
     })
    //返回查看用户信息
     $("#go_back").on('click',function(){
       $("#personal-info").removeClass('dialogin').show().next().hide();
    })
    
    //修改信息表单验证
     $(".modify-item").blur(function(){
      var n = /^[1-9]+[0-9]*]*$/;
        if($(this).is('#nickname')){
           if( replace_send(this.value)=="" || ( this.value!="" && !/^[0-9a-zA-Z\u4e00-\u9fa5_]{1,8}$/.test(this.value) ) ){
                   $(this).next(".wrong").show().next(".right").hide(); 
                }
            else{
                   $(this).next(".wrong").hide().next(".right").show();
                }
         }  
           
         if($(this).is('#age')){
            if(n.test(this.value)>0){ $(this).next(".wrong").hide().next(".right").show(); }
            if(!n.test(this.value)||replace_send(this.value) == ""){$(this).next(".wrong").show().next(".right").hide();}
         }
         if($(this).is('#mail')){
             if( replace_send(this.value)=="" || ( this.value!="" && !/.+@.+\.[a-zA-Z]{2,4}$/.test(this.value) ) ){
                   $(this).next(".wrong").show().next(".right").hide(); 
                }else{
                   $(this).next(".wrong").hide().next(".right").show();
                }
         }
         if($(this).is('#address')){
             if(replace_send(this.value)!=""){$(this).next(".wrong").hide().next(".right").show();}
              else {$(this).next(".wrong").show().next(".right").hide(); }
         }
     })
     $("#self_introduce").keyup(function(){
       var maxlength = 80;
       var len = $(this).val().length;
       var count_num = $("#count_num");
       count_num.text(maxlength-len);
      if(parseInt(count_num.text())<0){
         count_num.text('0');
         var val = $(this).val().substring(0,80);
         $(this).val(val);
      } 
     })
      $("#self_introduce").blur(function(){
        if(replace_send($(this).val())=="") {
          $(this).addClass("empty");
        }
        else{$(this).removeClass("empty");}
      })
      
      //提交表单
      $("#submit_btn").on('click',function(){
        var nickname = $("#nickname").val();
        var age = $("#age").val();
        var address =  $("#address").val();
        var introduction =  $("#self_introduce").val();
        var mailbox = $("#mail").val();
        var count = 0;
      if(replace_send(nickname)!=""&&replace_send(age)!=""&&replace_send(address)!=""&&replace_send(introduction)!=""&&replace_send(mailbox)!=""){
            $(".wrong").each(function(){
                if($(this).is(':visible')){count=count+1;}
            })
            if(count==0&&$(".empty").length==0){
                   $("#modify-info-form").hide().next().show();
                   $.ajax({
                        type:"post",
                        url: baseUrl+"/updateUserInfor",
                        data: {
                                nickname,
                                age,
                                address,
                                introduction,
                                mailbox
                              }, 
                        dataType:"json",
                        success:function(data,textStatus){

                          if(data.result!="failed"){ 
                              setTimeout(function(){
                                $("#waiting").hide().next().show();
                               $("#modify-info-form")[0].reset();
                             },2000)
                             getnickname();//及时改变用户的昵称
                           }
                           else{ $("#waiting").hide().next().empty().append('<p class="result">修改个人信息失败,请重新登录</p>').show();}
                         }, 
                         error:function(){
                            alert("服务器错误");
                          }
                        
                 })
               
            }
        }
    })

     

   
    //发送表情
    $(".face").on('click',function(){
      var mean = $(this).attr("title");
      var code = '['+mean+']';
      $("#edite_val").val( $("#edite_val").val()+code);
    })

/***加载历史记录(该历史记录为登录前)相关函数***/
  //动态添加气泡对话框
   function bubble(i,time,message){
     var view = $('#record');
     var otherhtml = "";
     var myhtml = "";
     if(time!=""){
      if(i=='my'){
         myhtml='<div class="chat-box-me chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+time+'</div></div><img class="chat-myhd header" src="img/myheader.jpg"><div class="chat-bubble-me bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';
         view.append(myhtml);  
      }
      if(i=='other'){
          otherhtml='<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+time+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';
          view.append(otherhtml);
      }
    }
    else if(time==""){
      if(i=='my'){
         myhtml='<div class="chat-box-me chat-box clrfix"><img class="chat-myhd header" src="img/myheader.jpg"><div class="chat-bubble-me bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';
         view.append(myhtml);  
      }
      if(i=='other'){
          otherhtml='<div class="chat-box-other chat-box clrfix"><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';
          view.append(otherhtml);
      }
    }
 }
    
   //加载聊天记录并显示
    $("#record_btn").on('click',function(){
      var view = $('#record');
      var frid;
      var number;
      var msg_arr;
      var mark = 0;
      var mbefore;
      var hbefore;
       $(".chat-item").each(function(){
            if($(this).hasClass('sele_chat')){             
              frid = $(this).attr("frid");
              number = Number($(this).attr("num"));
               }
            })
        if(view.is(":hidden")){
           
            $("#sendMessage_btn").removeClass('able').addClass('disable');
           
        if(Person[number].record==undefined){
          $.ajax({
                type:"get",
                url: baseUrl+"/getChatRecord" ,
                data: {
                        id: frid
                      }, 
                dataType:"json",
                success:function(data,textStatus){
                  if(data.result!="failed"){
                   msg_arr = eval(data);
                   if(msg_arr.length!=0){
                      $.each(msg_arr,function(index,val){
                        if(!newest(val.date)){ //历史记录
                          mark = 1;
                            if(val.sender==frid){
                              if(hbefore == undefined){
                                 bubble('other',re_simplify(val.date),val.content);
                                 hbefore = val.date;
                              }
                              else{
                                 if(intime(hbefore,val.date)){
                                  bubble('other','',val.content);
                                   hbefore = val.date;
                                 }
                                 else{
                                  bubble('other',re_simplify(val.date),val.content);
                                   hbefore = val.date;
                                 }
                              }
                            }
                            else if(val.sender==userid){
                               if(mbefore == undefined){
                                 bubble('my',re_simplify(val.date),val.content);
                                 mbefore = val.date;
                               }
                               else{
                                 if(intime(mbefore,val.date)){
                                  bubble('my','',val.content);
                                  mbefore = val.date;
                                 }
                                 else{
                                  bubble('my',re_simplify(val.date),val.content);
                                   mbefore = val.date;
                                 }
                              }
                            }
                          }
                          else if(mark==0){
                           view.append('<p id="no_history">无历史记录</p>');
                          }
                          
                      })
                      $("#window-wrap").scrollTop(view.height());                  
                    }
                    else{
                      view.append('<p id="no_history">无历史记录</p>');
                    }
                  }
                },
                
             }) 
             view.show().siblings().hide(); 
            
          }
          else{
             view.append(Person[number].record);
               view.show().siblings().hide(); 
               $("#window-wrap").scrollTop(view.height());
          }
        }
        else{
           Person[number].record = view.html();
          $("#sendMessage_btn").removeClass('disable').addClass('able');
           view.hide().empty().siblings("#messageView").show();
           $("#window-wrap").scrollTop($("#messageView").height()); 
        }
    })

    //点击侧边栏最近联系人时加载当前聊天记录
     $("#chat-list").on('click',".chat-item",function(){
      var clicked = $(this);
      var  fri_nickname = clicked.find(".chat-otherNickname").text();
      var frid = clicked.attr("frid");
      var number = Number(clicked.attr("num"));
     
      if(clicked.hasClass('sele_chat')){return false;} //如果点击的已经是选中的，就不执行下面的了
      else{
       clicked.find(".amount_wrap").empty();
       clicked.addClass('sele_chat').find("p").css('color','#fff').parents(".chat-item").siblings().removeClass('sele_chat').find(".chat-time").css('color','#6b6f7c').parent().find(".info-preview").css('color',' #989898');
       $("#friend-name").text(replace(fri_nickname)).show().next().css('display','inline-block');
       $("#unchat").hide().siblings("#messageView").empty();
       $('#record').hide().empty().siblings("#messageView").show();

      if(Person[number].unsend!=undefined){
        $("#edite_val").val(Person[number].unsend);
      }
      else{$("#form")[0].reset();}
       $("#contentView-chat-send").show(); 
       $("#sendMessage_btn").removeClass('disable').addClass('able');
         //加载当前聊天记录
       if(Person[number].message!=undefined){
            $("#messageView").append(Person[number].message);
             $("#window-wrap").scrollTop($("#messageView").height());
          }
      else{$("#messageView").append('<p id="empty_stil">暂时没有新信息</p>');   }
        }
        
    })
   
   
  //查看所有联系人且点击
    $("#contact-list").on('click',".contact-item",function(){
       var html; 
       var frid = $(this).attr("frid");
       var fri_nickname = $(this).find(".contact-otherNickname").text();
       $(this).addClass('sele_chat').siblings().removeClass('sele_chat');
       $("#frid-age").empty().parent().next().find('p').empty().parent().next().find('p').empty();
       $("#contentView-info-bd-inital").hide().prev().show().find(".info-bd-nickname p").text(fri_nickname);
       //加载该用户的信息
        $.ajax({
                type:"get",
                url: baseUrl+"/getUserInfor",
                data: {
                        id:frid
                      }, 
                dataType:"json",
                success:function(data,textStatus){
                  if(data.result!="failed"){
                      $("#frid-age").append(data.age).parent().next().find('p').append(data.mailbox).parent().next().find('p').append(data.address);
                    }
                   else{
                    html = '<p class="result">请登录后查看</p>';
                    $("#info-bd-nickname-friInfor").append(html);
                   }
                  },
                error:function(){
                    //alert("服务器错误");
                  },
            })  
      
    })
  //在这里点击发消息的时候
    $("#send").on('click',function(){
         var frid ;
         var number;
         var selected ;
         var mark = 0;
         var fri_nickname;
         var chat_li = '';
         //var person;
          $("#hint").hide();
          $(".contact-item").each(function(){
            if($(this).hasClass('sele_chat')){
              frid = $(this).attr('frid');
              number = $(this).attr("num");
              fri_nickname = $(this).find(".contact-otherNickname").text();
           }
         })
          $("#tab-chat").find("i").removeClass("tab-chat-fallow").addClass("tab-chat-icon").parents("#tab-chat").siblings(
          "#tab-contact").find("i").removeClass("tab-contact-active").addClass("tab-contact-icon");
          $("#contact-list").hide();
          //动态向chat-list添加联系人
            if($(".chat-item").length>0){
             $(".chat-item").each(function(){
               if($(this).attr("frid")==frid)
                  {  
                    selected =$(this).clone(true);
                    $(this).remove();
                    $("#chat-list").prepend(selected); 
                    mark = 1;
                   if(Person[Number(number)].unsend!=undefined){
                      $("#edite_val").val(Person[Number(number)].unsend);
                    }
                    else{$("#form")[0].reset();}
                  }
                })
              }
              if($(".chat-item").length>0&&mark==0||$(".chat-item").length==0){
               if(Person[Number(number)].unsend!=undefined){
                    $("#edite_val").val(Person[Number(number)].unsend);
                  }
                else{$("#form")[0].reset();}
                chat_li = '<div class="chat-item" frid="'+frid+'"  num="'+number+'"><p class="chat-time"></p><div class="chat-otherheader"><img src="img/otherheader.jpg"></div><div class="amount_wrap"></div><div class="info"><p class="chat-otherNickname">'+replace(fri_nickname)+'</p><p class="info-preview"></p></div></div>';
                $("#chat-list").prepend(chat_li);
                selected = $(".chat-item:first");
                }
         $("#chat-list").show();

          selected.find(".amount_wrap").empty();
          selected.addClass('sele_chat').find("p").css('color','#fff').parents(
          ".chat-item").siblings().removeClass('sele_chat').find(".chat-time").css(
          'color','#6b6f7c').parent().find(".info-preview").css('color',' #989898'); 

          $("#contentView-chat").show().siblings().hide();
          $("#friend-name").text(fri_nickname).show().next().css('display','inline-block');
          $("#unchat").hide().siblings("#messageView").empty();
          $('#record').hide().empty().siblings("#messageView").show();
          $("#contentView-chat-send").show();
          $("#sendMessage_btn").removeClass('disable').addClass('able');
          //加载当前聊天记录
         if(Person[Number(number)].message!=undefined){
            $("#messageView").append(Person[Number(number)].message);
            $("#window-wrap").scrollTop($("#messageView").height());
          }
         else{$("#messageView").append('<p id="empty_stil">暂时没有新信息</p>');}

    })
 
 /**侧边栏右键事件**/
   //鼠标右键单击侧边栏的可以选择移除与该人的聊天
   $(function(){ 
     var close_item;
     var temp;
      $("#chat-list").bind('contextmenu','.chat-item',function(){
        return false;
     })
       $("#contexMenu").bind('contextmenu',function(){
        return false;
     })
    
      $("#chat-list").on('mousedown',".chat-item",function(ev){
         close_item = $(this);
         if(ev.which==3){
         $("#contexMenu").show().css({top: ev.clientY,left: ev.clientX});
        }              
     })
     $(document).click(function(event){
            var _con = $("#contexMenu");   
         if(!_con.is(event.target) && _con.has(event.target).length === 0){ 
           _con.hide();        
         }
      })
     $("#clear").on('click',function(){
      if(close_item.hasClass('sele_chat')){
         close_item.remove();
         $("#friend-name").text("").next().hide();
         $("#unchat").show().siblings("#messageView").empty();
         $('#record').hide().empty();
         $("#form")[0].reset(); 
        $("#contentView-chat-send").hide();
        $("#sendMessage_btn").removeClass('disable').addClass('able');
       }
       else{
          close_item.remove();
       }
       $("#contexMenu").hide();
     })
    
     $("#stick").on('click',function(){
         temp = close_item.clone(true);
         close_item.remove();
         $("#chat-list").prepend(temp); 
         $("#contexMenu").hide();
     })

  }) 

    
  /****聊天窗口点击发送消息函数***/
    function send(){ 
      if($("#messageView").is(":visible")){   
         var receiverid ;
         var select_item; 
         var number;
         $(".chat-item").each(function(){
            if($(this).hasClass('sele_chat')){
              select_item = $(this);
              receiverid = $(this).attr("frid");
              number = Number($(this).attr("num"));
           }
         })
         var message = $("#edite_val").val();
         var checkmessage = replace_send($("#edite_val").val());
         if(checkmessage!=""){
          var html =  "";
          var time;
          var corrent = new Date();
          var loading = '<i class="loading"></i>';
          var fail = '<i class="icon_fail">!</i>';
          var temp;
           $("#empty_stil").remove();       
          time = corrent.getFullYear()+'-'+corrent.getMonth()+'-'+corrent.getDate()+' '+corrent.getHours()+':'+corrent.getMinutes()+':'+corrent.getSeconds();
          if(Person[number].sbt==undefined){
           html = '<div class="chat-box-me"><div class="chat-time-wrap"><div class="chat-sp_time">'+formtime(time)+'</div></div><img class="chat-myhd header" src="img/myheader.jpg"><div class="chat-bubble-me bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';    
           $("#messageView").append(html);
           Person[number].sbt = time;
          } 
          else{
            if(intime(Person[number].sbt,time)){
               html = '<div class="chat-box-me"><img class="chat-myhd header" src="img/myheader.jpg"><div class="chat-bubble-me bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';    
               $("#messageView").append(html);
              Person[number].sbt = time;
            }
            else{
               html = '<div class="chat-box-me"><div class="chat-time-wrap"><div class="chat-sp_time">'+formtime(time)+'</div></div><img class="chat-myhd header" src="img/myheader.jpg"><div class="chat-bubble-me bubble"><pre class="chat-content">'+replace(message)+'</pre></div></div>';    
               $("#messageView").append(html);
              Person[number].sbt = time;
            }
          }
           $("#form")[0].reset(); 
          Person[number].unsend= "";
          $("#window-wrap").scrollTop($("#messageView").height());
             //发送消息时使侧边栏的消息列表重置并置顶
           select_item.find(".chat-time").text(formtime(time)).css('color','#fff').parent().find(".info-preview").html(replace(message)).css('color','#fff');
           temp = select_item.clone(true);
           select_item.remove();
           $("#chat-list").prepend(temp);
            $(".chat-box-me:last").find(".chat-bubble-me").append(loading);
          
              $.ajax({
                type:"post",
                url: baseUrl+"/sendContent",
                data: {
                        receiver:receiverid,
                        content:message
                      }, 
                dataType:"json",

                success:function(data,textStatus){
                
                 setTimeout(function(){
                  $(".loading").remove();
                  Person[number].message = $("#messageView").html();
                  },60)
                 
                  if(data.result=="failed"){
                     $(".chat-box-me:last").find(".chat-bubble-me").append(fail);

                  }            
                },
                error:function(){
                    $(".loading").remove();
                    $(".chat-box-me:last").find(".chat-bubble-me").append(fail);
                  },
           })    
       } 
      }
   } 
  //将未发送的消息草稿保存起来
   $("#edite_val").blur(function(){
        var number;
        $(".chat-item").each(function(){
            if($(this).hasClass('sele_chat')){             
              receiverid = $(this).attr("frid");
              number = Number($(this).attr("num"));
           }
        })
       Person[number].unsend = $("#edite_val").val();
   })
    
  //按发送按钮发送消息
 $("#sendMessage_btn").on('click',function(){ send(); })

  //按登陆按钮登录
   $("#login-button").on('click',function(){ login(); return false; })
  

  /****键盘事件****/
   //enter发送或登录
   $(document).keypress(function(e){
        if (e.keyCode == 13){
          if($("#wx-login").is(":visible")){
            login();
          }
          else{send();}
          return false;
        }
     })
     //按Ctrl+enter换行
    $("#edite_val").keydown(function(event){
      if (event.ctrlKey && event.keyCode == 13){  
         $("#edite_val").val( $("#edite_val").val()+'\n');
          return false; 
        }  
     })
 
  
  
/***接收未读消息函数***/
   function unread(){
         var unread_arr ;
         var num = "";
         var otherhtml = "";
         var chat_li = "";
         var temp;
         var count;
         var mark = 0;
         var fri_nickname;
         var frid;
         var number;
         var wait;
        $.ajax({
             type:"get",
             url: baseUrl+"/getUnreadChatRecord",
             dataType:"json",
             success:function(data,textStatus){
               if(data.result!="failed"){
                unread_arr = eval(data);
                if(unread_arr.length>0){
                  $("#empty_stil").remove();
                  if($("#chat-list").is(':hidden')){ $("#hint").show();}
                  if(play==1){$('#notify')[0].play();}
                  titleTip();
                  $.each(unread_arr,function(index,val){
                    if($(".chat-item").length>0){   //若消息列表中有chat-item
                        $(".chat-item").each(function(){
                          if($(this).attr("frid")==val.sender){
                              wait = $(this);
                              number = wait.attr("num");
                              fri_nickname = $(this).find(".chat-otherNickname").text();
                              mark = 1;
                              if(wait.hasClass('sele_chat')){
                                
                                //最新消息直接显示在对话框中
                                 if(Person[Number(number)].rbt==undefined){
                                   otherhtml = '<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+simplify(val.date)+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                    $("#messageView").append(otherhtml);
                                  Person[Number(number)].rbt = val.date;
                                  } 
                                 else{
                                   if(intime(Person[Number(number)].rbt,val.date)){
                                     otherhtml = '<div class="chat-box-other chat-box clrfix"><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                    $("#messageView").append(otherhtml);                               
                                    Person[Number(number)].rbt = val.date;
                                   }
                                   else{
                                     otherhtml = '<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+simplify(val.date)+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                    $("#messageView").append(otherhtml);
                                   Person[Number(number)].rbt = val.date;
                                   }

                                }
                                Person[Number(number)].message = $("#messageView").html();
                                $("#window-wrap").scrollTop($("#messageView").height());
                                wait.find(".chat-time").empty().append(simplify(val.date));
                               wait.find(".info-preview").empty().append(replace(val.content));  
                             }
                             else{
                               //如果没有打开相应的对话框
                              // notice(fri_nickname,replace(val.content));
                               wait.find(".chat-time").empty().append(simplify(val.date));
                               wait.find(".info-preview").empty().append(replace(val.content));             
                               if(wait.find(".info-amount").length==0){   
                               count = 1;                   
                               num = '<i class="info-amount">'+count+'</i>';
                               wait.find(".amount_wrap").empty().append(num);
                               } 
                              else{
                              count = Number( wait.find(".amount_wrap").text()) + 1;
                              num = '<i class="info-amount">'+count+'</i>';
                              wait.find(".amount_wrap").empty().append(num);
                               }
                              if(Person[Number(number)].rbt==undefined){
                                 otherhtml = '<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+simplify(val.date)+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                Person[Number(number)].rbt = val.date;
                                } 
                             else{
                                 if(intime(Person[Number(number)].rbt,val.date)){
                                   otherhtml = '<div class="chat-box-other chat-box clrfix"><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';                              
                                  Person[Number(number)].rbt = val.date;
                                 }
                                 else{
                                   otherhtml = '<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+simplify(val.date)+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                 Person[Number(number)].rbt = val.date;
                                 
                                 }
                              }
                              if(Person[Number(number)].message==undefined){
                               Person[Number(number)].message = otherhtml;
                              }
                              else{ Person[Number(number)].message =  Person[Number(number)].message + otherhtml; }
                            }
                            temp = wait.clone(true);
                            wait.remove();
                            $("#chat-list").prepend(temp); //置顶
                            
                         } //循环了一圈chat-item
                      })
                    }
                     if(($(".chat-item").length>0&&mark==0)||$(".chat-item").length==0){
                         
                         $(".contact-item").each(function(){
                            if($(this).attr("frid")==val.sender){
                              frid = $(this).attr('frid');
                              number = $(this).attr('num');
                              fri_nickname = $(this).find(".contact-otherNickname").text();
                           }
                         })
                         chat_li = '<div class="chat-item" frid="'+frid+'" num="'+number+'"><p class="chat-time"></p><div class="chat-otherheader"><img src="img/otherheader.jpg"></div><div class="amount_wrap"></div><div class="info"><p class="chat-otherNickname">'+fri_nickname+'</p><p class="info-preview"></p></div></div>';
                         $("#chat-list").prepend(chat_li);
                          wait = $(".chat-item:first");
                          wait.find(".chat-time").empty().append(simplify(val.date));
                          wait.find(".info-preview").empty().append(replace(val.content));             
                          if(wait.find(".info-amount").length==0){   
                              count = 1;                   
                              num = '<i class="info-amount">'+count+'</i>';
                              wait.find(".amount_wrap").empty().append(num);
                           } 
                         else{
                             count = Number(wait.find(".amount_wrap").text()) + 1;
                             num = '<i class="info-amount">'+count+'</i>';
                             wait.find(".amount_wrap").empty().append(num);
                          }
                          // notice(fri_nickname,replace(val.content));
                          if(Person[Number(number)].rbt==undefined){
                                 otherhtml = '<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+simplify(val.date)+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                Person[Number(number)].rbt = val.date;
                                } 
                             else{
                                 if(intime(Person[Number(number)].rbt,val.date)){
                                   otherhtml = '<div class="chat-box-other chat-box clrfix"><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';                              
                                  Person[Number(number)].rbt = val.date;
                                 }
                                 else{
                                   otherhtml = '<div class="chat-box-other chat-box clrfix"><div class="chat-time-wrap"><div class="chat-sp_time">'+simplify(val.date)+'</div></div><img class="chat-otherhd header" src="img/otherheader.jpg"><div class="chat-bubble-other bubble"><pre class="chat-content">'+replace(val.content)+'</pre></div></div>';
                                 Person[Number(number)].rbt = val.date;
                                 
                                 }
                              }
                               if(Person[Number(number)].message==undefined){
                                   Person[Number(number)].message = otherhtml;
                                  }
                            else{ Person[Number(number)].message =  Person[Number(number)].message + otherhtml; }

                       }

                       mark = 0; //mark归0，继续下一个循环
                  }) 
                  
                }
              }
              else if(data.result=="failed"&&data.reason=="未登录或网络连接断开"){
                window.location.reload();//刷新页面，重新登录 
              }
            },

      })    
     
   } 
    

})
/************/