import com.teragrep.rlp_03.Server;
import com.teragrep.rlp_03.SyslogFrameProcessor;

import java.io.IOException;
import java.util.function.Consumer;

public class Main {
    public static void main(String[] args) throws IOException, InterruptedException {
        final Consumer<byte[]> cbFunction;

        cbFunction = (message) -> {
            System.out.println(new String(message));
        };

        int port = 1601;
        Server server = new Server(port, new SyslogFrameProcessor(cbFunction));
        server.start();
        while (true) {
            Thread.sleep(1000L);
        }
    }
}
