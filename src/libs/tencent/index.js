import videoControl from '../videoControl/index';
import $ from 'jQuery';
const blur_str = '-webkit-filter:blur(10px);-moz-filter:blur(10px);-o-filter:blur(10px);-ms-filter:blur(10px);filter:blur(10px);'



class tx_video_creator extends videoControl {
    constructor(option) {
        super(option.vid, option.playStopOther);
        this.option = option;
        this.v = null;
        // 初始化重置一些样式
var style = document.createElement('style');

style.innerHTML = [
    // 腾讯视频自定义海报  取消覆盖整个窗口 改为 缩放
    ".txp_poster {background-size: contain !important;}"
].join('')

$('head').append(style);
        if (option) {
            this.container = $('#' + option.selector);
            this.option = option;
            this.initUserEvent()
            this.init();
            this.initPlayerEvent();
        }
    }
    initUserEvent() {
        for (var key in this.option.events) {
            if (this.option.events.hasOwnProperty(key)) {
                // events[key] = this.option.events[key]
                this.on(key, this.option.events[key])
            }
        }
    }
    initPlayerEvent() {
        let player = this.v;
        let container = this.container;
        let initVideoPlayIcon = ()=>{
            container.append('<svg class="video_icon" viewBox="0 0 100 100" style="position: absolute; z-index: 3; width: 60px; height: 60px; top: 50%; left: 50%; margin-left: -30px; margin-top: -50px">  <circle cx="50" cy="50" r="50" style="fill:#222;fill-opacity:0.75"></circle>   <path transform="translate(36, 33)" d="M0.6,2C0.6,2,0,3.5,0,16.9C0,30.3,0.6,32,0.6,32c0,1.5,1.6,2.5,2.9,1.8c0,0,3-0.5,15.2-6.6c12.2-6.1,14.2-8.4,14.2-8.4c1.5-0.7,1.5-2.8,0-3.6c0,0-3.3-3.1-14.2-8.6C7.9,1.1,3.5,0.2,3.5,0.2C2.1-0.5,0.6,0.5,0.6,2z" style="   fill:#fff;"></path></svg>');
            container.find('.video_icon').on( 'click', ()=>{
                container.find('.video_icon').hide()
                this.play()
            })
        }

        let initTimeupdate = (e) => {
            player.on('timeupdate', function (e) {
                var t = e.currentTime;
                if (t === undefined) {
                    t = this.v.getCurrentTime();
                }
                try {
                    this.emit('timeupdate', vid, t)
                } catch (error) { }
            })
        }

        if (player.getPlayerState) {
            this.emit('ready')
            if (device == "pc") {
                initVideoPlayIcon()
            }
            initTimeupdate();
        }

        this.on('play', () => {
            container.find('.video_icon').hide();
        })
        this.on('pause', () => {
            container.find('.video_icon').show();
        })
        player.on('ready', ()=> {
            this.emit('ready')
            if (device == "pc") {
                initVideoPlayIcon()
            }
            var poster = this.v.getPoster();
            container.find('.txp_poster').html('<div style="overflow: hidden;"><img style="' + blur_str + 'width: 100%; height: 100%" src="' + poster + '"></div> <img style="position: absolute; top: 0;width: 100%; height: 100%; left: 0;object-fit: contain" src="' + poster + '">')
        });
        initTimeupdate();
        player.on('volumeChange', (option) => {
            this.emit('volumeChange', option)
        });
        player.on('vidChange', vid => {
            this.emit('vidChange', option)
        });
        player.on('playStateChange', (state) => {
            let s = state;
            if (typeof s != 'number') {
                s = s.state;
            }
            //state的状态：
            // -1（未开始） 
            // 0（已结束） end
            // 1（正在播放） play
            // 2（已暂停） pause
            // 3（正在缓冲） loading
            switch (s) {
                case 0:
                    //结束
                    this.emit('end');
                    break;
                case 1:
                    this.emit('play');
                    break;
                case 2:
                    this.emit('pause');
                    break;
                case 3:
                    this.emit('loading');
                    break;
            
                default:
                    break;
            }
            
        });
        player.on('error', function (e) {
            this.emit('error', e);
        })

    }
    init() {
        let { selector, poster, vid, autoplay } = this.option
        // this.reg(this.option.vid, events);
        this.v = new Txplayer({
            containerId: selector,
            vid: vid,
            width: '100%',
            height: "100%",
            poster: poster,
            autoplay: autoplay
        });
    }
    pause() {
        this?.v?.pause();
    }
    play() {
        this?.v?.play();
    }
    getCurrentTime() {
        return this.v.getCurrentTime()
    }
    getTotalTime() {
        return this.v.getDuration()
    }
    seekTo(t) {
        if (!isNaN(t)) {
            this.v.seekTo(t);
            // this.emit('seekTo', t)
        }
    }
}

export default tx_video_creator