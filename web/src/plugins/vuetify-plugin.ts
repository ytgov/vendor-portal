/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles - Note that order matters here!
import "@/assets/normalize.css"
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import "@/assets/yk-style.css"

// Composables
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import * as labsComponents from "vuetify/labs/components"

import lightTheme from "@/theme/LightTheme"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  theme: {
    defaultTheme: "lightTheme",
    themes: { lightTheme },
  },
  defaults: {
    VCard: {
      rounded: "md",
      color: "white",
      elevation: "0",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      bgColor: "white",
      /* hideDetails: "auto" */
    },
    VFileInput: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      bgColor: "white",
      prependIcon: "",
      prependInnerIcon: "mdi-paperclip",
      /* hideDetails: "auto" */
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
      bgColor: "white",
      color: "primary",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      bgColor: "white",
      color: "primary",
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      bgColor: "white",
      color: "primary",
    },
    VCombobox: {
      variant: "outlined",
      density: "comfortable",
      bgColor: "white",
      color: "primary",
    },
    VListItem: {
      minHeight: "45px",
    },
    VTooltip: {
      location: "top",
    },
    VSwitch: { color: "primary", density: "comfortable" },
    VBtn: { color: "primary", elevation: "0" },
  },
})
