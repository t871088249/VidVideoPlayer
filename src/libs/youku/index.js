import mob_yk_video from './mob_yk_video';
import pc_yk_video from './pc_yk_video';


function create_youku_video(option) {
    
    YKP.isPC = false
    // YKP.isPC = false
    if (YKP.isPC) {
       return  new pc_yk_video(option);
    } else {
       return  new mob_yk_video(option);
    }
}

export default create_youku_video