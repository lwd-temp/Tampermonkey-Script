// ==UserScript==
// @name         Unlimited_downloader
// @namespace    ooooooooo.io
// @version      0.1.4
// @description  Get video and audio binary streams directly, breaking all download limitations. (As long as you can play, then you can download!)
// @author       dabaisuv
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @updateURL    https://raw.githubusercontent.com/dabaisuv/Tampermonkey-Script/main/Unlimited_downloader.js
// @downloadURL  https://raw.githubusercontent.com/dabaisuv/Tampermonkey-Script/main/Unlimited_downloader.js
// @run-at       document-start
// ==/UserScript==

(function () {
   'use strict';
   console.log(`Unlimited_downloader: begin......${location.href}`);

   // let script = document.createElement('script');
   // script.setAttribute('type', 'text/javascript');
   // script.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.10.1/dist/ffmpeg.min.js";
   // document.documentElement.appendChild(script);

   //Setting it to 1 will automatically download the video after it finishes playing, and it will automatically play at 16x speed

   window.autoDownload = 1;
   window.isComplete = 0;

   window.audio = [];
   window.video = [];
   window.downloadAll = 0;
   window.quickPlay = 1.0;

   const _endOfStream = window.MediaSource.prototype.endOfStream
   window.MediaSource.prototype.endOfStream = function () {
      window.isComplete = 1;
      return _endOfStream.apply(this, arguments)
   }

   const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
   window.MediaSource.prototype.addSourceBuffer = function (mime) {
      console.log("MediaSource.addSourceBuffer ", mime)
      if (mime.toString().indexOf('audio') !== -1) {
         window.audio = [];
         console.log('audio array cleared.');
      } else if (mime.toString().indexOf('video') !== -1) {
         window.video = [];
         console.log('video array cleared.');
      }
      var sourceBuffer = _addSourceBuffer.call(this, mime)
      var _append = sourceBuffer.appendBuffer
      sourceBuffer.appendBuffer = function (buffer) {
         console.log(mime, buffer);
         if (mime.toString().indexOf('audio') !== -1) {
            window.audio.push(buffer);
         } else if (mime.toString().indexOf('video') !== -1) {
            window.video.push(buffer)
         }
         _append.call(this, buffer)
      }
      return sourceBuffer
   }

   setInterval(() => {
      if (window.downloadAll === 1) {
         let a = document.createElement('a');
         a.href = window.URL.createObjectURL(new Blob(window.audio));
         a.download = 'audio.mp4';
         a.click();
         a.href = window.URL.createObjectURL(new Blob(window.video));
         a.download = 'video.mp4'
         a.click();
         window.downloadAll = 0


         // window.open(window.URL.createObjectURL(new Blob(window.audio)));
         // window.open(window.URL.createObjectURL(new Blob(window.video)));
         // window.downloadAll = 0


         // const { createFFmpeg } = FFmpeg;
         // const ffmpeg = createFFmpeg({ log: true });
         // (async () => {
         //     const { audioName } = new File([new Blob(window.audio)], 'audio');
         //     const { videoName } = new File([new Blob(window.video)], 'video')
         //     await ffmpeg.load();
         //     //ffmpeg -i audioLess.mp4 -i sampleAudio.mp3 -c copy output.mp4
         //     await ffmpeg.run('-i', audioName, '-i', videoName, '-c', 'copy', 'output.mp4');
         //     const data = ffmpeg.FS('readFile', 'output.mp4');
         //     let a = document.createElement('a');
         //     let blobUrl = new Blob([data.buffer], { type: 'video/mp4' })
         //     console.log(blobUrl);
         //     a.href = URL.createObjectURL(blobUrl);
         //     a.download = 'output.mp4';
         //     a.click();
         // })()
         // window.downloadAll = 0;
      }
   }, 2000);

   //    setInterval(() => {
   //        if(window.quickPlay !==1.0){
   //              document.querySelector('video').playbackRate = window.quickPlay;
   // }
   //
   //   }, 2000);

   if (window.autoDownload === 1) {
      let autoDownInterval = setInterval(() => {
         //document.querySelector('video').playbackRate = 16.0;
         if (window.isComplete === 1) {
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob(window.audio));
            a.download = 'audio.mp4';
            a.click();
            a.href = window.URL.createObjectURL(new Blob(window.video));
            a.download = 'video.mp4'
            a.click();
            window.isComplete = 0;

            // window.open(window.URL.createObjectURL(new File([new Blob(window.audio)], 'audio.mp4')));
            // window.open(window.URL.createObjectURL(new File([new Blob(window.video)], 'video.mp4')));
            // window.isComplete = 0;

            // GM_download(window.URL.createObjectURL(new Blob(window.audio)));
            // GM_download(window.URL.createObjectURL(new Blob(window.video)));
            // window.isComplete = 0;

         }
      }, 2000);
   }

   (function (that) {
      let removeSandboxInterval = setInterval(() => {
         if (that.document.querySelectorAll('iframe')[0] !== undefined) {
            that.document.querySelectorAll('iframe').forEach((v, i, a) => {
               let ifr = v;
               // ifr.sandbox.add('allow-popups');
               ifr.removeAttribute('sandbox');
               const parentElem = that.document.querySelectorAll('iframe')[i].parentElement;
               a[i].remove();
               parentElem.appendChild(ifr);
            });
            clearInterval(removeSandboxInterval);
         }
      }, 1000);
   })(window);




   // Your code here...
})();
