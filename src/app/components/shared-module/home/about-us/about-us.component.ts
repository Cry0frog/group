import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor() { }
  public partnerPlayer: Window;

  playerInfoList = [{
    id: 'player1',
    videoId: 'RA_CADpMB94'
  }, {
    id: 'player2',
    videoId: 'M2_QN7BHiVY'
  }]

  init() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.setAttribute("id", "youtube");

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window['onYouTubeIframeAPIReady'] = () => {
      this.playerInfoList.forEach(el => this.startVideo(el));
    };
  }

  ngOnInit() {
    window["YT"] = null;
    this.init();
  }

  startVideo(pleyerInfo) {
    this.partnerPlayer = new window["YT"].Player( pleyerInfo.id, {
      videoId: pleyerInfo.videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1
      },
    });
  }
}
