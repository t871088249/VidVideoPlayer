
import videoControl from '../videoControl/index';
import $ from 'jQuery';
const blur_str = '-webkit-filter:blur(10px);-moz-filter:blur(10px);-o-filter:blur(10px);-ms-filter:blur(10px);filter:blur(10px);'


function isFullscreen(){
    
    return !!( document.fullscreen ||  document.mozFullScreen ||document.webkitIsFullScreen ||document.webkitFullScreen || document.msFullScreen)
}

function toggleFullscreen(docElm){
    
    if (!isFullscreen()) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen()
        }
    } else {
        
        exitFullscreen()
    }
    
}

function exitFullscreen() {
    let document = window.document
    if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
}



class yk_video_creator  extends videoControl{
    constructor(option) {
        super(option.vid, option.playStopOther);
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
            this.video_option.poster = option.poster
        }
        if (option.autoplay) {
            this.video_option.autoplay = option.autoplay
        }
        this.initUserEvent(option)
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
    
    init(option) {
        let _this = this;
        let {selector,autoplay} = option;
        
        this.video_option.events = {
            onPlayerReady:  ()=>{
                this.emit('ready')
                if (autoplay) {
                    try {
                        setTimeout( ()=>{
                            _this.play()
                        }, 600)
                    } catch (error) {
                        console.log(error);
                    }
                }
                $('video').attr({
                    'webkit-playsinline': 'playsinline',
                    'x-webkit-airplay': 'allow',
                    'playsinline': 'true',
                    'x5-playsinline': 'true',
                    'x5-video-player-type': 'h5-page',
                    'x5-video-player-fullscreen': 'true'
                })
                var box = $(this.v.select._h5player.playerCon);
                
                if (this.v.select._poster) {
                    var img = box.find('.x-video-poster');
                    img.css('object-fit', 'contain')
                    img.html('<div style="overflow: hidden;"><img style="' + blur_str + '" src="' + _this.v.select._poster + '"></div> <img style="position: absolute; top: 0; left: 0;object-fit: contain" src="' + this.v.select._poster + '">')
                }

                if (!YKP.isPC) {
                    $('#' + selector).on('mouseover', function () {
                        // console.log('hover')
                        $('#' + selector).find('.x-video-title,.x-gradient,.x-dashboard .x-console-wrap').show()
                        // this.v.showControls()
                    })
                    $('#' + selector).on('mouseleave',  function () {
                        // this.v.hideControls()
                        $('#' + selector).find('.x-video-title,.x-gradient,.x-dashboard .x-console-wrap').hide()
                    })
                    $('#' + selector).on('click', '.i_play',  ()=> {
                        this.pause()
                    })
                    $('#' + selector).on('click', '.i_pause',  ()=> {
                        this.play()
                    })
                    $('#' + selector).on('click', '.i_fscreen',  ()=> {
                        try {
                            toggleFullscreen($('#' + selector).find('.ykplayer')[0])
                        } catch (error) {
                            console.log(error)
                        }
                    })

                    $('#' + selector).on('mousedown', '.seek-btn', (e) => {
                        let startTime = this.getCurrentTime();
                        let total = this.v.totalTime();
                        let width = $('#' + selector).find('.x-progress-track').width();
                        var startWidth = startTime / total  * width;
                        let l = e.clientX;
                        let ex = e.clientX
                        
                        $('#' + selector).find('.x-prompt').show();
                        let seekToTime = startTime
                        let move = e => {
                            ex = e.clientX
                            let offset = ex - l;
                            let curWidth = startWidth + offset;
                            if (curWidth < 0) {
                                curWidth = 0
                            }
                            if (curWidth > width) {
                                curWidth = width;
                            }
                            $('#' + selector).find('.x-progress-play').css('width', curWidth)
                            seekToTime = Math.floor(curWidth / width * total);
                            let s = seekToTime % 60;
                            let m = Math.floor(seekToTime / 60)
                            $('#' + selector).find('.x-current').html(`${m}:${s}`)
                            
                        }
                        let up = () => {
                            $(window).off('mousemove', move)
                            $(window).off('mouseup', up)
                            $('#' + selector).find('.x-prompt').hide()

                            this.seekTo(seekToTime)

                        }
                        
                        $(window).on('mousemove', move)
                        $(window).on('mouseup', up )
                    })
                    
                    this.on('timeupdate', (vid, t) => {
                        let total = this.v.totalTime();
                        let p = (t / total*100).toFixed(2);
                        $('#' + selector).find('.x-progress-play').css('width', p+'%')
                    })
                }
            },
            onPlay :() =>{
                this.emit('play');
            },
            onPause:  ()=> {
                this.emit('pause');
            },
            onTimeupdate:  (t) =>{
                this.emit('timeupdate', this.vid, t);
            },
            onPlayEnd:  () =>{
                this.emit('end');
            },
            onError:  (err) =>{
                this.emit('error', err);
            }
        };
        this.v = new YKU.Player(selector, this.video_option);
    }
    seekTo(t) {
        if (!isNaN(t)) {
            this.v.seekTo(t);
        }
    }
    play() {
        this.v.playVideo()
    }
    pause() {
        this.v.pauseVideo();
    }
    getTotalTime() {
        return this.v.totalTime()
    }
    getCurrentTime() {
        return this.v.currentTime();
    }
}
export default yk_video_creator