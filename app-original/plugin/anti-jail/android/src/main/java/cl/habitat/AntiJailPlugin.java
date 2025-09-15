package cl.habitat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AntiJail")
public class AntiJailPlugin extends Plugin {

    @PluginMethod
    public void validate(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("status", true);
        ret.put("detalle", true);
        call.resolve(ret);
    }
}
