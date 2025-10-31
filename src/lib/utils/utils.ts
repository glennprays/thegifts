import { NAME_STORAGE_KEY, RESULTS_STORAGE_KEY } from "$lib/constants/constants";

export function RestartTest() {
  localStorage.removeItem(NAME_STORAGE_KEY);
  localStorage.removeItem(RESULTS_STORAGE_KEY);
}
