import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(AntiJailPlugin)
public class AntiJailPlugin: CAPPlugin {

    @objc func validate(_ call: CAPPluginCall) {

        let jailbreakStatus = IOSSecuritySuite.amIJailbrokenWithFailMessage()
        call.resolve([
            "status": jailbreakStatus.jailbroken,
            "detalle": jailbreakStatus.failMessage
        ])
    }
}
