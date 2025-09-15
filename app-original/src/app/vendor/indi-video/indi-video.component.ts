import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IndiVideoEvent, IndiVideoEventNameEnum } from './indi-video.event';

declare var window: any;
declare const BEM: any;
declare const BluePlayer: any;

@Component({
  selector: 'indi-video',
  templateUrl: './indi-video.component.html',
  styleUrls: ['./indi-video.component.scss']
})
export class IndiVideoComponent {

  /**
   * Player Source
   */
  @Input() src: string;

  /**
   * Player attachment code
   */
  @Input() attachmentCode: string;

  /**
   * Language
   * This attribute allows us to change the language of the video
   * The actual personalized video has 3 available language
   * English - en
   * French - fr
   * Spanish - es
   */
  @Input() lang = 'en';

  /**
   * Auto initialization
   * This attribute allows us to decide when to initiate the player.
   * If set to false, we can initiate the player with the javascript API when needed
   */
  @Input() autoInit = true;

  /**
   * Fullscreen emulation
   * If set to true player will try to emulate fullscreen native mode
   */
  @Input() emulateFullscreen = true;

  /**
   * The environment to use.
   * Use for development purpose only
   */
  @Input() env: string;

  /**
   * Should enter fullscreen when video is played
   */
  @Input() autoFullscreen = false;

  /**
   * Should lock fullscreen to landscape when video playing
   */
  @Input() lockFullScreenToLandscape = false;

  /**
   * Media auto-play
   * This attribute allows us to autoplay the media.
   * This feature doesn't work on most the tablet and mobile devices due to data limitation
   */
  @Input() autoPlay = false;

  /**
   * Google analytics code
	 * This attribute allows us to track the video events into Google Analytics
   */
  @Input() gac: string;

  /**
   * Google analytics client code
	 * This attribute allows us to track the video events into Google Analytics for a specific client
   */
  @Input() gacc: string;

  /**
   * Use of Bluerush Branding
   * This attribute allows us to remove the Bluerush/DataIndivideo branding from the player.
   * This is impacting to look of the preloader and remove the Bluerush Signature.
   */
  @Input() useBranding = true;

  /**
   * Closed captioning activation
   * This attribute allows us to activate/desactivate the closed captioning.
   * If set to true, the closed captions will automaticaly appears on the media playback.
   */
  @Input() isSubtitle = false;

  /**
   * @output {event} Emitted when an event is received from indi-video.
   */
  @Output() emitEvent: EventEmitter<IndiVideoEvent> = new EventEmitter<IndiVideoEvent>();

  private smartPlayer: any;

  constructor(private element: ElementRef, private platform: Platform) {
    this.platform.ready().then( (source) => {
      window.individeoOnReady = this.individeoOnReady.bind(this);
      this.addScriptTag();
    });
  }

  addScriptTag() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = this.src;

    if (this.env) {
      s.setAttribute('data-bp-env', this.env);
    }
    if (this.lang) {
      s.setAttribute('data-bp-lang', this.lang);
    }
    s.setAttribute('data-bp-attachment-code', this.attachmentCode);
    s.setAttribute('data-bp-enable-emulate-fullscreen', String(this.emulateFullscreen));
    s.setAttribute('data-bp-auto-init', String(this.autoInit));
    s.setAttribute('data-bp-auto-fullscreen', String(this.autoFullscreen));
    s.setAttribute('data-bp-on-ready', 'individeoOnReady');
    if (this.gac) {
      s.setAttribute('data-bp-ga', this.gac);
    }
    if (this.gacc) {
      s.setAttribute('data-bp-gac', this.gacc);
    }
    s.setAttribute('data-bp-use-branding', String(this.useBranding));
    s.setAttribute('data-bp-is-subtitle', String(this.isSubtitle));

