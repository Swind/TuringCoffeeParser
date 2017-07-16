import * as request from "superagent";

export function listCookbooks() {
  return request.get("/api/cookbooks").set("Accept", "application/json");
}

export function getCookbook(id: string) {
  return request.get(`/api/cookbooks/${id}`).set("Accept", "application/json");
}

export function saveCookbook(cookbook: { _id: string }) {
  const copy = Object.assign({}, cookbook);
  const id = copy._id;
  delete copy._id;
  return request
    .put(`/api/cookbooks/${id}`)
    .send(copy)
    .set("Accept", "application/json");
}

export function copyCookbook(id: number) {
  return request
    .post(`/api/cookbooks/${id}/copy`)
    .set("Accept", "application/json");
}

export function deleteCookbook(id: number) {
  return request
    .delete(`/api/cookbooks/${id}`)
    .set("Accept", "application/json");
}

export function brewCookbook(id: number) {
  return request
    .post("/api/barista/brew")
    .send({ id })
    .set("Accept", "application/json");
}

export function getHeater() {
  return request.get("/api/heater").set("Accept", "application/json");
}

export function setTargetPoint(temperature: number) {
  return request
    .post("/api/heater")
    .send({ temperature })
    .set("Accept", "application/json");
}

export function newCookbook(cookbook: object) {
  return request
    .post("/api/cookbooks")
    .send(cookbook)
    .set("Accept", "application/json");
}

export function startPrinter() {
  return request.post("/api/printer/start").set("Accept", "application/json");
}

export function stopPrinter() {
  return request.post("/api/printer/stop").set("Accept", "application/json");
}
