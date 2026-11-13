package de.thm.pi2.echo_server;

import de.thm.pi2.echo_server.echo.api.EchoApi;
import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;

public class Start {
  public static void main(String[] args) {
    int port = 8888;
    var vertx = Vertx.vertx();
    var router = Router.router(vertx);

    var echoApi = new EchoApi();
    echoApi.appendRouting(router);

    vertx.createHttpServer()
      .requestHandler(router)
      .listen(port).onSuccess(http -> {
        System.out.println("HTTP server started on port 8888");
      });
  }
}
