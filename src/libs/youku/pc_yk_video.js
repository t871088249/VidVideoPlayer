import videoControl from '../videoControl/index';
import $ from 'jQuery';

console.log($)
// 优酷视频 PC 结构创建
function _hidePoster(selector) {
    selector.find('.video_icon,.video_poster').fadeOut();
}
function _showPoster(selector) {
    selector.find('.video_icon').show();
    selector.find('.video_poster').fadeIn();
}
function _createPoster(selector, poster) {

    console.log(selector)
    if ('static' == selector.css('position')) {
        selector.css('position', 'relative');
    }

    if (poster) {
        var str = "<div class=\"video_poster\" style=\"overflow: hidden; width: 100%;height: 100%\"><div style=\"overflow: hidden; width: 100%;height: 100%\">\n                    <img style=\"width: 100%; height: 100%; object-fit: cover;background: #000;".concat(blur_str, "\" src=\"").concat(poster, "\">\n                </div>\n                <img style=\"width: 100%; height: 100%; object-fit: contain;position: absolute; left: 0 ; top:0\" src=\"").concat(poster, "\">\n            </div>\n            ");
        selector.append('<svg class="video_icon" viewBox="0 0 100 100" style="position: absolute; z-index: 1; width: 60px; height: 60px; top: 50%; left: 50%; margin-left: -30px; margin-top: -50px">  <circle cx="50" cy="50" r="44" style="fill:#222;fill-opacity:0.75"></circle>   <path transform="translate(36, 33)" d="M0.6,2C0.6,2,0,3.5,0,16.9C0,30.3,0.6,32,0.6,32c0,1.5,1.6,2.5,2.9,1.8c0,0,3-0.5,15.2-6.6c12.2-6.1,14.2-8.4,14.2-8.4c1.5-0.7,1.5-2.8,0-3.6c0,0-3.3-3.1-14.2-8.6C7.9,1.1,3.5,0.2,3.5,0.2C2.1-0.5,0.6,0.5,0.6,2z" style="   fill:#fff;"></path></svg>')
        selector.append(str);
    } else {
        selector.append('<div class="video_poster_null" style="width: 100%; height: 100%;position: absolute; z-index: 100;left: 0 ; top: 0; cursor: pointer " ></div>');
    }
}

class pc_yk_video  extends videoControl{
    constructor(option) {
        super(option.vid, option.playStopOther);
        this.option = option
        if (option.client_id === undefined) {
            throw new Error('client_id is required!')
        }
        this.video_option = {
            vid: option.vid,
            styleid: '0',
            client_id: option.client_id,
            newPlayer: true,
        }
        if (option.poster) {
            this.video_option = option.poster
        }
        this.initUserEvent(option)
        this.initPcEvent(option)
        this.init(option)
    }
    initUserEvent(option) {
        for (var key in option.events) {
            if (option.events.hasOwnProperty(key)) {
                // events[key] = this.option.events[key]
                this.on(key, option.events[key])
            }
        }
    }
    initPcEvent() {
        window.addEventListener('message',  (e)=> {
            var data = e.data;
            // console.log(e)
            // console.log(e , this.vid)
            switch (data.msg) {
                case "onPlayerStart": {
                    video_control.changeStatus('onPlayerStart', video_control.vid)
                    break;
                }
                case "onPlayEnd": {
                    video_control.changeStatus('end', video_control.vid)
                    break;
                }
                case 'onTimeUpdate': {
                    video_control.changeStatus('timeupdate', video_control.vid, data.time)
                    break;
                }
                case "state": {
                    var state = data.stateParam;
                    if (state == 'play') {
                        video_control.changeStatus('play', video_control.vid)
                    }
                    if (state == 'pause') {
                        video_control.changeStatus('pause', video_control.vid)
                    }
                    break;
                }
            }
        }, false);
    }
    init(option) {

        console.log($, option)
        this.selector = $('#'+option.selector)
        _createPoster(this.selector, option.poster);
        
        if (!option.poster) {
            this.play();
        }

        this.selector.on('click', '.video_poster, svg, .video_poster_null',  ()=> {
            this.selector.find('.video_poster_null').hide();
            this.play();
        })
        this.selector.on('click', '.video_poster_null',  ()=> {
            this.video_option.autoplay = true;
            this.play();
        })
        this.on('play', () => {
            if (this.option.poster) {
                _hidePoster(this.selector);
            }
        })
    }
    seekTo() {
        console.error('优酷PC版视频该接口无法调用');
        return -1;
    }
    play() {
        this.selector.find('iframe').remove();

        console.log(this)
        this.v = new YKU.Player(this.option.selector, this.video_option);
    }
    pause() {

    }
    getCurrentTime() {
        console.error('优酷PC版视频该接口无法调用');
        //iframe 没有提供相应的接口，
        // 他们的js 中有该方法 但是调用报错
        return -1;
    }
}
export default pc_yk_video