let device = String(navigator.userAgent.match(/steam|macos/i)).toLowerCase();

if(
    /iPhone|iPad|iPod/i.test(navigator.userAgent) 
    || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
) device = 'ios';

document.documentElement.setAttribute('data-device',device)

// console.log(navigator.userAgent)

// if(device === 'ios'){
//     document.documentElement.style.setProperty('--max-width', `${window.innerHeight}px`);
// }



const $ = s=>document.querySelector(s);
const $$ = s=>[...document.querySelectorAll(s)];
const finalVoteStatusEl = $('.final-vote-status');
const casperEl = $('.casper');
const items = $$('.magi-item');
const bodyEl = document.body;




const randAll = _=>{
    $('.code').innerHTML = 100 + Math.floor(Math.random() * 600);
};

let sound = true;
const soundEl = $('.sound');
soundEl.onclick = e=>{
    e.stopPropagation();
    sound = !sound;
    soundEl.setAttribute('data-text',sound?'ON':'OFF');
};
soundEl.setAttribute('data-text',sound?'ON':'OFF');



// https://codepen.io/jonoliver/pen/NoawPv
// https://tomhazledine.com/web-audio-delay/

// https://mdn.github.io/webaudio-examples/step-sequencer/
let play = _=>{
    startWebAudio();
    play()
};
let stopAll = _=>{};
let playOscillator = _=>{}

let audioCtx;

let osc;
let lfo;    
let VCO;
let carrierVolume;
AudioContext = (window.AudioContext||window.webkitAudioContext);
let load = _=>{
    // startWebAudio = _=>{};
    audioCtx = new AudioContext();
    
    audioCtx.addEventListener('close',e=>{
        console.log('close')
    })

    carrierVolume = audioCtx.createGain();
    carrierVolume.gain.linearRampToValueAtTime(.5, 0);
    carrierVolume.connect(audioCtx.destination);
}
let startWebAudio = _=>{
    play = function () {
        if(!audioCtx){
            load();
        }
        osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 2080;
        
        lfo = audioCtx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = exMode?30:10;
    
        lfo.connect(carrierVolume.gain);
        osc.connect(carrierVolume);//.connect(audioCtx.destination);
        lfo.start(0);
        osc.start(0);
        // carrierVolume.gain.linearRampToValueAtTime(.1, 0);
    }
    
    playOscillator = (hz = 3400)=>{
        if(!audioCtx){
            load();
        }
    
        VCO = audioCtx.createOscillator();
        VCO.frequency.value = hz;
        VCO.connect(carrierVolume);
        VCO.start(0);
        VCO.stop(audioCtx.currentTime + .8);
        // carrierVolume.gain.linearRampToValueAtTime(.1, 0);
    }
    stopAll = _=> {
        try{
            osc.stop(0);
            lfo.stop(0);
        }catch(e){}
        try{
            VCO.stop(audioCtx.currentTime);
        }catch(e){}
        // audioCtx = null;
    }
};
document.addEventListener('visibilitychange',e=>{
    // console.log(document['hidden'])
    if( document['hidden'] ){
        stopAll();
        try{
            audioCtx.close();
            audioCtx = null;
        }catch(e){}
    }else{
        
    }
})
// document.addEventListener('touchstart',startWebAudio,{
//     once:true
// })
if(!AudioContext){
    soundEl.setAttribute('data-text','ERR');
}



let volume = 66;
let reject;
const one = _=>{
    const voteStatus = bodyEl.getAttribute('data-status') === 'voting'?'voted':'voting';
    bodyEl.setAttribute(
        'data-status',
        voteStatus
    );



    if(sound){
        stopAll();
        if(voteStatus === 'voted'){
            playOscillator(reject?3400:2000);
        }else{
            play();
        }
    }
    
    if(voteStatus === 'voted'){

    }else{
        reject = (Math.random() * 100) > volume;

        if(reject){
            items.forEach(el=>el.setAttribute('data-status','resolve'));
            if(Math.random() > .5){
                casperEl.setAttribute('data-status','reject');
            }else{
                items[Math.floor(items.length*Math.random())].setAttribute('data-status','reject');
                items.forEach(item=>{
                    if( (Math.random() * 100) > volume ){
                        item.setAttribute('data-status','reject');
                    }
                });
            }
            // bodyEl.setAttribute('data-status','data-status="voted"')
            finalVoteStatusEl.setAttribute('data-status','reject');
        }else{
            items.forEach(el=>el.setAttribute('data-status','resolve'));
            finalVoteStatusEl.setAttribute('data-status','resolve');
        }

        bodyEl.setAttribute('data-vote-status',reject?'reject':'resolve');
    
        randAll()
    }
    


};
randAll();
$('.magi-box').onclick = one;
window.onkeydown = e=>{
    const { keyCode } = e;

    if(keyCode === 32){
        one();
    }

}


//reset
$('.reset').onclick = e=>{
    e.stopPropagation();
    bodyEl.removeAttribute('data-status');
}

$('footer').onclick=e=>e.stopPropagation();


// ex mode
let exMode = false;
const exModeEl = $('.ex-mode');
exModeEl.onclick = e=>{
    e.stopPropagation();

    exMode = !exMode;
    bodyEl.setAttribute('data-ex-mode',exMode);
    exModeEl.setAttribute('data-text',exMode?'ON':'OFF');
};
exModeEl.setAttribute('data-text',exMode?'ON':'OFF');

// input file
const fileEl = $('.file');
fileEl.onclick = e=>{
    e.stopPropagation();
    fileEl.innerText = prompt('INPUT FILE',fileEl.innerText) || 'MAGI_SYS';
}


// volume
const volumeEl = $('.volume');
const volumes = [
    1,
    10,
    33,
    50,
    66,
    90,
    65535,
];
volumeEl.onclick = e=>{
    e.stopPropagation();
    const index = volumes.indexOf(volume);
        
    let nextIndex = index + 1;

    if(nextIndex >= volumes.length){
        nextIndex = 0;
    }

    volume = volumes[nextIndex];

    volumeEl.setAttribute('data-text',volume);
}

// priority
const priorityEl = $('.priority');
let priority = 'A';
const prioritys = [
    'E',
    '+++',
    'A',
    'AA',
    'AAA',
];
priorityEl.onclick = e=>{
    e.stopPropagation();
    const index = prioritys.indexOf(priority);
        
    let nextIndex = index + 1;

    if(nextIndex >= prioritys.length){
        nextIndex = 0;
    }

    priority = prioritys[nextIndex];

    priorityEl.setAttribute('data-text',priority);
}





setTimeout(_=>{
    bodyEl.removeAttribute('data-loading')
},1000);



window._hmt = [];
window.dataLayer = [
    ['js', new Date()],
    ['config', 'G-13BQC1VDD8']
];
window.gtag = function(){dataLayer.push(arguments)};

const headEl = $('head');
const loadScript = (src,cb=_=>{},el) =>{
	el = document.createElement('script');
	el.src = src;
	el.onload=cb;
	headEl.appendChild(el);
};

setTimeout(_=>{
	loadScript('//hm.baidu.com/hm.js?f4e477c61adf5c145ce938a05611d5f0');
	loadScript('//www.googletagmanager.com/gtag/js?id=G-13BQC1VDD8');
},400);