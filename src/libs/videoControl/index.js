import event from '../event';
class videoControl extends event {
    static videoCollections = [];
    static stopOtherVideo = (vid) => {
        videoControl.videoCollections.forEach(item => {
            if (item.vid != vid) {
                item.pause()
            }
        })
    }
    constructor(vid, playStopOther = true) {
        super()
        this.vid = vid;
        this.on('ready', () => {
            videoControl.videoCollections.push(this);
        })
        this.on('play', () => {
            if (playStopOther) {
                videoControl.stopOtherVideo(this.vid)
            }
        })
    }
    
    pause() {
        
    }
    play() {
        
    }
    
    
}

export default videoControl