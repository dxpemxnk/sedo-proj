import { RouterProvider } from "react-router-dom";
import { router } from "../Router";
import { Provider } from "react-redux";

import store from "../store/store";

export function App(): JSX.Element {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
