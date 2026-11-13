package de.thm.pi2.echo_server.echo.api;

import de.thm.pi2.echo_server.echo.dto.UserRequest;
import de.thm.pi2.echo_server.echo.dto.UserResponse;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import java.util.UUID;

public class EchoApi {

  public void appendRouting(Router router) {
    router.get("/echo").handler(this::handleEcho);
    router.post("/echoUser")
      .handler(BodyHandler.create())
      .handler(this::handleEchoUser);
  }

  private void handleEcho(RoutingContext rc) {
    String message = rc.request().getParam("message");
    if (message == null) {
      rc.response().setStatusCode(400).end("Missing 'message' parameter");
    } else {
      rc.response().setStatusCode(200).end("Echo: " + message);
    }
  }

  private void handleEchoUser(RoutingContext rc) {
    try {
      UserRequest req = rc.body().asPojo(UserRequest.class);
      UserResponse res = new UserResponse(UUID.randomUUID().toString(), req.email());
      rc.response()
        .setStatusCode(200)
        .putHeader("content-type", "application/json")
        .end(Json.encode(res));
    } catch (Exception e) {
      rc.response().setStatusCode(400).end("Invalid JSON format");
    }
  }
}
