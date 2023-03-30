import store from "@/store"

export function getToken() {
  return store.getters.access_token ? store.getters.access_token : ''
}
