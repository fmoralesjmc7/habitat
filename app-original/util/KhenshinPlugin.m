#import "KhenshinPlugin.h"
#import <Cordova/CDVPlugin.h>
#import <khenshin/khenshin.h>
#import "PaymentProcessHeader.h"
#import "AFNetworking.h"

@implementation KhenshinPlugin

- (void)pluginInitialize
{

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(finishLaunching:) name:UIApplicationDidFinishLaunchingNotification object:nil];

}
- (UIView*) processHeader {

    PaymentProcessHeader *processHeaderObj =    [[[NSBundle mainBundle] loadNibNamed:@"PaymentProcessHeader"
                                                                               owner:self
                                                                             options:nil]
                                                 objectAtIndex:0];

    //    return nil;
    return processHeaderObj;
}
- (void)finishLaunching:(NSNotification *)notification
{
    [[NSUserDefaults standardUserDefaults] setBool:NO
                                            forKey:@"KH_SHOW_HOW_IT_WORKS"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    [KhenshinInterface initWithBuilderBlock:^(KhenshinBuilder *builder){
        
        if (@available(iOS 15.0, *)) {
            UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];
            [appearance configureWithOpaqueBackground];
            appearance.backgroundColor = [UIColor colorWithRed:0.71 green:0.07 blue:0.23 alpha:1.0];
            [[UINavigationBar appearance] setStandardAppearance:appearance];
            [[UINavigationBar appearance] setScrollEdgeAppearance:appearance];
        }
        
        builder.APIUrl = @"https://khipu.com/app/enc/";
        builder.barCenteredLogo = [UIImage imageNamed:@"Bar Logo"];
        builder.barLeftSideLogo = [[UIImage alloc] init];
       //builder.processHeader = [self processHeader];
        builder.skipExitPage = NO;
        builder.keepCookies = YES;
        builder.mainButtonStyle = KHMainButtonFatOnForm;
        builder.cellPadding = 30;
        builder.hideWebAddressInformationInForm = TRUE;
        builder.cellSeparatorHeight = 2.f;
        builder.barTintColor = [UIColor colorWithRed:0.71 green:0.07 blue:0.23 alpha:1.0]; //[UIColor whiteColor];
        builder.navigationBarTextTint = [UIColor colorWithRed:1.00 green:1.00 blue:1.00 alpha:1.0]; //[UIColor cyanColor];
        builder.textColorHex = @"#4C4C4A";
        builder.principalColor = [UIColor colorWithRed:0.71 green:0.07 blue:0.23 alpha:1.0]; //[UIColor lightGrayColor];
        builder.secondaryColor = [UIColor colorWithRed:0.71 green:0.07 blue:0.23 alpha:1.0]; //[UIColor redColor];
        builder.darkerPrincipalColor = [UIColor darkGrayColor]; // [UIColor colorWithRed:0.71 green:0.07 blue:0.23 alpha:1.0];
        builder.allowCredentialsSaving = YES;
    }];
}
- (void)startByPaymentId:(CDVInvokedUrlCommand*)command
{
    [KhenshinInterface startEngineWithPaymentExternalId:[command.arguments objectAtIndex:0]
                                         userIdentifier:@""
                                      isExternalPayment:true
                                                success:^(NSURL *returnURL) {
                                                    CDVPluginResult* pluginResult = nil;
                                                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                                                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                                }
                                                failure:^(NSURL *returnURL) {
                                                    CDVPluginResult* pluginResult = nil;
                                                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
                                                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                                }
                                               animated:false];
}
- (void)startByAutomatonId:(CDVInvokedUrlCommand*)command
{
    NSMutableDictionary* parameters = [[NSMutableDictionary alloc] initWithCapacity:20];
    for(int i = 1; i < [command.arguments count] ; i ++) {
        NSArray* kv = [[command.arguments objectAtIndex:i] componentsSeparatedByString:@":"];
        [parameters setObject:[kv objectAtIndex:1] forKey:[kv objectAtIndex:0]];
    }
    [KhenshinInterface startEngineWithAutomatonId:[command.arguments objectAtIndex:0]
                                         animated:false
                                       parameters:parameters
                                   userIdentifier:@""
                                          success:^(NSURL *returnURL) {
                                              CDVPluginResult* pluginResult = nil;
                                              pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                                              [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                          }
                                          failure:^(NSURL *returnURL) {
                                              CDVPluginResult* pluginResult = nil;
                                              pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
                                              [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                          }];
}

@end
