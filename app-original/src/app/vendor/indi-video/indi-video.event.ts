// tslint:disable:max-line-length
/**
 * Event names raised by the Indi Video Component
 */
export const enum IndiVideoEventNameEnum {
    ONREADY = 'onReady',        // Event fired when the player is ready
    ONSTART = 'onStart',        // Event fired when the media can start playing. The event is dispatched only when the media metadata is loaded
    ONPLAY = 'OnPlay',          // Event fired when the player playback is played
    ONPAUSE = 'OnPause',        // Event fired when the player playback is paused
    ONMUTE = 'OnMute',          // Event fired when the player sound is muted
    ONUNMUTE = 'OnUnmute',      // Event fired when the player sound is unmuted
    ONLOADPROGRESS = 'onLoadProgress',                      // Event fired on media load progress
    ONLOADCOMPLETE = 'onLoadComplete',                      // Event fired on media load complete
    ONMEDIACHANGE = 'onMediaChange',                        // Event fired when the media changes
    ONFIRSTQUARTILECOMPLETE = 'onFirstQuartileComplete',    // Event fired when the media has completed a quarter of it playback
    ONMIDPOINTCOMPLETE = 'onMidPointComplete',              // Event fired when the media has completed half of it playback
    ONTHIRDQUARTILECOMPLETE = 'onThirdQuartileComplete',    // Event fired when the media has completed 3 quarters of it playback
    ONPLAYCOMPLETE = 'onPlayComplete',                      // Event fired when the media has completed it playback
    ONPLAYINCOMPLETE = 'onPlayIncomplete',                  // Event fired when the media has been completed and then reset to a time frame that is not the 100% of the completion
    ONMETADATA= 'onMetaData',                                // Event fired when the media has loaded it metadata
    ONPRELOADSTART= 'onPreloadStart',                        // Event fired when the player start preloading
    ONPRELOADEND= 'onPreloadEnd',                            // Event fired when the player end preloading
    ONTIME= 'OnTime',                                        // Event fired on media position change
    ONSEEKSTART= 'OnSeekStart',                              // Event fired when the user start seeking the media position
    ONSEEK= 'OnSeek',                                        // Event fired when the user seeks the media position
    ONSEEKEND= 'OnSeekEnd',                                  // Event fired when the user end seeking the media position
    ONBUFFERSTART= 'OnBufferStart',                          // Event fired when the media start buffering
    ONBUFFEREND= 'OnBufferEnd',                              // Event fired when the media end buffering
    ONERROR= 'OnError',                                      // Event fired when an error occured through the smart-player
    ONFULLSCREENENTER= 'onFullscreenEnter',                  // Event fired when user enters fullscreen mode
    ONFULLSCREENEXIT= 'onFullscreenExit',                    // Event fired when user exit fullscreen mode
    ONCLOSEDCAPTIONENTER= 'onClosedCaptionEnter',            // Event fired when user active closed captioning
    ONCLOSEDCAPTIONEXIT= 'onClosedCaptionExit',              // Event fired when user desactive closed captioning
    ONCLOSEDCAPTIONLOADCOMPLETED= 'onClosedCaptionLoadCompleted', // Event fired when the player has loaded the current media closed captioning
    ONCLOSEDCAPTIONREADY= 'onClosedCaptionReady',            // Event fired when the closed captions of the current media are ready. This event is fired after the ONCLOSEDCAPTIONLOADCOMPLETED
    ONVOLUMECHANGE= 'onVolumeChange',                        // Event fired when the smart player volume change
    ONCONTROLERHIDE= 'onControlerHide',                      // Event fired when the controler hides
    ONCONTROLERSHOW= 'onControlerShow',                      // Event fired when the controler shows
    ONSTOP= 'OnStop',                                        // Event fired when the player is stopped
    ONDESTROY= 'onDestroy',                                  // Event fired when the player is destroyed
    ONENTERFRAME= 'onEnterFrame',                            // Event fired on request animation frame based on the player default framerate
    ONMEDIACTA = 'onMediaCTA',
    ONMEDIACTASEND = 'onMediaCTAsend',
    ONMEDIACTASIMULATEAGAIN = 'onMediaCTASimulateAgain',
    ONMEDIACTAEXECUTIVE = 'onMediaCTAExecutive',
    ONMEDIACTAVALUEAPV = 'onMediaCTAValueApv',
    ONMEDIAPENSION12MONTHS = 'onMediaPension12Months',
    ONMEDIAPENSIONEXTRAYEARS = 'onMediaPensionExtraYears'
}

/**
 * Event raised by the Indi video component
 */
export class IndiVideoEvent {
    constructor(public name: IndiVideoEventNameEnum, public player: any) {}
}
