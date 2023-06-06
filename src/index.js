
// import {  yk_video_creator} from "./libs/yk";
import tx_video_creator from "./libs/tencent/";
import create_youku_video from "./libs/youku/";
import createDialog from "./libs/dialog";



import './css/index.scss'

const defaultOption = {
    vid: '',
    vid_from: '',
    dialogPlayer: false,
    playStopOther: true,
    events: { }
}

class videoCreator  {
    constructor(option={}) {
        this.option = Object.assign({}, defaultOption, option);
        let { selector, vid, vid_from } = this.option;

        if (!selector) {
            console.error('option.selector is required!');
            return false;
        }
        if (!vid) {
            console.error('option.vid is required!');
            return false;
        }
        if (!vid_from) {
            console.error('option.vid_from is required!');
            return false;
        }
        
        this.videoItem = null;

        this.init()
    }


    init() {
        let { selector, vid, vid_from, dialogPlayer , client_id } = this.option;

        if (dialogPlayer) {

            this.dialog = createDialog(this.option.trigger, selector);

            this.dialog.on('creatVideo', () => {
                this.option.autoplay = true;
                if (vid_from == 'yk') {
                    this.videoItem = create_youku_video(this.option);
                }
                if (vid_from == 'tx') {
                    this.videoItem = new tx_video_creator(this.option);
                }
            })
            this.dialog.on('show', () => {
                // this.play()
                if (this.dialog.needUserPlay) {
                    this.play()
                }
            })
            this.dialog.on('hide', () => {
                this.pause()
            })
            
        } else {
            if (vid_from == 'yk') {
                this.videoItem = create_youku_video(this.option);
            }
            if (vid_from == 'tx') {
                this.videoItem = new tx_video_creator(this.option);
            }
        }
        
    }
    pause() {
        this.videoItem.pause();
    }
    seekTo(t) {
        if (!isNaN(t)) {
            this.videoItem.seekTo(t);
        }
    }
    play() {
        this.videoItem.play();
    }
    getCurrentTime () {
        return this.videoItem.getCurrentTime();
    }
    on(eventName, handler) {
        if (this.option.dialogPlayer) {
            return  '请使用option.events'
        }
        this.videoItem.on(eventName, handler)
    }
    off(eventName , handler) {
        this.videoItem.off(eventName, handler)
    }
    emit(eventName , ...args) {
        this.videoItem.emit(eventName, ...args)
    }
    once(eventName, handler) {
        if (this.option.dialogPlayer) {
            return  '请使用option.events'
        }
        this.videoItem.once(eventName, handler)
    }
}

export default videoCreator;