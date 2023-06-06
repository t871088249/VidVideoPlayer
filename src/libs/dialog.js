import $ from 'jQuery';
import event from './event';

class dialog extends event{
    constructor(trigger ,selecotr) {
        super()
        this.trigger = $(trigger);
        this.selector = selecotr;
        this.needUserPlay = false;
        this.init()
    }
    init() {
        let width = window.innerWidth > 1008 ? 1008 : window.innerWidth
        let height = width * 9 / 16;
        if ($('.video_player_dialog').length == 0) {
         

            let videoStyle = `width: ${width}px;height: ${height}px;margin-left: -${width / 2}px;margin-top: -${height / 2}px;`
            let str = `<div class="video_player_dialog" >
                    <div class="close" >x</div>
                    <div class="video_creator_dialog_video" style="${videoStyle}">
                        <div class="video_create_dialog_el" style="width: 100%; height: 100%"></div>
                    </div>
                </div>`;
            $('body').append(str)
            $('.video_player_dialog').on('click', '.close', () => {
                this.hide()
            })
        }
        $(this.trigger).on('click', () => {
            if ($('.video_create_dialog_el').attr('id') != this.selector) {
                $('.video_player_dialog').find('.video_create_dialog_el').children().remove()
            }
            this.show()
            if ($('.video_create_dialog_el').attr('id') != this.selector) {
                $('.video_player_dialog').find('.video_create_dialog_el').attr('id', this.selector)
                this.needUserPlay = false;
                this.emit('creatVideo')

            }
        })
    }

    show() {
        $('.video_player_dialog').fadeIn(() => {
            this.emit('show')
            this.needUserPlay = true;
        });
    }
    hide() {
        $('.video_player_dialog').fadeOut(() => {
            this.emit('hide')
        });
    }
}


export default function createDialog(trigger, selecotr) {
    return  new dialog(trigger, selecotr)
    
}