    this.element.nativeElement.appendChild(s);
  }

  individeoOnReady(smartPlayer: any) {
    this.smartPlayer = smartPlayer;
    this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONREADY, 'player': smartPlayer});

    BEM.bind(BluePlayer.ONFULLSCREENENTER, function(e, p) {
      if (this.lockFullScreenToLandscape) {
        screen.orientation.lock('landscape');
      }
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONFULLSCREENENTER, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONFULLSCREENEXIT, function(e, p) {
      if (this.lockFullScreenToLandscape) {
        screen.orientation.unlock();
      }
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONFULLSCREENEXIT, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONPLAY, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONPLAY, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONSTART, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONSTART, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONPAUSE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONPAUSE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONMUTE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMUTE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONUNMUTE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONUNMUTE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONLOADPROGRESS, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONLOADPROGRESS, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONLOADCOMPLETE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONLOADCOMPLETE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONMEDIACHANGE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIACHANGE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONFIRSTQUARTILECOMPLETE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONFIRSTQUARTILECOMPLETE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONMIDPOINTCOMPLETE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMIDPOINTCOMPLETE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONTHIRDQUARTILECOMPLETE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONTHIRDQUARTILECOMPLETE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONPLAYCOMPLETE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONPLAYCOMPLETE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONPLAYINCOMPLETE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONPLAYINCOMPLETE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONMETADATA, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMETADATA, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONPRELOADSTART, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONPRELOADSTART, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONPRELOADEND, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONPRELOADEND, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONTIME, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONTIME, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONSEEKSTART, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONSEEKSTART, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONSEEK, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONSEEK, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONSEEKEND, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONSEEKEND, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONBUFFERSTART, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONBUFFERSTART, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONBUFFEREND, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONBUFFEREND, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONERROR, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONERROR, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONCLOSEDCAPTIONENTER, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONCLOSEDCAPTIONENTER, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONCLOSEDCAPTIONEXIT, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONCLOSEDCAPTIONEXIT, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONCLOSEDCAPTIONLOADCOMPLETED, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONCLOSEDCAPTIONLOADCOMPLETED, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONCLOSEDCAPTIONREADY, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONCLOSEDCAPTIONREADY, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONVOLUMECHANGE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONVOLUMECHANGE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONCONTROLERHIDE, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONCONTROLERHIDE, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONCONTROLERSHOW, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONCONTROLERSHOW, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONSTOP, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONSTOP, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONDESTROY, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONDESTROY, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONENTERFRAME, function(e, p) {
      this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONENTERFRAME, 'player': p});
    }.bind(this));
    BEM.bind(BluePlayer.ONMEDIACTA, function(e, p) {
      const ctaName = p && p.ctaName;
      const ctaValue = p && p.ctaValue;
      // tslint:disable-next-line:no-shadowed-variable
      const smartPlayer = BluePlayer.current;
      /* This method will receive a "p" object that contains references to the player that fired the event itself.
      The object contains a lot of details about the player media progression. */
      if (ctaName === 'pensionEstimada12MesesAPVResponse') {
        this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIAPENSION12MONTHS, 'player': p});
      } else if (ctaName === 'pensionEstimada12MesesAnosExtraAPVResponse') {
        this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIAPENSIONEXTRAYEARS, 'player': p});
      } else if (ctaName === 'descargaTuSimulacionBtn') {
        this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIACTASEND, 'player': p});
        if (smartPlayer) { smartPlayer.destroy(); }
      } else if (ctaName === 'simulaNuevamenteBtn') {
        this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIACTASIMULATEAGAIN, 'player': p});
        if (smartPlayer) { smartPlayer.destroy(); }
      } else if (ctaName === 'contactaUnEjecutivoBtn') {
        this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIACTAEXECUTIVE, 'player': p});
        if (smartPlayer) { smartPlayer.destroy(); }
      } else if (ctaName === 'ahorroAPVSubmit') {
        this.emitEvent.emit({'name': IndiVideoEventNameEnum.ONMEDIACTAVALUEAPV, 'player': p});
      }
    }.bind(this));

    window.individeoOnReady = false;
  }

  /**
  * Initialize the indi video player with personalized data
  * @param personalizedData
  */
  initIndivideo(personalizedData: any) {
    if (this.smartPlayer) {
      this.smartPlayer.initIndivideo(personalizedData);
    }
  }

  /**
   * Play the video
   */
  play() {
    if (this.smartPlayer) {
      this.smartPlayer.play();
    }
  }

  /**
   * Replay the video
   */
  replay() {
    if (this.smartPlayer) {
      this.smartPlayer.replay();
    }
  }

  /**
   * Pause the video
   */
  pause() {
    if (this.smartPlayer) {
      this.smartPlayer.pause();
    }
  }

  /**
   * Reset the video
   */
  reset() {
    if (this.smartPlayer) {
      this.smartPlayer.reset();
    }
  }

  /**
   * Stop the video
   */
  stop() {
    if (this.smartPlayer) {
      this.smartPlayer.stop();
    }
  }
}

