# 优酷和腾讯的视频播放器聚合

## 使用
引入依赖
```html

    <script src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="//player.youku.com/jsapi"></script>
    <script src="//vm.gtimg.cn/tencentvideo/txp/js/txplayer.js"></script>
    <script src="../dist/videoCreator.js"></script>
    
```
初始化
```js
var vid = "XMzU4MzM3ODI4NA==";
    var option = {
            selector: 'video2', //视频div id
            vid: vid, //视频id
            vid_from: 'youku',
            dialogPlayer: true,
            client_id: 'your client id',
            trigger: "#video2",
            events: {
                ready(){
                    // console.log('ready')
                    v.on('play', ()=>{
                        // console.log('play2')
                    })
                    v.on('timeupdate', (vid, t)=>{
                        // console.log('timeupdate',vid, t)
                    })
                    v.on('pause', ()=>{
                        // console.log('puase')
                    })
                },
                play: function () {
                    // video_fixed.sync($('#' + option.selector), obj);
                    // console.log('play' , this)
                },
                pause(){
                    // console.log('pause')
                },
                end(){
                    // console.log('end')
                },
                volumeChange(){
                    // console.log('volumeChange')
                }
            }
        }
    var v = new videoCreator(option);
```

## options

* selector 容器id
* vid 视频id
* vid_from 视频来源 yk|tx
* dialogPlayer 是否弹窗播放
* client_id 优酷client_id
* trigger 触发播放的元素
* events 事件

## methods

* play 播放
* pause 暂停
* seekTo(t) 跳转到指定时间 t 单位秒
* getCurrentTime 获取当前播放时间
* on 事件监听
* off 事件移除
* once 事件监听一次
* emit 触发事件

## 可选事件

* timeupdate
* ready 
* volumeChange  tx
* vidChange tx
* end
* play
* pause
* loading

